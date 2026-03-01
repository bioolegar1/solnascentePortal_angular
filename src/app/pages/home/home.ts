import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home implements OnInit {
  readonly banners = [
    {
      image: 'assets/imagem01.jpg',
      icon: '🌿',
      title: 'Temperos e especiarias',
      subtitle: 'Direto do produtor para sua mesa',
    },
    {
      image: 'assets/imagem02.jpg',
      icon: '🔥',
      title: 'Ofertas Especiais',
      subtitle: 'Confira nossos preços de atacado',
    },
    {
      image: 'assets/imagem03.jpg',
      icon: '🚚',
      title: 'Entrega Rápida',
      subtitle: 'Entregamos qualidade com celeridade',
    },
  ];

  readonly features = [
    {
      image: 'assets/pimentadoreino.webp',
      alt: 'Pimenta do Reino',
      icon: '⚫',
      title: 'Ouro Negro',
      text: 'A pimenta-do-reino selecionada que traz intensidade e o aroma clássico das grandes culinárias.',
    },
    {
      image: 'assets/cravodaindia.webp',
      alt: 'Cravo-da-Índia',
      icon: '🍂',
      title: 'Tesouro das Ilhas',
      text: 'O frescor e a doçura picante do cravo-da-índia, perfeitos para pratos doces e agridoces.',
    },
    {
      image: 'assets/canela.webp',
      alt: 'Canela em casca',
      icon: '🪵',
      title: 'Conforto e Tradição',
      text: 'Canela de qualidade superior, trazendo o toque acolhedor e o perfume marcante que sua cozinha merece.',
    },
  ];

  currentBanner = signal(0);

  #interval?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.#interval));
  }

  ngOnInit(): void {
    this.#startAutoPlay();
  }

  get trackTransform(): string {
    return `translateX(-${this.currentBanner() * 100}%)`;
  }

  setBanner(i: number): void {
    clearInterval(this.#interval);
    this.currentBanner.set(i);
    this.#startAutoPlay();
  }

  #startAutoPlay(): void {
    this.#interval = setInterval(
      () => this.currentBanner.update((n) => (n + 1) % this.banners.length),
      4000,
    );
  }
}
