import { Component } from '@angular/core';
import { DarkModeService } from "../dark-mode.service";
import { MenuItem } from "./MenuItem";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: false
})
export class HeaderComponent {
  darkMode: boolean;
  menuItems: MenuItem[] = [
    { name: 'Home', tooltip: "Home", routerLink: "", icon: "home", color: "" },
    { name: 'Help', tooltip: "How to use", routerLink: "help", icon: "question_mark", color: "" },
    { name: 'About', tooltip: "About", routerLink: "about", icon: "info", color: "" },
    { name: 'Mono', tooltip: "Mono", routerLink: "mono", icon: "palette", color: "#777777" },
    { name: 'Red', tooltip: "Red", routerLink: "red", icon: "palette", color: "#ef0000" },
    { name: 'Purple', tooltip: "Purple", routerLink: "purple", icon: "palette", color: "#a700a7" },
    { name: 'Blue', tooltip: "Blue", routerLink: "blue", icon: "palette", color: "#6262ff" },
    { name: 'Cyan', tooltip: "Cyan", routerLink: "cyan", icon: "palette", color: "#00a0a0" },
    { name: 'Green', tooltip: "Green", routerLink: "green", icon: "palette", color: "#2f872f" },
    { name: 'Yellow', tooltip: "Yellow", routerLink: "yellow", icon: "palette", color: "#cccc00" },
    { name: 'Orange', tooltip: "Orange", routerLink: "orange", icon: "palette", color: "#ec9800" },
  ];

  constructor(private darkModeService: DarkModeService) {
    this.darkMode = ('theme' in localStorage) && localStorage['theme'] === 'dark';
    this.setDarkMode();
  }

  setDarkMode() {
    this.darkModeService.setDarkMode(this.darkMode);
  }
}
