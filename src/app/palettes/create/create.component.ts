import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Palette, Swatch, RGBd } from '../palette'
import { ResizedEvent } from 'angular-resize-event';
import hueFragmentShaderSrc from '../../../assets/rgb-wheel-fragment-shader.glsl';
import hueVertexShaderSrc from '../../../assets/colorwheel-vertex-shader.glsl';
import { WebGLService } from "../web-gl.service";
import {RGB} from '../RGB';
import { DarkModeService } from "../../dark-mode.service";
import { timer } from 'rxjs';
import { ColorConfig, Distribution, Color } from '../../../proto/color_config';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ColorLoader, HS } from '../color-loader';
import ColorUtil from "../color-util";

class ColorWheelMarker {
  color: string = "";
  transformOrigin: string = "";
  transform: string = "";

  init(angle: number, radius: number, color: string, sizeX: number, sizeY: number ) {
    this.color = color;
    this.transformOrigin = `${-radius * sizeX/2}px 0px`;
    let m = new WebKitCSSMatrix();
    m.translateSelf(sizeX/2 + sizeX/2 * radius, sizeY/-2, 0);
    m.rotateSelf(-angle);
    m.translateSelf(-8, -8, 0);
    this.transform = `matrix3d(${m.m11}, ${m.m12}, ${m.m13}, ${m.m14},
                      ${m.m21}, ${m.m22}, ${m.m23}, ${m.m24},
                      ${m.m31}, ${m.m32}, ${m.m33}, ${m.m34},
                      ${m.m41}, ${m.m42}, ${m.m43}, ${m.m44})`;
  }
}

class RgbSwatch implements Swatch {
  h: number = 0;
  hOffset: number = 0;
  s: number = 1;
  sOffset: number = 0;
  constantSaturation: boolean = false;
  marker: ColorWheelMarker = new ColorWheelMarker();
  colors: RGBd[] = [];
  baseColor: RGB | undefined;

  get hue(): number {
    return (this.h + this.hOffset) % 1;
  }

  get saturation(): number {
    return Math.min(Math.max(0, this.s + this.sOffset), 1);
  }

  loadRgb(r: number, g: number, b: number) {
    let rgb = {r: r/255, g:g/255, b:b/255};
    this.setSaturationOffset(ColorUtil.getSaturation(rgb));
    ColorUtil.desaturate(rgb);
    this.setHueOffset(ColorUtil.rgbToHue(rgb.r, rgb.g, rgb.b) / 360);
  }

  setHue(h: number) {
    this.h = h;
  }

  setHueOffset(h: number) {
    this.hOffset = h - this.h;  
  }

  setSaturation(s: number, constantSaturation: boolean) {
    this.s = s;
    this.constantSaturation = constantSaturation;
  }

  setSaturationOffset(s: number) {
    this.sOffset = s - this.s;  
  }

  update(colorWheelSizeX: number, colorWheelSizeY: number, min: number, max: number, step: number) {
    this.baseColor = new RGB(this.hue * 360, this.saturation);
    this.marker.init(
      this.hue * 360,
      this.saturation,
      this.baseColor.hexString,
      colorWheelSizeX,
      colorWheelSizeY);
    this.colors.length = 0;
    for (let i = min;; i += step) {
      if (i > max) {
        i = max;
      }
      this.colors.push(this.baseColor.getAtScale(i));
      if (i >= max) {
        break;
      }
    }
  }
}

