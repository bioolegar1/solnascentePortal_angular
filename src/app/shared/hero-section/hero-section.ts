import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.scss'],
})
export default class HeroSection {
  // Lógica: Este é um componente puramente apresentacional (Dumb Component).
  // Não precisamos de variáveis de estado ou injeções de serviço aqui,
  // pois a função dele é apenas exibir o impacto visual inicial e guiar a navegação.
}
