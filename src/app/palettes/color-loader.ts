import { sRGB } from './palette';
import ColorUtil from './color-util';
import { ColorConfig, Distribution, Color } from '../../proto/color_config';

export interface HS {
  hue: number;
  saturation: number;
}

export class ColorLoader {
  static colors:any = {"mono":"#000000", "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

  static getHS(color: string): HS | null {
      if (typeof this.colors[color.toLowerCase()] != 'undefined') {
          color = this.colors[color.toLowerCase()];
      }
      const m = color.match(/^#?([0-9a-f]{6})$/i);
      if (m) {
          const g = m[1];
          return this.getHS2(
              parseInt(g.substr(0,2),16)/255,
              parseInt(g.substr(2,2),16)/255,
              parseInt(g.substr(4,2),16)/255);
      }
      const rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i);
      if (rgb) {
          return this.getHS2(
              parseInt(rgb[1])/255,
              parseInt(rgb[2])/255,
              parseInt(rgb[3])/255);
      }
      return null;
  }

  static serializeConfig(config:ColorConfig): string {
    const hue_offset = Math.round(config.hue_offset * 4095);
    return this.serializeConfig2(
      /* version_6= */ 0,
      /* hueCount_8= */ config.hue_count & 0xff,
      /* saturation_8= */ Math.round(config.saturation * 255),
      /* distribution_1= */ config.distribution == Distribution.DISTRIBUTION_NEAR ? 1 : 0,
      /* proximity_7= */ config.proximity & 0x7f,
      /* hue_offset_hi_8= */ hue_offset >> 4,
      /* hue_offset_lo_4= */ hue_offset & 0xf,
      /* scale_min_hi_4= */ config.scale_min >> 3,
      /* scale_min_lo_3= */ config.scale_min & 0x7,
      /* scale_max_hi_5= */ config.scale_max >> 2,
      /* scale_max_lo_2= */ config.scale_max & 0x3,
      /* scale_step_6= */ config.scale_step & 0x3f,
      config.colors, config.hue_count
    );
  }

  static deserializeConfig(config: string): ColorConfig {
    const chars:any = {'.':'+','_':'/','-':'='};
    const byteArray = Uint8Array.from(atob(config.replace(/[\._\-]/g, m => chars[m])), c => c.charCodeAt(0));
    return this.deserializeConfig2(byteArray);
  }

 /**
  * reserved_6|scale_mode_2
  * hue_count_8
  * saturation_8
  * distribution_1|proximity_7
  * hue_offset_hi_8
  * hue_offset_lo_4|scale_min_hi_4
  * scale_min_lo_3|scale_max_hi_5
  * scale_max_lo_2|scale_step_6
  */
  private static serializeConfig2(
      version_6: number,
      hueCount_8:number,
      saturation_8: number,
      distribution_1:number,
      proximity_7:number,
      hue_offset_hi_8:number,
      hue_offset_lo_4:number,
      scale_min_hi_4:number,
      scale_min_lo_3:number,
      scale_max_hi_5:number,
      scale_max_lo_2:number,
      scale_step_6:number,
      colors:Color[],
      hueCount: number): string {
    let numColorBytes = 0;
    let withIndex = false;
    if (colors.length > 0) {
      let byteCountWithIndex = colors.length * 4;
      let byteCountWithoutIndex = hueCount * 3;
      if (byteCountWithIndex < byteCountWithoutIndex) {
        withIndex = true;
        numColorBytes = byteCountWithIndex;
      } else {
        numColorBytes = byteCountWithoutIndex;
      }
    }
    let data: Uint8Array = new Uint8Array(7 + numColorBytes)
    data[0] = hueCount_8;
    data[1] = saturation_8;
    data[2] = distribution_1 << 7 | proximity_7;
    data[3] = hue_offset_hi_8;
    data[4] = hue_offset_lo_4 << 4 | scale_min_hi_4;
    data[5] = scale_min_lo_3 << 5 | scale_max_hi_5;
    data[6] = scale_max_lo_2 << 6 | scale_step_6;
    if (colors.length > 0) {
      const m = withIndex ? 4 : 3;
      for (let i = 0; i < colors.length; i++) {
        this.writeColor(data, 7 + i * m, colors[i], withIndex);
      }
    }
    return this.serialize(data);
  }

  private static writeColor(data: Uint8Array, offset: number, color: Color, withIndex: boolean) {
    const hue = Math.round(color.hue * 65535);
    const saturation = Math.round(color.saturation * 255);
    if (withIndex) {
      data[offset++] = color.index;
    }
    data[offset++] = (hue >> 8) & 0xff;
    data[offset++] = hue & 0xff;
    data[offset] = saturation;
  }

  private static deserializeConfig2(byteArray: Uint8Array): ColorConfig {
    const hueCount_8 = byteArray[0];
    const saturation_8 = byteArray[1];
    const distribution_1_proximity_7 = byteArray[2];
    const hue_offset_hi_8 = byteArray[3];
    const hue_offset_lo_4_scale_min_hi_4 = byteArray[4];
    const scale_min_lo_3_scale_max_hi_5 = byteArray[5];
    const scale_max_lo_2_scale_step_6 = byteArray[6];
    let colorConfig = new ColorConfig();
    colorConfig.hue_count = hueCount_8;
    colorConfig.distribution 
      = (distribution_1_proximity_7 & 0x80) != 0 ? Distribution.DISTRIBUTION_NEAR : Distribution.DISTRIBUTION_EQUAL;
    colorConfig.proximity = distribution_1_proximity_7 & 0x7f;
    colorConfig.hue_offset = (hue_offset_hi_8 << 4 | hue_offset_lo_4_scale_min_hi_4 >> 4) / 4095;
    colorConfig.saturation = saturation_8 / 255;
    colorConfig.scale_min = ((hue_offset_lo_4_scale_min_hi_4 & 0xf) << 3) | (scale_min_lo_3_scale_max_hi_5 >> 5);
    colorConfig.scale_max = ((scale_min_lo_3_scale_max_hi_5 & 0x1f) << 2) | (scale_max_lo_2_scale_step_6 >> 6);
    colorConfig.scale_step = scale_max_lo_2_scale_step_6 & 0x3f;
    if (byteArray.length > 7) {
      const numColorsBytes = byteArray.length - 7;
      let colors:Color[] = [];
      if (numColorsBytes === colorConfig.hue_count * 3) {
        for (let i = 7, j = 0; i < byteArray.length; i += 3, j++) {
          const hue_hi = byteArray[i];
          const hue_lo = byteArray[i+1];
          const saturation = byteArray[i+2];
          colors[j] = this.getColor(j, hue_hi, hue_lo, saturation);
        }
      } else {
        for (let i = 7, j = 0; i < byteArray.length; i += 4, j++) {
          const index = byteArray[i];
          const hue_hi = byteArray[i+1];
          const hue_lo = byteArray[i+2];
          const saturation = byteArray[i+3];
          colors[j] = this.getColor(index, hue_hi, hue_lo, saturation);
        }
      }
      colorConfig.colors = colors;
    }
    return colorConfig;
  }

  private static getColor(index: number, hue_hi: number, hue_lo: number, saturation: number): Color {
    const hue = hue_hi << 8 | hue_lo;
    let color = new Color();
    color.index = index;
    color.hue = hue / 65535;
    color.saturation = saturation / 255;
    return color;
  }

  private static serialize(config: Uint8Array): string {
    const chars:any = {'+':'.','/':'_','=':'-'};
    return btoa(String.fromCharCode.apply(null, Array.from(config))).replace(/[+\/=]/g, m => chars[m]);
  }

  private static getHS2(r: number, g: number, b: number): HS {
    let rgb = {
      r:ColorUtil.degamma(r),
      g:ColorUtil.degamma(g),
      b:ColorUtil.degamma(b)
    };
    ColorUtil.normalize(rgb);
    return {
      hue:ColorUtil.rgbToHue(rgb.r, rgb.g, rgb.b),
      saturation:ColorUtil.getSaturation(rgb)
    };
  }
}
