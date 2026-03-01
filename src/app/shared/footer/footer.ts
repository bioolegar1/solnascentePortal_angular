import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export default class Footer {
  // O ano atual é calculado dinamicamente para que você não precise
  // atualizar o footer manualmente a cada virada de ano.
  currentYear = new Date().getFullYear();
}
