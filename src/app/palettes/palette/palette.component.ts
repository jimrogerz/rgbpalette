import { Input, Component } from '@angular/core';
import { Palette } from '../palette';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RGBd} from '../palette';

@Component({
    selector: 'aa-palette',
    templateUrl: './palette.component.html',
    standalone: false
})
export class PaletteComponent {
  @Input() palette?: Palette;
  shadeMode: boolean = localStorage['shadeMode'] === 'dark';
  complement: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  toggleConfiguration() {
    this.palette!.toggleConfiguration();
  }

  onSelectColor(color: RGBd) {
    const hexString = this.getColor(color);
    navigator.clipboard.writeText(hexString);
    this.snackBar.open('Copied ' + hexString + ' to clipboard!', 'Got it', {
      duration: 3000
    });
  }

  colors(index: number) {
    let colors = this.palette!.swatches[index].colors;
    return this.shadeMode ? colors.slice().reverse() : colors;
  }

  getColor(color: RGBd): string {
    return this.complement ? color.hexStringC : color.hexString;
  }

  storeShadeMode() {
    localStorage['shadeMode'] = this.shadeMode ? "dark" : "light";
  }

  get header(): string {
    return this.shadeMode
      ? "perceived darkness ⭢ (0 = white, 1000 = black) "
      : "perceived lightness ⭢ (0 = black, 100 = white) ";
  }
}
