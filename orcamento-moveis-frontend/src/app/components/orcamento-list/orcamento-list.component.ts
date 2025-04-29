import { Component, OnInit } from '@angular/core';
import { OrcamentoService } from '../../services/orcamento.service';
import { Orcamento } from '../../models/orcamento.model';

@Component({
selector: 'app-orcamento-list',
templateUrl: './orcamento-list.component.html',
styleUrls: ['./orcamento-list.component.css']
})
export class OrcamentoListComponent implements OnInit {
orcamentos: Orcamento[] = [];
loading = true;

constructor(private orcamentoService: OrcamentoService) { }

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.orcamentoService.listarOrcamentos().subscribe({
      next: (data) => {
        this.orcamentos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar orçamentos', err);
        this.loading = false;
      }
    });
  }
}
