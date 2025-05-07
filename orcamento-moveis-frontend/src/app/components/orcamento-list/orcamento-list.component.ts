import { Component, OnInit } from '@angular/core';
import { OrcamentoService } from '../../services/orcamento.service';
import { Orcamento } from '../../models/orcamento.model';
import { Router } from '@angular/router';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/operators';

@Component({
selector: 'app-orcamento-list',
templateUrl: './orcamento-list.component.html',
styleUrls: ['./orcamento-list.component.css']
})
export class OrcamentoListComponent implements OnInit {
orcamentos: Orcamento[] = [];
loading = true;
errorMessage = '';
searchTerm = '';
currentPage = 1;
itemsPerPage = 10;
totalItems = 0;
sortField = 'dataCriacao';
sortDirection = 'desc';

constructor(
    private orcamentoService: OrcamentoService,
    private router: Router,
    private pdfGeneratorService: PdfGeneratorService
  ) { }

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orcamentoService.listarOrcamentos({
      page: this.currentPage,
      size: this.itemsPerPage,
      sort: `${this.sortField},${this.sortDirection}`,
      search: this.searchTerm
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.orcamentos = response.content;
        this.totalItems = response.totalElements;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar orçamentos. Tente novamente mais tarde.';
        console.error('Erro ao carregar orçamentos', err);
      }
    });
  }

  calcularTotal(itens: ItemOrcamento[]): number {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  editarOrcamento(id: number): void {
    this.router.navigate(['/orcamentos/editar', id]);
  }

  gerarPdf(id: number): void {
    this.orcamentoService.getOrcamento(id).subscribe({
      next: (orcamento) => {
        this.pdfGeneratorService.gerarPdf(orcamento).subscribe({
          next: (pdf) => {
            const blob = new Blob([pdf], { type: 'application/pdf' });
            saveAs(blob, `orcamento_${id}.pdf`);
          },
          error: (err) => {
            console.error('Erro ao gerar PDF', err);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao buscar orçamento', err);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.carregarOrcamentos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.carregarOrcamentos();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.carregarOrcamentos();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'aprovado': return 'badge bg-success';
      case 'pendente': return 'badge bg-warning text-dark';
      case 'cancelado': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}
