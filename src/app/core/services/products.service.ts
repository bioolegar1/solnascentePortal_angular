import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  // Caminho do JSON estático dentro de src/assets/
  private readonly DATA_URL = 'assets/data/products.json';

  /**
   * Retorna todos os produtos do arquivo JSON.
   * O Angular/Vercel serve este arquivo como asset estático.
   */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.DATA_URL);
  }
}
