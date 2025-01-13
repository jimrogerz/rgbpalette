import { Injectable, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  darkMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(@Inject(DOCUMENT) private html: any) {
    const darkMode:boolean = !('showConfiguration' in localStorage) || localStorage['theme'] === 'dark';
    this.setDarkMode(darkMode);
  }

  setDarkMode(dark: boolean) {
    this.darkMode$.next(dark);
    if (dark) {
      localStorage['theme'] = 'dark'
    } else {
      localStorage['theme'] = 'light'
    }

    if (dark) {
      this.html.documentElement.classList.add("dark"); //tailwind css
      this.html.documentElement.classList.add("dark-theme"); // Material
    } else {
      this.html.documentElement.classList.remove("dark");
      this.html.documentElement.classList.remove("dark-theme");
    }
  }
}
