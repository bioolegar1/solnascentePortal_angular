import { inject, Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  /**
   * Injeção do módulo de Storage.
   * Lógica: Usamos o inject(Storage) para que o Angular forneça a instância global
   * configurada na inicialização. Isso permite que o Zone.js monitore o progresso
   * do upload e atualize a interface quando a operação terminar.
   */
  private readonly fireStorage: Storage = inject(Storage);

  /**
   * Faz o upload de uma imagem e retorna a URL pública de acesso.
   * @param file Arquivo binário vindo do input HTML.
   * @param folder Pasta de destino no Storage (ex: 'products', 'categories').
   */
  async uploadImage(file: File, folder: string = 'catalog-images'): Promise<string> {
    // 1. Lógica de Geração de Nome Único:
    // Dividimos o nome do arquivo para pegar a extensão.
    const ext = file.name.split('.').pop();
    // Criamos um nome baseado no timestamp atual e uma string aleatória (base 36).
    // Isso evita que dois usuários subindo arquivos chamados "imagem.jpg" um sobrescreva o outro.
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    // 2. Referenciação:
    // O 'ref' precisa da nossa instância injetada 'this.fireStorage' e do caminho.
    // Isso cria um "ponteiro" para onde o arquivo será guardado na nuvem.
    const fileRef = ref(this.fireStorage, filePath);

    // 3. Upload:
    // uploadBytes envia os dados binários brutos. É uma operação assíncrona.
    await uploadBytes(fileRef, file);

    // 4. Recuperação de URL:
    // O arquivo no Storage não é acessível diretamente por URL padrão de imediato.
    // getDownloadURL gera um token de acesso público para que possamos salvar no Firestore.
    return getDownloadURL(fileRef);
  }

  /**
   * Remove um arquivo do Storage baseado na sua URL ou caminho.
   * Lógica: Essencial para não deixar arquivos "órfãos" no Storage quando
   * um produto ou categoria for excluído.
   */
  async deleteImage(url: string): Promise<void> {
    try {
      const fileRef = ref(this.fireStorage, url);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Erro ao deletar imagem do Storage:', error);
    }
  }
}
