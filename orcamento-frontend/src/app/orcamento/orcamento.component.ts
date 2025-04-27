import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrcamentoService } from '../../services/orcamento.service';
import { Orcamento, OrcamentoItem, OrcamentoUtils, StatusOrcamento } from '../../models/orcamento.model';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
selector: 'app-orcamento',
standalone: true,
imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
templateUrl: './orcamento.component.html',
styleUrls: ['./orcamento.component.css'],
providers: [DatePipe]
})
export class OrcamentoComponent implements OnInit {
orcamentoForm!: FormGroup;
statusOptions: StatusOrcamento[] = ['PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ANDAMENTO', 'CONCLUIDO'];
carregando = false;
mensagem = '';
tipoMensagem = '';
modoEdicao = false;
orcamentoId?: number;

constructor(
    private fb: FormBuilder,
    private orcamentoService: OrcamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    // Verifica se estamos no modo de edição (através da rota)
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orcamentoId = +params['id'];
        this.modoEdicao = true;
        this.carregarOrcamento(this.orcamentoId);
      }
    });
  }

  inicializarFormulario(): void {
    this.orcamentoForm = this.fb.group({
      id: [null],
      nomeCliente: ['', [Validators.required, Validators.minLength(3)]],
      data: [this.formatarDataParaInput(new Date()), Validators.required],
      valorTotal: [{ value: 0, disabled: true }],
      valorFinal: [{ value: 0, disabled: true }],
      desconto: [0, [Validators.min(0)]],
      observacoes: [''],
      status: ['PENDENTE', Validators.required],
      prazoEntrega: [30, [Validators.required, Validators.min(1)]],
      formaPagamento: ['À vista'],
      contato: this.fb.group({
        telefone: [''],
        email: ['', Validators.email],
        endereco: ['']
      }),
      itens: this.fb.array([])
    });

    // Adiciona um item inicial vazio
    this.adicionarItem();

    // Configura ouvintes para atualização automática de valores
    this.orcamentoForm.get('desconto')?.valueChanges.subscribe(() => {
      this.calcularValorFinal();
    });
  }

  formatarDataParaInput(data: Date): string {
    return this.datePipe.transform(data, 'yyyy-MM-dd') || '';
  }

  get itensFormArray(): FormArray {
    return this.orcamentoForm.get('itens') as FormArray;
  }

  carregarOrcamento(id: number): void {
    this.carregando = true;
    this.orcamentoService.obterOrcamento(id).subscribe({
      next: (orcamento) => {
        // Limpa os itens atuais
        while (this.itensFormArray.length) {
          this.itensFormArray.removeAt(0);
        }

        // Adiciona os itens do orçamento
        if (orcamento.itens && orcamento.itens.length > 0) {
          orcamento.itens.forEach(item => {
            this.itensFormArray.push(this.criarItemFormGroup(item));
          });
        } else {
          this.adicionarItem(); // Adiciona um item vazio se não houver itens
        }

        // Preenche o formulário com os dados do orçamento
        this.orcamentoForm.patchValue({
          id: orcamento.id,
          nomeCliente: orcamento.nomeCliente,
          data: this.formatarDataParaInput(new Date(orcamento.data)),
          observacoes: orcamento.observacoes || '',
          status: orcamento.status || 'PENDENTE',
          desconto: orcamento.desconto || 0,
          prazoEntrega: orcamento.prazoEntrega || 30,
          formaPagamento: orcamento.formaPagamento || 'À vista',
          contato: {
            telefone: orcamento.contato?.telefone || '',
            email: orcamento.contato?.email || '',
            endereco: orcamento.contato?.endereco || ''
          }
        });

        // Atualiza os valores totais
        this.atualizarValoresOrcamento();
        this.carregando = false;
      },
      error: (error) => {
        this.exibirMensagem(`Erro ao carregar orçamento: ${error.message}`, 'erro');
        this.carregando = false;
      }
    });
  }

  criarItemFormGroup(item?: OrcamentoItem): FormGroup {
    return this.fb.group({
      id: [item?.id],
      descricao: [item?.descricao || '', [Validators.required, Validators.minLength(3)]],
      quantidade: [item?.quantidade || 1, [Validators.required, Validators.min(1)]],
      valorUnitario: [item?.valorUnitario || 0, [Validators.required, Validators.min(0)]],
      valorTotal: [{ value: item?.valorTotal || 0, disabled: true }],
      observacaoItem: [item?.observacaoItem || ''],
      unidadeMedida: [item?.unidadeMedida || 'un'],
      codigoProduto: [item?.codigoProduto || '']
    });
  }

  adicionarItem(): void {
    this.itensFormArray.push(this.criarItemFormGroup());
  }

  removerItem(index: number): void {
    if (this.itensFormArray.length > 1) {
      this.itensFormArray.removeAt(index);
      this.atualizarValoresOrcamento();
    } else {
      this.exibirMensagem('O orçamento deve ter pelo menos um item', 'info');
    }
  }

  calcularValorItem(index: number): void {
    const itemForm = this.itensFormArray.at(index) as FormGroup;
    const quantidade = itemForm.get('quantidade')?.value || 0;
    const valorUnitario = itemForm.get('valorUnitario')?.value || 0;
    const valorTotal = quantidade * valorUnitario;

    itemForm.get('valorTotal')?.setValue(valorTotal.toFixed(2));
    this.atualizarValoresOrcamento();
  }

  atualizarValoresOrcamento(): void {
    let valorTotal = 0;

    // Soma os valores de todos os itens
    for (let i = 0; i < this.itensFormArray.length; i++) {
      const itemForm = this.itensFormArray.at(i) as FormGroup;
      const quantidade = itemForm.get('quantidade')?.value || 0;
      const valorUnitario = itemForm.get('valorUnitario')?.value || 0;
      valorTotal += quantidade * valorUnitario;
    }

    this.orcamentoForm.get('valorTotal')?.setValue(valorTotal.toFixed(2));
    this.calcularValorFinal();
  }

  calcularValorFinal(): void {
    const valorTotal = parseFloat(this.orcamentoForm.get('valorTotal')?.value || 0);
    const desconto = this.orcamentoForm.get('desconto')?.value || 0;

    const valorFinal = OrcamentoUtils.calcularValorFinal(valorTotal, desconto);
    this.orcamentoForm.get('valorFinal')?.setValue(valorFinal.toFixed(2));
  }

  salvar(): void {
    if (this.orcamentoForm.invalid) {
      this.marcarCamposComoTocados();
      this.exibirMensagem('Por favor, corrija os erros no formulário antes de salvar', 'erro');
      return;
    }

    this.carregando = true;

    // Prepara o objeto orçamento
    const formValue = this.orcamentoForm.getRawValue();
    const orcamento: Orcamento = {
      id: formValue.id,
      nomeCliente: formValue.nomeCliente,
      data: new Date(formValue.data),
      valorTotal: parseFloat(formValue.valorTotal),
      valorFinal: parseFloat(formValue.valorFinal),
      desconto: formValue.desconto,
      observacoes: formValue.observacoes,
      status: formValue.status,
      prazoEntrega: formValue.prazoEntrega,
      formaPagamento: formValue.formaPagamento,
      contato: formValue.contato,
      itens: formValue.itens.map((item: any) => ({
        id: item.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: parseFloat(item.valorTotal),
        observacaoItem: item.observacaoItem,
        unidadeMedida: item.unidadeMedida,
        codigoProduto: item.codigoProduto
      })),
      dataAtualizacao: new Date()
    };

    if (!this.modoEdicao) {
      orcamento.dataCriacao = new Date();
    }

    const operacao = this.modoEdicao
      ? this.orcamentoService.atualizarOrcamento(orcamento)
      : this.orcamentoService.adicionarOrcamento(orcamento);

    operacao.subscribe({
      next: (response) => {
        const mensagem = this.modoEdicao ? 'Orçamento atualizado com sucesso!' : 'Orçamento criado com sucesso!';
        this.exibirMensagem(mensagem, 'sucesso');
        this.carregando = false;

        // Se recebemos um ID na resposta, podemos gerar PDF ou redirecionar
        if (response && response.id) {
          this.orcamentoId = response.id;
        }

        setTimeout(() => {
          this.router.navigate(['/orcamentos']);
        }, 2000);
      },
      error: (error) => {
        this.exibirMensagem(`Erro ao salvar orçamento: ${error.message}`, 'erro');
        this.carregando = false;
      }
    });
  }

  gerarPdf(): void {
    if (!this.orcamentoId) {
      this.exibirMensagem('Salve o orçamento antes de gerar o PDF', 'info');
      return;
    }

    window.open(`${this.orcamentoService.apiUrl}/orcamentos/${this.orcamentoId}/pdf`, '_blank');
  }

  enviarPorEmail(): void {
    if (!this.orcamentoId) {
      this.exibirMensagem('Salve o orçamento antes de enviar por email', 'info');
      return;
    }

    const email = this.orcamentoForm.get('contato.email')?.value;
    if (!email) {
      this.exibirMensagem('Informe o email do cliente para enviar o orçamento', 'info');
      return;
    }

    this.carregando = true;
    this.orcamentoService.enviarOrcamentoPorEmail(this.orcamentoId, email).subscribe({
      next: () => {
        this.exibirMensagem('Orçamento enviado por email com sucesso!', 'sucesso');
        this.carregando = false;
      },
      error: (error) => {
        this.exibirMensagem(`Erro ao enviar email: ${error.message}`, 'erro');
        this.carregando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/orcamentos']);
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.orcamentoForm.controls).forEach(campo => {
      const controle = this.orcamentoForm.get(campo);
      controle?.markAsTouched();
    });

    // Marca todos os campos de todos os itens como tocados
    for (let i = 0; i < this.itensFormArray.length; i++) {
      const itemForm = this.itensFormArray.at(i) as FormGroup;
      Object.keys(itemForm.controls).forEach(campo => {
        const controle = itemForm.get(campo);
        controle?.markAsTouched();
      });
    }
  }

  exibirMensagem(texto: string, tipo: 'sucesso' | 'erro' | 'info'): void {
    this.mensagem = texto;
    this.tipoMensagem = tipo;

    setTimeout(() => {
      this.mensagem = '';
      this.tipoMensagem = '';
    }, 5000);
  }

  obterMensagemErro(controlName: string, formGroup: FormGroup = this.orcamentoForm): string {
    const control = formGroup.get(controlName);
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
      if (control.errors?.['email']) {
        return `Email inválido`;
      }
    }
    return '';
  }
}
