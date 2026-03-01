import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [NgClass],
  templateUrl: './contato.html',
  styleUrls: ['./contato.scss'],
})
export default class Contato implements OnInit, OnDestroy {
  // Controla quais cards já entraram na tela (animação de entrada)
  visibleCards = signal<Set<number>>(new Set());

  private observer!: IntersectionObserver;

  ngOnInit(): void {
    // Observa todos os elementos com [data-animate]
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset['index']);
            this.visibleCards.update((set) => new Set([...set, index]));
          }
        });
      },
      { threshold: 0.15 },
    );

    // Pequeno delay para o DOM estar pronto
    setTimeout(() => {
      document.querySelectorAll('[data-animate]').forEach((el) => {
        this.observer.observe(el);
      });
    }, 100);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  isVisible(index: number): boolean {
    return this.visibleCards().has(index);
  }

  openWhatsApp(): void {
    const msg = 'Olá! Vim pelo site e gostaria de mais informações.';
    window.open(`https://wa.me/5562991122981?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
