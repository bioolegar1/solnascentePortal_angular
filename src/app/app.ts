// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Garante que é standalone
  imports: [RouterOutlet],
  // Lógica: Aqui deixamos apenas o router-outlet.
  // O DefaultLayout será injetado aqui pelo arquivo de rotas.
  template: '<router-outlet />',
})
export class App {}
