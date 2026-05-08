import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss',
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  isOpen = signal(false);

  toggleSidebar() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  sendToWhatsApp() {
    const message = this.cartService.generateWhatsAppMessage();
    if (!message) return;

    const url = `https://wa.me/5562991122981?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Opcional: limpar carrinho após enviar? 
    // Por enquanto vamos manter para o usuário ter certeza do que enviou.
  }
}
