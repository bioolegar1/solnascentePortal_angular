import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root', // O serviço é um Singleton disponível em toda a aplicação.
})
export default class AuthService {
  // Injeção direta da instância Auth do Firebase configurada no projeto.
  private auth = inject(Auth);

  /**
   * isLoggedIn: Um Signal que indica se o usuário está autenticado.
   * A lógica converte o Observable do Firebase em um Signal para uso otimizado no template.
   */
  public isLoggedIn = toSignal(
    authState(this.auth).pipe(
      map((user) => !!user), // Converte o objeto usuário em um booleano simples.
    ),
    { initialValue: false }, // Valor inicial obrigatório para o Signal.
  );

  /**
   * Getter para obter os dados brutos do usuário atual.
   * Conecta-se diretamente à propriedade síncrona do Firebase Auth.
   */
  get currentUser() {
    return this.auth.currentUser;
  }

  /**
   * Realiza o login utilizando e-mail e senha.
   * Se liga diretamente à função SDK do Firebase.
   */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Encerra a sessão do usuário.
   */
  logout() {
    return signOut(this.auth);
  }
}
