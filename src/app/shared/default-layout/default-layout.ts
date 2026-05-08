import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartSidebarComponent } from '../components/cart-sidebar/cart-sidebar';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CartSidebarComponent],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss',
})
export default class DefaultLayoutComponent {
  isMenuOpen = signal(false);
  cartService = inject(CartService);

  constructor() {
    // Fecha o menu mobile automaticamente ao trocar de rota
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.isMenuOpen.set(false));
  }
}
