import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrcamentoService } from '../orcamento.service';

interface Orcamento {
id: number;
cliente: string;
telefone: string;
email: string;
ambiente: string;
material: string;
valorTotal: number;
prazoEntrega: number;
dataCriacao: string;
status: 'Pendente' | 'Aprovado' | 'Recusado' | 'Em Produção' | 'Finalizado';
}

@Component({
selector: 'app-orcamento-list',
standalone: true,
imports: [
CommonModule,   // Necessário para *ngIf, *ngFor, etc.
RouterModule,   // Necessário para routerLink
FormsModule     // Necessário para ngModel
],
templateUrl: './orcamento-list.component.html',
styleUrls: ['./orcamento-list.component.css']
})
export class OrcamentoListComponent implements OnInit {
orcamentos: Orcamento[] = [];
filteredOrcamentos: Orcamento[] = [];
statusFilter: string = 'todos';
searchTerm: string = '';
isLoading: boolean = true;

constructor(private orcamentoService: OrcamentoService) { }

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.isLoading = true;
    this.orcamentoService.getOrcamentos()
      .subscribe({
        next: (data) => {
          this.orcamentos = data;
          this.aplicarFiltros();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar orçamentos:', error);
          this.isLoading = false;
          alert('Erro ao carregar orçamentos. Verifique o console para mais detalhes.');
        }
      });
  }

  aplicarFiltros(): void {
    let resultado = this.orcamentos;

    // Filtrar por status
    if (this.statusFilter !== 'todos') {
      resultado = resultado.filter(o => o.status === this.statusFilter);
    }

    // Filtrar por termo de busca
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      resultado = resultado.filter(o =>
        o.cliente.toLowerCase().includes(term) ||
        o.email.toLowerCase().includes(term) ||
        o.ambiente.toLowerCase().includes(term) ||
        o.material.toLowerCase().includes(term)
      );
    }

    this.filteredOrcamentos = resultado;
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }

  atualizarStatus(orcamento: Orcamento, novoStatus: 'Pendente' | 'Aprovado' | 'Recusado' | 'Em Produção' | 'Finalizado'): void {
    this.orcamentoService.atualizarStatusOrcamento(orcamento.id, novoStatus)
      .subscribe({
        next: () => {
          orcamento.status = novoStatus;
          alert(`Status do orçamento atualizado para ${novoStatus}.`);
        },
        error: (err) => {
          console.error('Erro ao atualizar status:', err);
          alert('Erro ao atualizar status. Verifique o console para mais detalhes.');
        }
      });
  }

  excluirOrcamento(id: number): void {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      this.orcamentoService.excluirOrcamento(id)
        .subscribe({
          next: () => {
            this.orcamentos = this.orcamentos.filter(o => o.id !== id);
            this.aplicarFiltros();
            alert('Orçamento excluído com sucesso.');
          },
          error: (err) => {
            console.error('Erro ao excluir orçamento:', err);
            alert('Erro ao excluir orçamento. Verifique o console para mais detalhes.');
          }
        });
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pendente': return 'status-pendente';
      case 'Aprovado': return 'status-aprovado';
      case 'Recusado': return 'status-recusado';
      case 'Em Produção': return 'status-producao';
      case 'Finalizado': return 'status-finalizado';
      default: return '';
    }
  }
}
