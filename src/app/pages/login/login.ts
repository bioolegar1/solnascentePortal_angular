import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import AuthService from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export default class Login {
  // 1. Injeção de Dependências
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. Gerenciamento de Estado Reativo
  loading = signal(false);
  errorMessage = signal('');

  // 3. Estrutura do Formulário
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  // 4. Lógica de Submissão
  async handleLogin(): Promise<void> {
    // Validação preventiva: impede envio se as regras do FormGroup não forem atendidas.
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Liga o alerta visual nos campos vazios/inválidos no HTML.
      return;
    }

    // Altera o estado para iniciar o feedback visual de carregamento.
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      // Comunica-se com o serviço de autenticação. O "!" garante ao TypeScript que o valor não é nulo.
      await this.authService.login(this.form.value.email!, this.form.value.password!);

      // Redireciona o usuário para o painel de administração em caso de sucesso.
      this.router.navigate(['/admin']);
    } catch (error) {
      // Captura falhas (ex: credenciais erradas, servidor fora do ar) e atualiza a interface.
      this.errorMessage.set('Email ou senha incorretos. Verifique e tente novamente.');
    } finally {
      // Independente de sucesso ou erro, remove o estado de carregamento do botão.
      this.loading.set(false);
    }
  }
}
