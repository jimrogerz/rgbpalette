import { Component } from '@angular/core';
import { ConfigService } from '../services';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    standalone: false
})
export class AboutComponent {
  readonly now = new Date();
  version:string = "";

  constructor(private configService: ConfigService) {
    this.version = configService.getVersion();
  }
}
