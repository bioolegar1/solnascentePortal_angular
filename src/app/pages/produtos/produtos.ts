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

  readonly allergenLabels = ALLERGEN_LABELS;

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  search = signal('');
  selectedProduct = signal<Product | null>(null);
  activeImage = signal('');

  // VARIÁVEL DE ESTADO DE RECOLHIMENTO
  collapsedCategories = signal<Set<string>>(new Set());

  categories = computed(() => [...new Set(this.allProducts().map((p) => p.category))].sort());

  filteredProducts = computed(() => {
    const term = this.search().toLowerCase();
    // A lógica de filtragem por categoria foi removida. Agora filtra apenas pela busca de texto.
    return this.allProducts().filter((p) => p.name.toLowerCase().includes(term));
  });

  groupedProducts = computed(() => {
    const products = this.filteredProducts();
    const groups = new Map<string, Product[]>();

    for (const p of products) {
      if (!groups.has(p.category)) {
        groups.set(p.category, []);
      }
      groups.get(p.category)!.push(p);
    }

    return Array.from(groups.entries())
      .map(([category, items]) => ({ category, items }))
      .sort((a, b) => a.category.localeCompare(b.category));
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

  // LÓGICA DE RECOLHER/EXPANDIR CATEGORIAS
  toggleCategory(category: string): void {
    const currentSet = new Set(this.collapsedCategories());
    if (currentSet.has(category)) {
      currentSet.delete(category); // Se está na lista, remove (expande)
    } else {
      currentSet.add(category); // Se não está, adiciona (recolhe)
    }
    this.collapsedCategories.set(currentSet);
  }

  isCategoryCollapsed(category: string): boolean {
    return this.collapsedCategories().has(category);
  }

  // LÓGICA DE SCROLL SUAVE (ÂNCORA)
  formatCategoryId(category: string): string {
    return 'cat-' + category.toLowerCase().replace(/\s+/g, '-');
  }

  scrollToCategory(category: string): void {
    if (!category) return;

    const elementId = this.formatCategoryId(category);
    const element = document.getElementById(elementId);

    if (element) {
      // Calcula a posição do elemento subtraindo a altura da barra fixa de filtros
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  openProduct(item: Product): void {
    document.body.style.overflow = 'hidden';
    this.selectedProduct.set(item);
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

  getMainImage(item: Product): string {
    return item.images?.[0] ?? '';
  }

  formatMeasure(item: Product): string {
    return `${item.measure.value} ${item.measure.unit}`;
  }
}
