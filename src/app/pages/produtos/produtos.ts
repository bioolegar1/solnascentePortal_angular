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
import { Product, ALLERGEN_LABELS } from '../../shared/interfaces/product.interface';
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

  // Expõe os labels de alérgenos para o template
  readonly allergenLabels = ALLERGEN_LABELS;

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  search = signal('');
  selectedCategory = signal('');
  selectedProduct = signal<Product | null>(null);
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

  openProduct(item: Product): void {
    document.body.style.overflow = 'hidden';
    this.selectedProduct.set(item);
    // Usa a primeira imagem do array como imagem ativa
    this.activeImage.set(item.images?.[0] ?? '');
  }

  closeProduct(): void {
    document.body.style.overflow = '';
    this.selectedProduct.set(null);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeProduct();
  }

  requestQuote(item: Product): void {
    const msg = `Olá! Gostaria de orçamento: *${item.name}* (Cód: ${item.barcode || 'N/A'}).`;
    window.open(`https://wa.me/5562991122981?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // Retorna a imagem principal (primeira do array) ou string vazia
  getMainImage(item: Product): string {
    return item.images?.[0] ?? '';
  }

  // Formata a medida: ex "500 g" ou "250 ml"
  formatMeasure(item: Product): string {
    return `${item.measure.value} ${item.measure.unit}`;
  }
}
