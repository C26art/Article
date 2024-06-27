import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {
    const initialTheme = this.getTheme() || 'primary';
    this.applyTheme(initialTheme);
   }

  setTheme(theme: string): void {
    this.applyTheme(theme);
    localStorage.setItem('themeColor', theme);
  }

  private applyTheme(theme: string): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('primary-theme', 'accent-theme', 'warn-theme');
    body.classList.add(`${theme}-theme`);
  }

  getTheme(): ThemePalette {
    const storedThemeColor = localStorage.getItem('themeColor');
    return storedThemeColor ? (storedThemeColor as ThemePalette) : 'primary';
  }
}
