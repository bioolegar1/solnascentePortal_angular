import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Products } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  /**
   * Injeção do Firestore.
   * Por que usar inject(Firestore)? Esta é a forma moderna do Angular (v16+) de obter
   * dependências. Ela garante que o serviço receba a instância configurada no
   * bootstrap da aplicação, mantendo o Zone.js ciente das operações assíncronas.
   */
  private readonly firestore: Firestore = inject(Firestore);

  /**
   * Obtém todos os produtos em tempo real.
   * Lógica: Criamos a referência da coleção 'products' vinculada à instância
   * injetada. O query() com orderBy() organiza os dados no servidor antes de
   * chegarem ao cliente, o que poupa processamento no navegador.
   */
  getAll(): Observable<Products[]> {
    const productsRef = collection(this.firestore, 'products') as CollectionReference<Products>;
    const q = query(productsRef, orderBy('created_at', 'desc'));

    // O collectionData transforma os documentos em um array de objetos.
    // O parâmetro idField: 'id' é fundamental para que o Firestore injete o
    // ID da hash do documento dentro da propriedade 'id' da nossa interface.
    return collectionData(q, { idField: 'id' }) as Observable<Products[]>;
  }

  /**
   * Busca um produto específico pelo ID.
   * Lógica: Usamos getDoc para uma leitura única (Promise). Isso é ideal para
   * páginas de detalhes onde não precisamos de atualizações em tempo real constante.
   */
  async getById(id: string): Promise<Products | undefined> {
    // Localizamos o documento específico dentro da coleção
    const docRef = doc(this.firestore, 'products', id) as DocumentReference<Products>;
    const snap = await getDoc(docRef);

    // Verificamos se o documento existe para evitar erros de undefined ao acessar os dados.
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Products) : undefined;
  }

  /**
   * Adiciona um novo documento.
   * Lógica: O spread operator (...data) garante que todos os campos da interface
   * sejam enviados. Forçamos o created_at como uma nova Date para garantir a
   * integridade da linha do tempo, independentemente do que o front-end enviou.
   */
  async create(data: Omit<Products, 'id'>): Promise<void> {
    const productsRef = collection(this.firestore, 'products');

    // addDoc gera automaticamente um ID único alfanumérico no Firestore.
    await addDoc(productsRef, {
      ...data,
      created_at: new Date(),
    });
  }

  /**
   * Atualiza campos parciais.
   * Lógica: updateDoc é mais seguro que setDoc porque ele apenas altera os campos
   * passados no objeto 'data', sem apagar o restante do documento.
   */
  async update(id: string, data: Partial<Products>): Promise<void> {
    const docRef = doc(this.firestore, 'products', id);
    await updateDoc(docRef, data as any);
  }

  /**
   * Remove um produto.
   * Lógica: Recebe o ID e executa a deleção direta no documento referenciado.
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'products', id);
    await deleteDoc(docRef);
  }
}
