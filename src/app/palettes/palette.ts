export interface sRGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBd {
  hexString: string;
  hexStringC: string;
  shade: number;
}

export interface Swatch {
  colors: RGBd[];
}

export interface Palette {
  swatches: Swatch[];
  showConfiguration: boolean;
  toggleConfiguration(): void;
  copyLink(): void;
}