import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode: boolean = true;
  constructor() {}

  setDarkMode(value: boolean): void {
    localStorage.setItem('theme', value ? 'true' : 'false');
  }

  getIsDarkMode(): 'true' | 'false' {
    return (localStorage.getItem('theme') as 'true' | 'false') || 'true';
  }
}
