import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss',
})
export default class DefaultLayout {
  isMenuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.isMenuOpen.set(false));
  }
}
