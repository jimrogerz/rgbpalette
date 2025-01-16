import { Component, OnInit } from '@angular/core';
import { ConfigService, GoogleAnalyticsService } from './services';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'rgbpalette';

  constructor(private router: Router,
              private configService: ConfigService,
              private googleAnalyticsService: GoogleAnalyticsService) {}

  ngOnInit() {
    if (this.configService.isProd()) {
      this.setupGoogleAnalytics();
    }
  }

  private setupGoogleAnalytics() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(navigationEndEvent => {
        this.googleAnalyticsService.sendPageView(
          (navigationEndEvent as NavigationEnd).urlAfterRedirects
        );
      });
  }
}
