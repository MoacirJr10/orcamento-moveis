import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrcamentoService } from '../../services/orcamento.service';
import { Orcamento } from '../../models/orcamento.model';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
selector: 'app-orcamento-list',
standalone: true,
imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
templateUrl: './orcamento-list.component.html',
styleUrls: ['./orcamento-list.component.css'],
providers: [DatePipe]
})
export class OrcamentoListComponent implements OnInit {
orcamentos: Orcamento[] = [];
orcamentosFiltrados: Orcamento[] = [];
orcamentoForm: FormGroup;
mostrarFormulario = false;
modoEdicao = false;
mensagem = '';
tipoMensagem = '';
termoBusca = '';
paginaAtual = 1;
itensPorPagina = 6;
totalPaginas = 1;
carregando = false;

constructor(
    private orcamentoService: OrcamentoService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  inicializarFormulario(): void {
    this.orcamentoForm = this.fb.group({
      id: [null],
      nomeCliente: ['', [Validators.required, Validators.minLength(3)]],
      data: [this.formatarDataParaInput(new Date()), Validators.required],
      valorTotal: [0, [Validators.required, Validators.min(0)]],
      observacoes: [''],
      status: ['PENDENTE', Validators.required]
    });
  }

  formatarDataParaInput(data: Date): string {
    return this.datePipe.transform(data, 'yyyy-MM-dd') || '';
  }

  carregarOrcamentos(): void {
    this.carregando = true;
    this.orcamentoService.listarOrcamentos().subscribe({
      next: (data) => {
        this.orcamentos = data;
        this.filtrarEPaginar();
        this.carregando = false;
      },
      error: (error) => {
        this.exibirMensagem('Erro ao carregar orçamentos: ' + error.message, 'erro');
        this.carregando = false;
      }
    });
  }

  filtrarEPaginar(): void {
    // Aplicar filtro se houver termo de busca
    if (this.termoBusca) {
      const busca = this.termoBusca.toLowerCase();
      this.orcamentosFiltrados = this.orcamentos.filter(orcamento =>
        orcamento.nomeCliente.toLowerCase().includes(busca) ||
        orcamento.observacoes?.toLowerCase().includes(busca) ||
        orcamento.status?.toLowerCase().includes(busca)
      );
    } else {
      this.orcamentosFiltrados = [...this.orcamentos];
    }

    // Calcular número total de páginas
    this.totalPaginas = Math.ceil(this.orcamentosFiltrados.length / this.itensPorPagina);

    // Ajustar página atual se necessário
    if (this.paginaAtual > this.totalPaginas) {
      this.paginaAtual = Math.max(1, this.totalPaginas);
    }
  }

  getOrcamentosPaginados(): Orcamento[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.orcamentosFiltrados.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  buscarOrcamentos(evento: Event): void {
    this.termoBusca = (evento.target as HTMLInputElement).value;
    this.paginaAtual = 1; // Voltar para a primeira página ao buscar
    this.filtrarEPaginar();
  }

  novoOrcamento(): void {
    this.inicializarFormulario();
    this.modoEdicao = false;
    this.mostrarFormulario = true;
    // Scroll para o formulário
    setTimeout(() => {
      document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  editarOrcamento(orcamento: Orcamento): void {
    this.orcamentoForm.setValue({
      id: orcamento.id,
      nomeCliente: orcamento.nomeCliente,
      data: this.formatarDataParaInput(new Date(orcamento.data)),
      valorTotal: orcamento.valorTotal,
      observacoes: orcamento.observacoes || '',
      status: orcamento.status || 'PENDENTE'
    });
    this.modoEdicao = true;
    this.mostrarFormulario = true;
    // Scroll para o formulário
    setTimeout(() => {
      document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  salvarOrcamento(): void {
    if (this.orcamentoForm.invalid) {
      this.marcarCamposComoTocados();
      this.exibirMensagem('Por favor, corrija os erros do formulário antes de salvar.', 'erro');
      return;
    }

    this.carregando = true;
    const orcamento = this.orcamentoForm.value;

    if (this.modoEdicao) {
      this.orcamentoService.atualizarOrcamento(orcamento).subscribe({
        next: () => {
          this.exibirMensagem('Orçamento atualizado com sucesso!', 'sucesso');
          this.carregarOrcamentos();
          this.cancelar();
        },
        error: (error) => {
          this.exibirMensagem('Erro ao atualizar orçamento: ' + error.message, 'erro');
          this.carregando = false;
        }
      });
    } else {
      this.orcamentoService.adicionarOrcamento(orcamento).subscribe({
        next: () => {
          this.exibirMensagem('Orçamento adicionado com sucesso!', 'sucesso');
          this.carregarOrcamentos();
          this.cancelar();
        },
        error: (error) => {
          this.exibirMensagem('Erro ao adicionar orçamento: ' + error.message, 'erro');
          this.carregando = false;
        }
      });
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.orcamentoForm.controls).forEach(campo => {
      const controle = this.orcamentoForm.get(campo);
      controle?.markAsTouched();
    });
  }

  excluirOrcamento(id: number): void {
    const dialogRef = document.getElementById('confirmDialog') as HTMLDialogElement;
    if (!dialogRef) {
      // Fallback para confirm se o diálogo não estiver disponível
      if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        this.confirmarExclusao(id);
      }
      return;
    }

    // Guardar o ID a ser excluído em um data attribute
    dialogRef.setAttribute('data-id', id.toString());
    dialogRef.showModal();
  }

  confirmarExclusao(id: number): void {
    this.carregando = true;
    this.orcamentoService.excluirOrcamento(id).subscribe({
      next: () => {
        this.exibirMensagem('Orçamento excluído com sucesso!', 'sucesso');
        this.carregarOrcamentos();
      },
      error: (error) => {
        this.exibirMensagem('Erro ao excluir orçamento: ' + error.message, 'erro');
        this.carregando = false;
      }
    });
  }

  fecharDialogoConfirmacao(confirmar: boolean): void {
    const dialogRef = document.getElementById('confirmDialog') as HTMLDialogElement;
    const id = Number(dialogRef.getAttribute('data-id'));
    dialogRef.close();

    if (confirmar && id) {
      this.confirmarExclusao(id);
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.orcamentoForm.reset();
  }

  exibirMensagem(texto: string, tipo: 'sucesso' | 'erro' | 'info'): void {
    this.mensagem = texto;
    this.tipoMensagem = tipo;

    setTimeout(() => {
      this.mensagem = '';
      this.tipoMensagem = '';
    }, 5000);

    // Scroll para a mensagem
    setTimeout(() => {
      document.querySelector('.alert')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  obterMensagemErro(controlName: string): string {
    const control = this.orcamentoForm.get(controlName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return `Este campo é obrigatório`;
      }
      if (control.errors?.['minlength']) {
        return `Deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['min']) {
        return `O valor deve ser maior ou igual a ${control.errors['min'].min}`;
      }
    }
    return '';
  }
}
