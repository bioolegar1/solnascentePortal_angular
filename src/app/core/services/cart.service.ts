import { Injectable, signal, effect, computed } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'sol_nascente_cart';

  // Sinal principal com os itens do carrinho
  private cartItems = signal<CartItem[]>([]);

  // Sinais computados para exportar dados úteis
  items = computed(() => this.cartItems());
  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    // Carregar dados iniciais do localStorage
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar carrinho', e);
      }
    }

    // Persistir automaticamente sempre que o sinal mudar
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (quantity <= 0) return;

    this.cartItems.update((items) => {
      const index = items.findIndex((i) => i.product.id === product.id);
      if (index > -1) {
        // Se já existe, atualiza a quantidade
        const newItems = [...items];
        newItems[index] = {
          ...newItems[index],
          quantity: newItems[index].quantity + quantity,
        };
        return newItems;
      }
      // Se não existe, adiciona novo
      return [...items, { product, quantity }];
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  removeFromCart(productId: string): void {
    this.cartItems.update((items) => items.filter((i) => i.product.id !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  generateWhatsAppMessage(): string {
    const items = this.cartItems();
    if (items.length === 0) return '';

    let message = 'Olá! Gostaria de cotar o seguinte pedido:\n\n';
    
    items.forEach(item => {
      const measure = `${item.product.measure.value}${item.product.measure.unit}`;
      message += `• *${item.quantity}x* ${item.product.name} (${measure})\n`;
    });

    message += '\n_Enviado pelo site Sol Nascente Portal._';
    return message;
  }
}
