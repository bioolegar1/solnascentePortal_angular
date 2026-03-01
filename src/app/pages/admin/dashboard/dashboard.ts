import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// IMPORTAÇÃO VITAL: Para tratar datas do Firestore sem erro de 'undefined'
import { Timestamp } from '@angular/fire/firestore';

import AuthService from '../../../core/services/auth.service';
import { ProductsService } from '../../../core/services/products.service';
// Lógica: Certifique-se de que a interface é 'Product' (singular) como definimos antes
import { Products } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export default class Dashboard implements OnInit {
  // 1. INJEÇÃO DE DEPENDÊNCIAS
  private productsService = inject(ProductsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // 2. ESTADOS REATIVOS (SIGNALS)
  // Lógica: Usamos 'Product' para alinhar com a interface corrigida.
  products = signal<Products[]>([]);
  loading = signal(true);
  search = signal('');
  selectedCategory = signal('');

  // 3. ESTADOS DERIVADOS (COMPUTED)
  categories = computed(() => {
    const allCategories = this.products().map((p) => p.category);
    return [...new Set(allCategories)].sort();
  });

  filteredProducts = computed(() => {
    const term = this.search().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchCategory = !category || p.category === category;
      return matchName && matchCategory;
    });
  });

  // 4. CICLO DE VIDA
  ngOnInit(): void {
    // Lógica: Chamamos o serviço que agora já usa o Firestore injetado corretamente.
    this.productsService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erro ao buscar produtos:', err);
          this.loading.set(false);
        },
      });
  }

  // 5. MÉTODOS DE AUXÍLIO (AQUI VAI A DATA)

  /**
   * Converte o Timestamp do Firebase ou Date do JS em uma string legível.
   * Lógica: Resolve o erro "Cannot read properties of undefined (reading 'Timestamp')".
   */
  formatarData(data: any): string {
    if (!data) return 'Sem data';

    // Se o Firebase devolveu um objeto que tem o método 'toDate'
    if (typeof data.toDate === 'function') {
      return data.toDate().toLocaleDateString('pt-BR');
    }

    // Caso o dado já seja uma Date (ex: produto acabado de criar)
    if (data instanceof Date) {
      return data.toLocaleDateString('pt-BR');
    }

    return 'Data inválida';
  }


  // 6. MÉTODOS DE AÇÃO
  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  async deleteProduct(id: string): Promise<void> {
    if (!id) return;
    if (!confirm('Excluir este produto? Ação irreversível.')) return;

    try {
      await this.productsService.delete(id);
      // Lógica: O Firestore getAll() é em tempo real, mas se você não estiver
      // usando o realtime, este filter manual limpa a tela instantaneamente.
      this.products.update((list) => list.filter((p) => p.id !== id));
    } catch (error) {
      alert('Erro ao excluir o produto.');
    }
  }

  editProduct(id: string): void {
    this.router.navigate(['/admin/produtos/editar', id]);
  }
}