@Component({
    selector: 'aa-create',
    templateUrl: './create.component.html',
    standalone: false
})
export class CreateComponent {
  private hueService: WebGLService = new WebGLService();
  offsetMaxSize: number = 4096;
  saturationMaxSize: number = 256;
  colorWheelSizeX: number = 0;
  colorWheelSizeY: number = 0;
  swatches: RgbSwatch[] = [];
  swatchesCopy: RgbSwatch[] = [];
  defaultHueCount: number = 7;
  defaultDistribution: Distribution = Distribution.DISTRIBUTION_EQUAL;
  distribution:Distribution = this.defaultDistribution;
  proximity: number = 30;
  hueCount: number = this.defaultHueCount;
  markerDragIndex: number = -1;
  markerDragged:any = null;
  defaultHueOffset:number = 0;
  hueOffset: number = this.defaultHueOffset;
  defaultSaturation: number = Math.round(.95 * this.saturationMaxSize);
  saturation: number = this.defaultSaturation;
  saturationDirtyMarkerDrag: boolean = false;
  offsetDirtyMarkerDrag: boolean = false;
  constantSaturation: boolean = false;
  defaultLightnessMin: number = 10;
  defaultLightnessMax: number = 95;
  lightnessMin: number = this.defaultLightnessMin;
  lightnessMax: number = this.defaultLightnessMax;
  lightnessDirty: boolean = false;
  defaultLightnessStep: number = 10;
  lightnessStep: number = this.defaultLightnessStep;
  lightnessStepDirty: boolean = false;
  markerStart: any = {};
  colorWheelInitialized: boolean = false;
  saturationDirty: boolean = false;
  hueDirty: boolean = false;
  updatePending: boolean = false;
  showConfiguration: boolean = !('showConfiguration' in localStorage) 
                || localStorage['showConfiguration'] === 'true';

  private colorWheel: ElementRef<HTMLCanvasElement> | null = null;
  @ViewChild('colorWheel') set _colorWheel(colorWheel: ElementRef<HTMLCanvasElement>) {
    if(colorWheel) {
      this.colorWheel = colorWheel;
    }
  }

  private colorWheelDiv: ElementRef<HTMLElement> | null = null;
  @ViewChild('colorWheelDiv') set _colorWheelDiv(colorWheelDiv: ElementRef<HTMLElement>) {
    if(colorWheelDiv) {
      this.colorWheelDiv = colorWheelDiv;
      if (this.hueService.initialiseWebGLContext(
        this.colorWheel!.nativeElement,
        hueFragmentShaderSrc,
        hueVertexShaderSrc)) {
          this.darkModeService.darkMode$.subscribe(dark => {
            this.drawColorWheel();
          });
      }
    }
  }

  private dragTips: ElementRef<HTMLElement> | null = null;
  @ViewChild('colorWheelDiv')
  set _dragTips(dragTips: ElementRef<HTMLElement>) {
    if(dragTips) {
        this.dragTips = dragTips;
    }
  }

  palette: Palette = { 
    swatches: this.swatchesCopy,
    showConfiguration: this.showConfiguration,
    toggleConfiguration: this.toggleConfiguration.bind(this),
    copyLink: this.copyLink.bind(this),
  };

