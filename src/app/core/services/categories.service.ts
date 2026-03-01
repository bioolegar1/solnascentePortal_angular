import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  // Caminho do JSON estático dentro de src/assets/
  private readonly DATA_URL = 'assets/data/categories.json';

  /**
   * Retorna todas as categorias do arquivo JSON.
   */
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.DATA_URL);
  }
}
