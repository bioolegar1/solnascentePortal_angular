import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export default class AdminLayout {
  /**
   * Componente de Layout Administrativo.
   * Não possui lógica interna pois serve como moldura para as páginas de
   * gerenciamento de produtos e categorias que serão carregadas no RouterOutlet.
   */
}
