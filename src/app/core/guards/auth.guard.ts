import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

/**
 * Guarda de rota funcional que utiliza o estado de autenticação do Firebase.
 * A lógica aqui define se uma rota pode ou não ser ativada.
 */
export const authGuard: CanActivateFn = () => {
  // Injeção de dependências sem a necessidade de um construtor de classe.
  const auth = inject(Auth);
  const router = inject(Router);

  // O fluxo de dados observa o estado do usuário no Firebase.
  return authState(auth).pipe(
    // take(1): Garante que o Observable complete após emitir o primeiro valor.
    // Isso é essencial em Guards para evitar que a rota fique "pendente".
    take(1),
    // A lógica de mapeamento:
    // Se o objeto 'user' existir, retorna true (permite acesso).
    // Caso contrário, retorna um UrlTree que redireciona o usuário para a tela de login.
    map((user) => (user ? true : router.createUrlTree(['/login']))),
  );
};
