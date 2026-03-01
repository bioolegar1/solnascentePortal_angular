import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Category, Products, ProductImage } from '../../../../shared/interfaces/product.interface';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { UploadService } from '../../../../core/services/upload.service';

// Importações presumidas das interfaces e serviços do projeto


@Component({
  selector: 'app-editar-produto',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editar.html',
  styleUrls: ['./editar.scss'],
})
export default class EditarProduto implements OnInit {
  // 1. INJEÇÃO DE DEPENDÊNCIAS
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private uploadService = inject(UploadService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Injetado para ler os parâmetros da URL atual
  private destroyRef = inject(DestroyRef);

  // Lógica: Extrai o ID do produto diretamente da URL (ex: /admin/produtos/editar/123)
  private productId = this.route.snapshot.params['id'] as string;

  // 2. ESTADOS REATIVOS (SIGNALS)
  categories = signal<Category[]>([]);
  productImages = signal<ProductImage[]>([]);
  uploading = signal(false);
  loading = signal(true); // Lógica: Começa como true para bloquear a tela até os dados chegarem
  isCreatingCategory = signal(false);

  // 3. ESTRUTURA DO FORMULÁRIO REATIVO
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    category: new FormControl('', Validators.required),
    barcode: new FormControl(''),
    weight: new FormControl(''),
    package_qty: new FormControl(1),
  });

  // 4. CICLO DE VIDA E INICIALIZAÇÃO DE DADOS
  async ngOnInit(): Promise<void> {
    // Busca e preenche a lista de categorias disponíveis
    this.categoriesService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cats) => this.categories.set(cats));

    // Lógica: Requisição assíncrona para buscar os dados antigos do produto na API
    const produto = await this.productsService.getById(this.productId);

    // Tratativa de erro: Se o ID da URL não existir no banco de dados
    if (!produto) {
      alert('Produto não encontrado.');
      this.router.navigate(['/admin']);
      return;
    }

    // Lógica vital: O método patchValue injeta os dados que vieram da API diretamente nos campos do HTML.
    this.form.patchValue({
      name: produto.name,
      description: produto.description,
      category: produto.category,
      barcode: produto.barcode,
      weight: produto.weight,
      package_qty: produto.package_qty,
    });

    // Lógica: O backend separa a imagem principal da galeria. Aqui, unificamos tudo no Signal 'productImages'
    // para que a interface de usuário possa editá-las no mesmo componente visual.
    const images: ProductImage[] = [];

    if (produto.image_url) {
      images.push({ name: 'Imagem Principal', url: produto.image_url, isMain: true });
    }

    if (produto.gallery && produto.gallery.length > 0) {
      // Filtra para garantir que a imagem principal não apareça duplicada na galeria
      produto.gallery
        .filter((url) => url !== produto.image_url)
        .forEach((url, i) => {
          images.push({ name: `Galeria ${i + 1}`, url, isMain: false });
        });
    }

    this.productImages.set(images);

    // Libera a renderização da interface após tudo estar preenchido
    this.loading.set(false);
  }

  // 5. MANIPULAÇÃO DE IMAGENS (Idêntica ao cadastro)
  async handleFileChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files?.length) return;

    if (this.productImages().length + files.length > 5) {
      alert('Permitido o máximo de 5 imagens por produto.');
      return;
    }

    this.uploading.set(true);
    for (const file of Array.from(files)) {
      const url = await this.uploadService.uploadImage(file);
      this.productImages.update((list) => [
        ...list,
        { name: file.name, url, isMain: list.length === 0 },
      ]);
    }

    this.uploading.set(false);
    target.value = '';
  }

  setMainImage(index: number): void {
    this.productImages.update((list) => list.map((img, i) => ({ ...img, isMain: i === index })));
  }

  removeImage(index: number): void {
    const wasMain = this.productImages()[index].isMain;
    this.productImages.update((list) => list.filter((_, i) => i !== index));
    if (wasMain && this.productImages().length > 0) {
      this.productImages.update(([first, ...rest]) => [{ ...first, isMain: true }, ...rest]);
    }
  }

  // 6. ATUALIZAÇÃO DOS DADOS
  async handleUpdate(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      if (this.isCreatingCategory()) {
        await this.categoriesService.create(this.form.value.category!);
      }

      // Isola a imagem selecionada como principal ou pega a primeira disponível
      const mainImage = this.productImages().find((i) => i.isMain) ?? this.productImages()[0];

      // Lógica: Usa o método update() passando o ID na URL e os dados alterados.
      // Usa "Partial<Product>" para garantir que o TypeScript aceite a atualização mesmo se propriedades como "id" não forem enviadas no payload.
      await this.productsService.update(this.productId, {
        ...(this.form.value as Partial<Products>),
        image_url: mainImage?.url ?? '',
        gallery: this.productImages().map((i) => i.url),
        package_qty: Number(this.form.value.package_qty) || 1,
      });

      this.router.navigate(['/admin']);
    } catch (error) {
      alert('Erro ao atualizar o produto. Verifique sua conexão e tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
