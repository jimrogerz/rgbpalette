import {sRGB, RGBd} from './palette';
import ColorUtil from "./color-util";

export class RGB implements sRGB {
  hexString: string = "";
  r: number = 0;
  g: number = 0;
  b: number = 0;
  private h: number;
  private s: number;

  constructor(angle: number, saturation: number) {
    saturation = Math.pow(saturation, 1/2.2);
    this.h = Math.round(angle / 360 * 65535);
    this.s = Math.round(saturation * 255);
    const rgb = ColorUtil.hueToRgb(this.h / 65535 * 360);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    ColorUtil.saturate(rgb, this.s / 255);
    this.hexString = ColorUtil.toHex(rgb);
  }

  save(bytes: Uint8Array, index: number) {
    bytes[index] = this.h >> 8;
    bytes[index+1] = this.h & 0xff;
    bytes[index+2] = Math.round(this.s);
  }

  getAtScale(scale: number): RGBd {
    return new RGBdisplay(this.r, this.g, this.b, this.s / 255, scale);
  }
}

class RGBdisplay implements RGBd {
  hexString: string = "";
  _hexStringC: string | undefined;
  shade: number = 0;

  private rgb: sRGB = {r:0, g:0, b:0};
  private rgbc: sRGB = {r:1, g:1, b:1};
  private s: number;
  private scale: number;

  constructor(r: number, g: number, b: number, saturation: number, scale: number) {
    this.rgb.r = r;
    this.rgb.g = g;
    this.rgb.b = b;
    this.rgbc.r = 1 - r;
    this.rgbc.g = 1 - g;
    this.rgbc.b = 1 - b;
    this.s = saturation;
    this.scale = scale;

    ColorUtil.saturate(this.rgb, saturation);
    ColorUtil.setLightness(scale, this.rgb)
    this.shade = Math.round(ColorUtil.lightness(this.rgb));
    ColorUtil.gamma(this.rgb);
    this.hexString = ColorUtil.toHex(this.rgb);
  }

  get hexStringC(): string {
    if (!this._hexStringC) {
      ColorUtil.saturate(this.rgbc, this.s);
      ColorUtil.setLightness(this.scale, this.rgbc)
      ColorUtil.gamma(this.rgbc);
      this._hexStringC = ColorUtil.toHex(this.rgbc);
    }
    return this._hexStringC!;
  }
}
