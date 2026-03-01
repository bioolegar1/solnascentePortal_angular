import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  addDoc,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  // A lógica aqui é usar o 'inject' diretamente na propriedade da classe.
  // Isso garante que o Angular forneça a instância correta do Firestore
  // que foi configurada no seu app.config ou app.module.
  private readonly firestore: Firestore = inject(Firestore);

  /**
   * Retorna a lista de categorias ordenada alfabeticamente por nome.
   * * Lógica:
   * 1. Criamos a referência da coleção dentro do método para garantir que
   * ela utilize a instância de 'this.firestore' já inicializada.
   * 2. Aplicamos o 'query' com 'orderBy' para delegar a ordenação ao banco de dados,
   * o que é mais performático que ordenar no front-end.
   */
  getAll(): Observable<Category[]> {
    const catRef = collection(this.firestore, 'categories') as CollectionReference<Category>;
    const q = query(catRef, orderBy('name'));

    // O 'collectionData' transforma os snapshots do Firestore em um Observable de arrays.
    // O parâmetro 'idField' extrai o ID do documento e o insere no objeto Category.
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  /**
   * Cria uma categoria gerando automaticamente um slug sanitizado.
   * * Lógica:
   * 1. O 'normalize' e o 'replace' limpam a string para criar uma URL amigável (slug).
   * 2. 'addDoc' é usado em vez de 'setDoc' porque queremos que o Firestore
   * gere um ID aleatório único para cada categoria.
   */
  async create(name: string): Promise<void> {
    const slug = this.generateSlug(name);
    const catRef = collection(this.firestore, 'categories');

    // A função addDoc retorna uma Promise, por isso o método é async.
    await addDoc(catRef, { name, slug });
  }

  /**
   * Função auxiliar para manter a lógica de limpeza de strings centralizada.
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
