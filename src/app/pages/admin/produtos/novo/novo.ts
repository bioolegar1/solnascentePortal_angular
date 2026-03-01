import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Category, Products, ProductImage } from '../../../../shared/interfaces/product.interface';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { UploadService } from '../../../../core/services/upload.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;



@Component({
  selector: 'app-novo-produto',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './novo.html',
  styleUrls: ['./novo.scss'],
})
export default class NovoProduto implements OnInit {
  // 1. INJEÇÃO DE DEPENDÊNCIAS
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private uploadService = inject(UploadService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // 2. ESTADOS REATIVOS (SIGNALS)
  categories = signal<Category[]>([]);
  productImages = signal<ProductImage[]>([]);
  uploading = signal(false);
  loading = signal(false);
  isCreatingCategory = signal(false);

  // 3. ESTRUTURA DO FORMULÁRIO REATIVO
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    category: new FormControl('', Validators.required),
    barcode: new FormControl(''),
    weight: new FormControl(''),
    created_at: new FormControl(''),
    package_qty: new FormControl(1),
  });

  // 4. CICLO DE VIDA E INICIALIZAÇÃO
  ngOnInit(): void {
    // Lógica: Ao abrir a página, busca as categorias existentes para popular o campo "select".
    // O takeUntilDestroyed garante que a conexão com a API seja encerrada se o usuário sair da página antes da resposta.
    this.categoriesService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cats) => {
        this.categories.set(cats);
        // Lógica: Se houver categorias, seleciona a primeira automaticamente para facilitar o preenchimento.
        if (cats.length) {
          this.form.get('category')!.setValue(cats[0].name);
        }
      });
  }

  // 5. MANIPULAÇÃO DE IMAGENS
  async handleFileChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    // Lógica: Valida se o usuário não cancelou a janela de seleção.
    if (!files?.length) return;

    // Lógica: Limita rigorosamente a 5 imagens para otimizar o banco de dados e layout.
    if (this.productImages().length + files.length > 5) {
      alert('Permitido o máximo de 5 imagens por produto.');
      return;
    }

    this.uploading.set(true);

    // Lógica: Itera sobre os arquivos selecionados, faz o upload e atualiza o Signal com as URLs geradas.
    for (const file of Array.from(files)) {
      const url = await this.uploadService.uploadImage(file);
      this.productImages.update((list) => [
        ...list,
        // A primeira imagem a ser subida no array vazio torna-se automaticamente a principal (isMain: true).
        { name: file.name, url, isMain: list.length === 0 },
      ]);
    }

    this.uploading.set(false);
    target.value = ''; // Lógica: Reseta o input para permitir selecionar o mesmo arquivo novamente, se necessário.
  }

  setMainImage(index: number): void {
    // Lógica: Varre o array de imagens. Apenas a imagem que bate com o índice clicado recebe "isMain: true".
    this.productImages.update((list) => list.map((img, i) => ({ ...img, isMain: i === index })));
  }

  removeImage(index: number): void {
    const wasMain = this.productImages()[index].isMain;

    // Lógica: Filtra o array, removendo o item que corresponde ao índice.
    this.productImages.update((list) => list.filter((_, i) => i !== index));

    // Lógica de fallback: Se o usuário excluiu a imagem principal, a próxima imagem da fila herda o status automaticamente.
    if (wasMain && this.productImages().length > 0) {
      this.productImages.update(([first, ...rest]) => [{ ...first, isMain: true }, ...rest]);
    }
  }

  // 6. SUBMISSÃO DE DADOS
  async handleSave(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.productImages().length === 0) {
      alert('É obrigatório adicionar pelo menos uma imagem do produto.');
      return;
    }

    this.loading.set(true);

    try {
      if (this.isCreatingCategory()) {
        await this.categoriesService.create(this.form.value.category!);
      }

      const mainImage = this.productImages().find((i) => i.isMain) ?? this.productImages()[0];
      const formValues = this.form.value;

      // Lógica: Em vez de usar o spread operator (...this.form.value),
      // construímos o objeto explicitamente para satisfazer a interface exata do serviço.
      await this.productsService.create({
        name: formValues.name!,
        description: formValues.description || '',
        category: formValues.category!,
        barcode: formValues.barcode || '',

        // Mapeamos a chave 'weight' do nosso formulário para a chave 'wheight' exigida pela interface
        weight: formValues.weight || '',

        package_qty: Number(formValues.package_qty) || 1,
        image_url: mainImage.url,
        gallery: this.productImages().map((i) => i.url),

        // Injetamos dinamicamente a data e hora atuais da criação para satisfazer o campo faltante
        created_at: new Date(),
      });

      this.router.navigate(['/admin']);
    } catch (error) {
      alert('Erro ao salvar o produto. Verifique sua conexão e tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }

}
