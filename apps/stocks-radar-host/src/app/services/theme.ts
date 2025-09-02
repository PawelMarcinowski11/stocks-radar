import { DOCUMENT } from "@angular/common";
import { Injectable, effect, inject, signal } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private document = inject(DOCUMENT);

  public isDarkMode = signal<boolean>(this.getInitialDarkModeState());

  constructor() {
    effect(() => {
      if (this.isDarkMode()) {
        this.document.documentElement.classList.add('dark');
      } else {
        this.document.documentElement.classList.remove('dark');
      }
    });
  }

  public toggleDarkMode(): void {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);

    localStorage.setItem('darkMode', newValue ? 'true' : 'false');
  }

  private getInitialDarkModeState(): boolean {
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
