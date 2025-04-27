import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
selector: 'app-root',
standalone: true,
imports: [
CommonModule,
RouterOutlet,
RouterModule, // Para diretivas de routerLink
NavbarComponent,
FooterComponent,
LoadingSpinnerComponent
],
template: `
<div class="app-container">
<app-navbar [appTitle]="title"></app-navbar>

<main class="main-content">
<router-outlet></router-outlet>
</main>

<app-footer [currentYear]="currentYear"></app-footer>

<app-loading-spinner *ngIf="isLoading"></app-loading-spinner>
</div>
`,
styleUrls: ['./app.component.scss'] // Usando SCSS para maior flexibilidade
})
export class AppComponent implements OnInit {
public readonly title = 'Sistema de Orçamentos de Móveis';
public currentYear: number;
public isLoading = false;

constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Aqui pode ser adicionada lógica de inicialização
    // Ex: Verificar autenticação, carregar configurações
  }
}
