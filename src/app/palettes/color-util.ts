import { sRGB } from './palette';

export default class ColorUtil {
  private static Rs: number = 0.2126;
  private static Gs: number = 0.7152;
  private static Bs: number = 0.0722;

  static hueToRgb(angle: number): sRGB {
    angle -= 90.0;
    if (angle < 0.0) {
        angle += 360.0;
    }
    let r = 0.0;
    let g = 0.0;
    let b = 0.0;
    if (angle < 60.0) {
        r = 1.0;
        b = angle / 60.0;
    } else if (angle < 120.0) {
        r = (120.0 - angle) / 60.0;
        b = 1.0;
    } else if (angle < 180.0) {
        b = 1.0;
        g = 1.0 - (180.0 - angle) / 60.0;
    } else if(angle < 240.0) {
        g = 1.0;
        b = (240.0 - angle) / 60.0;
    } else if (angle < 300.0) {
        g = 1.0;
        r = 1.0 - (300.0 - angle) / 60.0;
    } else {
        r = 1.0;
        g = (360.0 - angle) / 60.0;
    }
    return {r:r, g:g, b:b};
  }

  static rgbToHue(r: number, g: number, b: number): number {
    if (r >= g && r >= b) {
        return 90 + b * 60 - g * 60;
    }
    if (g >= b) {
      let h = 330 + r * 60 - b * 60;
      return h >= 360 ? h - 360 : h;
    }
    return 210 - r * 60 + g * 60;
  }

  static toHex(color: sRGB): string {
    return "#"
      + this.componentToHex(Math.round(color.r * 255))
      + this.componentToHex(Math.round(color.g * 255))
      + this.componentToHex(Math.round(color.b * 255));
  }

  static saturate(color: sRGB, saturation: number) {
    this.normalize(color);
    const a = 1 - this.minComponent(color);
    const m = 1 - saturation;
    color.r = Math.min(color.r + a * m, 1);
    color.g = Math.min(color.g + a * m, 1);
    color.b = Math.min(color.b + a * m, 1);
  }

  static desaturate(color: sRGB) {
    this.normalize(color);
    const m = this.minComponent(color);
    color.r -= m;
    color.g -= m;
    color.b -= m;
    this.normalize(color);
  }

  static getSaturation(color: sRGB): number {
    return 1 - this.minComponent(color);
  }

  static normalize(color: sRGB) {
    if (color.r === 0 && color.g === 0 && color.b === 0) {
      color.r = 1;
      color.g = 1;
      color.b = 1;
      return;
    }
    const scale = 1 / this.maxComponent(color);
    color.r *= scale;
    color.g *= scale;
    color.b *= scale;
  }

  static gamma(color: sRGB): sRGB {
    color.r = this.gammaC(color.r);
    color.g = this.gammaC(color.g);
    color.b = this.gammaC(color.b);
    return color;
  }

  // https://stackoverflow.com/a/56678483/65387
  // Assumes rgb is not gamma corrected
  static lightness(rgb: sRGB): number {
    const Y = this.Rs * rgb.r + this.Gs * rgb.g + this.Bs * rgb.b;
    return Y <= 216 / 24389 ? Y * 24389 / 27 : Math.pow(Y, 1 / 3) * 116 - 16;
  }

  static gammaC(c: number): number {
    return  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1.0/2.4) - 0.055;
  }

  static degamma(c: number): number {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  static setLightness(l: number, color:sRGB) {
    if (l >= 100) {
      color.r = 1;
      color.g = 1;
      color.b = 1;
      return;
    }
    let Y = l <= 8 ? l * 27 / 24389 : Math.pow((l + 16)/116, 3);
    if (color.r === 0 && color.g === 0 && color.b === 0) {
      this.setLuminance(Y, color);
      return;
    }
    let s = Y / (this.Rs * color.r + this.Gs * color.g + this.Bs * color.b);
    let max = Math.min(1/color.r, Math.min(1/color.g, 1/color.b));
    if (s < max) {
      color.r *= s;
      color.g *= s;
      color.b *= s;
      return;
    }
    color.r *= max;
    color.g *= max;
    color.b *= max;
    this.setLuminance(Y, color);
  }

  /**
   * Luminance Y =
   * Y = Rs * r + Gs * g + Bs * b;
   * 
   * If target luminance <= current luminance, scale it down to meet target:
   * 
   * Y = s * (Rs * r + Gs * g + Bs * b)
   * s = Y / (Rs * r + Gs * g + Bs * b);
   * 
   * If target luminance > current luminance, scale target up until target is met
   * or any component is 1. Then add to non-1 components until target is met.
   */
  private static setLuminance(Y: number, color: sRGB) {
    const current = this.Rs * color.r + this.Gs * color.g + this.Bs * color.b;
    if (Y <= current) {
      const s = Y / current;
      color.r *= s;
      color.g *= s;
      color.b *= s;
      return;
    }
    let max = 1;
    let ra = 0;
    let ga = 0;
    let ba = 0;
    if (color.r < .99) {
      max = Math.min(1 - color.r, max);
      ra = 1;
    }
    if (color.g < .99) {
      max = Math.min(1 - color.g, max);
      ga = 1;
    }
    if (color.b < .99) {
      max = Math.min(1 - color.b, max);
      ba = 1;
    }
    ra *= max;
    ga *= max;
    ba *= max;
    let s = (Y - this.Rs * color.r - this.Gs * color.g - this.Bs * color.b) /
              (this.Rs * ra  + this.Gs * ga + this.Bs * ba);
    if (s > 1.0001) {
      color.r += ra;
      color.g += ga;
      color.b += ba;
      ra = 0;
      ga = 0;
      ba = 0;
      max = 1;
      if (color.r < .99) {
        max = Math.min(1 - color.r, max);
        ra = 1;
      }
      if (color.g < .99) {
        max = Math.min(1 - color.g, max);
        ga = 1;
      }
      if (color.b < .99) {
        max = Math.min(1 - color.b, max);
        ba = 1;
      }
      ra *= max;
      ga *= max;
      ba *= max;
      s  = (Y - this.Rs * color.r - this.Gs * color.g - this.Bs * color.b) /
          (this.Rs * ra  + this.Gs * ga + this.Bs * ba);
    }
    color.r += s * ra;
    color.g += s * ga;
    color.b += s * ba;
  }

  private static maxComponent(color: sRGB) {
    return Math.max(color.r, Math.max(color.g, color.b));
  }

  private static minComponent(color: sRGB) {
    return Math.min(color.r, Math.min(color.g, color.b));
  }

  private static componentToHex(c:number): string {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}