  constructor(private snackBar: MatSnackBar, private darkModeService: DarkModeService, private router: Router) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.initPath(decodeURIComponent(this.router.url.slice(1)));
      }
    });
  }

  initPath(path: string) {
    this.reset();
    if (path.length == 0) {
      return;
    }
    const color = ColorLoader.getHS(path);
    if (color) {
      this.defaultHueCount = 1;
      this.hueCount = this.defaultHueCount;;
      this.defaultDistribution = Distribution.DISTRIBUTION_NEAR;
      this.distribution = this.defaultDistribution;
      this.proximity = 30;
      let swatch = new RgbSwatch();
      this.swatches.push(swatch);
      this.defaultHueOffset = this.offsetMaxSize * (color.hue / 360 % 1);
      this.hueOffset = this.defaultHueOffset;
      this.defaultSaturation = color.saturation * this.saturationMaxSize;
      this.saturation = this.defaultSaturation;
      this.updateHues();
      return;
    }
    try {
      const config = ColorLoader.deserializeConfig(path);
      this.initFromConfig(config);
    } catch(e) {
    }
  }

  reset() {
    this.swatches.length = 0;
    this.swatchesCopy.length = 0;
    this.markerDragIndex = -1;
    this.markerDragged = null;
    this.offsetDirtyMarkerDrag = false;
    this.saturationDirtyMarkerDrag = false;
    this.hueCount = this.defaultHueCount = 7;
    this.distribution = this.defaultDistribution = Distribution.DISTRIBUTION_EQUAL;
    this.proximity = 30;
    this.defaultHueOffset = this.hueOffset = 0;
    this.defaultSaturation = this.saturation = Math.round(.95 * this.saturationMaxSize)
    this.lightnessStep = this.defaultLightnessStep = 10;
    this.lightnessMin = this.defaultLightnessMin = 10;
    this.lightnessMax = this.defaultLightnessMax = 95;
    this.updateHues();
  }

  initFromConfig(config: ColorConfig) {
    let validRange = (value: number, min: number, max: number, name: string) => {
      if (value < min || value > max) {
        console.error("invalid " + name);
        return false;
      }
      return true;
    };

    if (!validRange(config.hue_count, 1, 128, "hue count")
      || !validRange(config.hue_offset, 0, this.offsetMaxSize, "hue offset")
      || !validRange(config.saturation, 0, this.saturationMaxSize, "saturation")
      || !validRange(config.scale_min, 0, 100, "lightness min")
      || !validRange(config.scale_max, 0, 100, "lightness max")
      || !validRange(config.scale_step, 0, 100, "lightness step")
      || !validRange(config.colors.length, 0, config.hue_count*3, "colors")) {
      return;
    }

    this.hueCount = this.defaultHueCount = config.hue_count;
    this.distribution = this.defaultDistribution = config.distribution;
    this.hueOffset = this.defaultHueOffset = config.hue_offset * this.offsetMaxSize;
    this.saturation = this.defaultSaturation = config.saturation * this.saturationMaxSize;
    this.saturationDirty = this.saturation != this.defaultSaturation;
    this.lightnessMin = this.defaultLightnessMin = config.scale_min;
    this.lightnessMax = this.defaultLightnessMax = config.scale_max;
    this.lightnessStep = this.defaultLightnessStep = config.scale_step;
    this.updateHues();
    if (config.colors.length == 0) {
      return;
    }
    for (let i = 0; i < config.colors.length; i++) {
      const color = config.colors[i];
      let swatch = this.swatches[color.index];
      swatch.setHueOffset(color.hue);
      swatch.setSaturationOffset(color.saturation);
      if (Math.abs(swatch.sOffset) > .00001) {
        this.saturationDirtyMarkerDrag = true;
      }
      if (Math.abs(swatch.hOffset) > .00001) {
        this.offsetDirtyMarkerDrag = true;
      }
    }
  }

  onColorWheelResized(event: ResizedEvent) {
    this.colorWheelSizeX = event.newRect.width;
    this.colorWheelSizeY = this.colorWheelSizeX;
    this.colorWheel!.nativeElement.width = this.colorWheelSizeX;
    this.colorWheel!.nativeElement.height = this.colorWheelSizeY;
    this.hueService.updateViewport();
    this.drawColorWheel();
    this.updateHues();
  }

  private drawColorWheel() {
    const dark:boolean = this.darkModeService.darkMode$.value;
    let r = dark ? .059 : 1;
    let g = dark ? .09 : 1;
    let b = dark ? .164 : 1;
    this.hueService.setShaderVec3("bgColor", r, g, b);
    this.hueService.drawScene();
  }

  toggleConfiguration() {
    this.showConfiguration = !this.showConfiguration;
    localStorage['showConfiguration'] = this.showConfiguration ? 'true' : 'false';
  }

  onHueChanged() {
    this.hueDirty = true;
    this.saturationDirty = true;
    this.scheduleUpdate();
  }

  resetOffset() {
    this.hueOffset = this.defaultHueOffset;
    this.offsetDirtyMarkerDrag = false;
    for (let hue of this.swatches) {
      hue.hOffset = 0;
    }
    this.updateHues();
    this.updatePalette();
  }

  resetSaturation() {
    this.saturation = this.defaultSaturation;
    this.constantSaturation = false;
    this.saturationDirtyMarkerDrag = false;
    for (let hue of this.swatches) {
      hue.s = this.saturation;
      hue.sOffset = 0;
    }
    this.updateHues();
  }

  resetLightness() {
    this.lightnessMin = this.defaultLightnessMin;
    this.lightnessMax = this.defaultLightnessMax;
    this.lightnessDirty = false;
    this.updateHues();
  }

  resetLightnessStep() {
    this.lightnessStep = this.defaultLightnessStep;
    this.lightnessStepDirty = false;
    this.updateHues();
  }

  updateHues(updateHue: boolean=true, updateSaturation: boolean=true) {
    if (this.hueCount < this.swatches.length) {
      this.swatches.length = this.hueCount;
    } else while (this.hueCount > this.swatches.length) {
      let hue = new RgbSwatch();
      this.swatches.push(hue);
    }
    const offsets = this.getHueOffsets();
    for (let i = 0; i < offsets.length; i++) {
      const h = offsets[i];
      if (updateHue) {
        this.swatches[i].setHue(h);
      }
      if (updateSaturation) {
        this.swatches[i].setSaturation(this.saturation / this.saturationMaxSize, this.constantSaturation);
      }
      this.swatches[i].update(
        this.colorWheelSizeX,
        this.colorWheelSizeY,
        this.lightnessMin,
        this.lightnessMax,
        this.lightnessStep);
    }
    if (this.swatchesCopy.length != this.swatches.length) {
      this.updatePalette();
    }
  }

  private getHueOffsets(): number[] {
    let offsets: number[] = [];
    if (this.distribution === Distribution.DISTRIBUTION_EQUAL) {
      const step = 1 / this.hueCount;
      let current = .25;
      for (let i = 0; i < this.hueCount; i++, current += step) {
        const h = (current + this.hueOffset / this.offsetMaxSize / this.hueCount) % 1;
        offsets.push(h);
      }
    } else if (this.distribution == Distribution.DISTRIBUTION_NEAR) {
      const center = this.hueOffset / this.offsetMaxSize;
      const centerOffset = this.hueCount <= 1 ? 0 : this.proximity / 360 / 2;
      let step = this.hueCount === 1 ? 0 : this.proximity / 360 / (this.hueCount - 1);
      let current = center - centerOffset;
      for (let i = 0; i < this.hueCount; i++, current += step) {
        offsets.push(current % 1);
      }
      offsets.reverse();
    }
    return offsets;
  }
  
  copyLink() {
    const link = this.getPermalink();
    navigator.clipboard.writeText(link);
    this.snackBar.open('copied ' + link, '', {
      duration: 3000
    });
  }

  getPermalink(): string {
    let colorConfig = new ColorConfig();
    colorConfig.hue_count = this.hueCount;
    colorConfig.distribution = this.distribution;
    colorConfig.proximity = this.proximity;
    colorConfig.hue_offset = this.hueOffset / this.offsetMaxSize;
    colorConfig.saturation = this.saturation / this.saturationMaxSize;
    colorConfig.scale_min = this.lightnessMin;
    colorConfig.scale_max = this.lightnessMax;
    colorConfig.scale_step = this.lightnessStep;

    let index = 0;
    let colors:Color[] = [];
    for (let i = 0; i < this.swatches.length; i++) {
      let s = this.swatches[i];
      if (s.hOffset === 0 && s.sOffset === 0) {
        continue;
      }
      let color = new Color();
      color.index = i;
      color.hue = s.hue;
      color.saturation = s.saturation;
      colors.push(color);
    }
    colorConfig.colors = colors;

    return "https://rgbtable.com/" + ColorLoader.serializeConfig(colorConfig);
  }

  updatePalette() {
    this.palette.swatches.length = 0;
    for (let i = 0; i < this.swatches.length; i++) {
      this.swatchesCopy.push(this.swatches[i]);
    }
    if (this.distribution === Distribution.DISTRIBUTION_EQUAL) {
      this.swatchesCopy.sort((a, b) => {
        let h1 = a.h - .25 + a.hOffset;
        if (h1 < 0) h1++;
        let h2 = b.h - .25 + b.hOffset;
        if (h2 <= 0) h2++;
        return h2 - h1;
      });
    }
  }

  onLightnessChanged() {
    this.lightnessDirty = this.lightnessMin != this.defaultLightnessMin ||
      this.lightnessMax != this.defaultLightnessMax;
    this.updateHues();
  }

  onLightnessStepChanged() {
    this.lightnessStepDirty = this.lightnessStep != this.defaultLightnessStep;
    this.updateHues();
  }

  onHueOffsetChanged() {
    this.hueDirty = true;
    this.scheduleUpdate();
  }

  onSaturationChanged() {
    this.saturationDirty = true;
    this.scheduleUpdate();
  }

  onDistributionChanged() {
    this.onHueOffsetChanged();
    this.updatePalette();
  }

  scheduleUpdate() {
    if (!this.updatePending) {
      this.updatePending = true;
      const source = timer(100);
      const subscription = source.subscribe(val => {
        this.updateHues(this.hueDirty, this.saturationDirty);
        this.updatePending = false;
      });
    }
  }

  onConstantSaturationChanged() {
    this.updateHues();
  }

  get hueOffsetDirty(): boolean {
    return this.offsetDirtyMarkerDrag || this.hueOffset != this.defaultHueOffset;
  }

  get saturationChanged(): boolean {
    return this.saturationDirtyMarkerDrag 
      || this.saturation != this.defaultSaturation 
      || this.constantSaturation;
  }

  onMarkerDragStart(event: any) {
    if(this.markerDragIndex >= 0) return;
    this.markerStart = this.getUV(event);
    this.markerDragged = event.srcElement;
    this.markerDragIndex = parseInt(this.markerDragged.childNodes[0].innerHTML);
  }

  onMarkerDragStop() {
    this.markerDragIndex = -1;
    this.markerDragged = null;
    this.updatePalette();
  }

  onMarkerDragged(event: any) {
    if(this.markerDragged === null) return;
    let uv = this.getUV(event);
    let hue = this.swatches[this.markerDragIndex];
    if (!event.altKey) {
      let angle = Math.atan2(uv.v, uv.u) / (2 * Math.PI);
      if (angle < 0) {
        angle += 1;
      }
      const h = angle % 1;
      hue.setHueOffset(h);
      this.offsetDirtyMarkerDrag = true;
    }
    if (!event.shiftKey) {
      if (event.altKey) {
        if (Math.sign(uv.u) !== Math.sign(this.markerStart.u)) {
          uv.u = 0;
        }
        if (Math.sign(uv.v) !== Math.sign(this.markerStart.v)) {
          uv.v = 0;
        }
      }
      let s = Math.min(1, Math.sqrt(uv.u * uv.u + uv.v * uv.v));
      hue.setSaturationOffset(s);
      this.saturationDirtyMarkerDrag = true;
    }
    hue.update(this.colorWheelSizeX, this.colorWheelSizeY, this.lightnessMin, this.lightnessMax, this.lightnessStep);
    this.markerDragged.style.backgroundColor = hue.marker.color;
  }

  getUV(event: any): any {
    let src = event.srcElement;
    let parentBounds = this.colorWheel!.nativeElement.getBoundingClientRect();
    let x = event.clientX - parentBounds.x;
    let y = event.clientY - parentBounds.y;
    const u = (x / parentBounds.width - .5) * 2;
    const v = (y / parentBounds.height - .5) * -2;
    return {u:u, v:v};
  }
}
