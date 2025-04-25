import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrcamentoService } from '../../services/orcamento.service';
import { Orcamento } from '../../models/orcamento.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
selector: 'app-orcamento-list',
standalone: true,
imports: [CommonModule, RouterModule, ReactiveFormsModule],
templateUrl: './orcamento-list.component.html',
styleUrls: ['./orcamento-list.component.css']
})
export class OrcamentoListComponent implements OnInit {
orcamentos: Orcamento[] = [];
orcamentoForm: FormGroup;
mostrarFormulario = false;
modoEdicao = false;
mensagem = '';
tipoMensagem = '';

constructor(
    private orcamentoService: OrcamentoService,
    private fb: FormBuilder
  ) {
    this.orcamentoForm = this.fb.group({
      id: [null],
      nomeCliente: ['', [Validators.required, Validators.minLength(3)]],
      data: [new Date(), Validators.required],
      valorTotal: [0, [Validators.required, Validators.min(0)]],
      observacoes: [''],
      status: ['PENDENTE']
    });
  }

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.orcamentoService.listarOrcamentos().subscribe({
      next: (data) => {
        this.orcamentos = data;
      },
      error: (error) => {
        this.exibirMensagem('Erro ao carregar orçamentos: ' + error.message, 'erro');
      }
    });
  }

  novoOrcamento(): void {
    this.orcamentoForm.reset({
      data: new Date(),
      valorTotal: 0,
      status: 'PENDENTE'
    });
    this.modoEdicao = false;
    this.mostrarFormulario = true;
  }

  editarOrcamento(orcamento: Orcamento): void {
    this.orcamentoForm.setValue({
      id: orcamento.id,
      nomeCliente: orcamento.nomeCliente,
      data: orcamento.data,
      valorTotal: orcamento.valorTotal,
      observacoes: orcamento.observacoes || '',
      status: orcamento.status || 'PENDENTE'
    });
    this.modoEdicao = true;
    this.mostrarFormulario = true;
  }

  salvarOrcamento(): void {
    if (this.orcamentoForm.invalid) {
      this.orcamentoForm.markAllAsTouched();
      return;
    }

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
        }
      });
    }
  }

  excluirOrcamento(id: number): void {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      this.orcamentoService.excluirOrcamento(id).subscribe({
        next: () => {
          this.exibirMensagem('Orçamento excluído com sucesso!', 'sucesso');
          this.carregarOrcamentos();
        },
        error: (error) => {
          this.exibirMensagem('Erro ao excluir orçamento: ' + error.message, 'erro');
        }
      });
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
  }
}
