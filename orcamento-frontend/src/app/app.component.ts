import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';

@Component({
selector: 'app-root',
standalone: true,
imports: [CommonModule, RouterOutlet, OrcamentoListComponent],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {
title = 'Sistema de Orçamentos de Móveis';
currentYear = new Date().getFullYear();
}
