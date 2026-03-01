import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Products } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-produtos',
  imports: [FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss',
})
export default class Produtos implements OnInit {
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  allProducts = signal<Products[]>([]);
  loading = signal(true);
  search = signal('');
  selectedCategory = signal('');
  selectedProduct = signal<Products | null>(null);
  activeImage = signal('');

  categories = computed(() => [...new Set(this.allProducts().map((p) => p.category))].sort());

  filteredProducts = computed(() => {
    const term = this.search().toLowerCase();
    const category = this.selectedCategory();
    return this.allProducts().filter(
      (p) => p.name.toLowerCase().includes(term) && (!category || p.category === category),
    );
  });

  relatedProducts = computed(() => {
    const s = this.selectedProduct();
    if (!s) return [];
    const same = this.allProducts().filter((p) => p.category === s.category && p.id !== s.id);
    const others = this.allProducts().filter((p) => p.category !== s.category && p.id !== s.id);
    return [...same, ...others].slice(0, 4);
  });

  ngOnInit(): void {
    this.productsService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.allProducts.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  openProduct(item: Products): void {
    document.body.style.overflow = 'hidden';
    this.selectedProduct.set(item);
    this.activeImage.set(item.image_url);
  }

  closeProduct(): void {
    document.body.style.overflow = '';
    this.selectedProduct.set(null);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeProduct();
  }

  requestQuote(item: Products): void {
    const msg = `Olá! Gostaria de orçamento: *${item.name}* (Cód: ${item.barcode || 'N/A'}).`;
    window.open(`https://wa.me/5562991122981?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
