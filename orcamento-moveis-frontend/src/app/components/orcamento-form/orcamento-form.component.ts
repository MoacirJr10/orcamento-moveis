import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrcamentoService } from '../../services/orcamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Orcamento } from '../../models/orcamento.model';

@Component({
selector: 'app-orcamento-form',
templateUrl: './orcamento-form.component.html',
styleUrls: ['./orcamento-form.component.css']
})
export class OrcamentoFormComponent {
orcamentoForm: FormGroup;
orcamentoId: number | null = null;
isEditMode = false;

constructor(
    private fb: FormBuilder,
    private orcamentoService: OrcamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.orcamentoForm = this.fb.group({
      id: [null],
      cliente: ['', Validators.required],
      descricao: [''],
      telefone: [''],
      email: [''],
      observacoes: [''],
      formaPagamento: [''],
      prazoEntregaDias: [0],
      itens: this.fb.array([this.criarItem()])
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orcamentoId = +id;
        this.isEditMode = true;
        this.carregarOrcamento(this.orcamentoId);
      }
    });
  }

  get itens(): FormArray {
    return this.orcamentoForm.get('itens') as FormArray;
  }

  get cliente() {
    return this.orcamentoForm.get('cliente');
  }

  criarItem(): FormGroup {
    return this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: [''],
      material: [''],
      tipoMovel: [''],
      largura: [null],
      altura: [null],
      profundidade: [null],
      preco: [0, [Validators.required, Validators.min(0)]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      cor: [''],
      acabamento: [''],
      observacoes: ['']
    });
  }

  getItemControl(index: number, controlName: string) {
    return this.itens.at(index).get(controlName);
  }

  adicionarItem(): void {
    this.itens.push(this.criarItem());
  }

  removerItem(index: number): void {
    if (this.itens.length > 1) {
      this.itens.removeAt(index);
    }
  }

  carregarOrcamento(id: number): void {
    this.orcamentoService.getOrcamento(id).subscribe({
      next: (orcamento: Orcamento) => {
        this.orcamentoForm.patchValue({
          id: orcamento.id,
          cliente: orcamento.cliente,
          descricao: orcamento.descricao,
          telefone: orcamento.telefone,
          email: orcamento.email,
          observacoes: orcamento.observacoes,
          formaPagamento: orcamento.formaPagamento,
          prazoEntregaDias: orcamento.prazoEntregaDias
        });

        // Limpa os itens existentes
        while (this.itens.length) {
          this.itens.removeAt(0);
        }

        // Adiciona os itens do orçamento
        orcamento.itens.forEach(item => {
          this.itens.push(this.fb.group({
            id: item.id,
            nome: item.nome,
            descricao: item.descricao,
            material: item.material,
            tipoMovel: item.tipoMovel,
            largura: item.largura,
            altura: item.altura,
            profundidade: item.profundidade,
            preco: item.preco,
            quantidade: item.quantidade,
            cor: item.cor,
            acabamento: item.acabamento,
            observacoes: item.observacoes
          }));
        });
      },
      error: (err) => {
        console.error('Erro ao carregar orçamento', err);
      }
    });
  }

  onSubmit(): void {
    if (this.orcamentoForm.valid) {
      const orcamentoData = {
        ...this.orcamentoForm.value,
        valorTotal: this.calcularTotalForm()
      };

      const operation = this.isEditMode
        ? this.orcamentoService.atualizarOrcamento(orcamentoData)
        : this.orcamentoService.criarOrcamento(orcamentoData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/orcamentos']);
        },
        error: (err) => {
          console.error('Erro ao salvar orçamento', err);
        }
      });
    }
  }

  calcularTotalForm(): number {
    return this.itens.controls.reduce((total, item) => {
      const preco = item.get('preco')?.value || 0;
      const quantidade = item.get('quantidade')?.value || 0;
      return total + (preco * quantidade);
    }, 0);
  }

  getDimensoes(index: number): string {
    const item = this.itens.at(index);
    const dimensoes = [];
    if (item.get('largura')?.value) dimensoes.push(`Larg: ${item.get('largura')?.value}cm`);
    if (item.get('altura')?.value) dimensoes.push(`Alt: ${item.get('altura')?.value}cm`);
    if (item.get('profundidade')?.value) dimensoes.push(`Prof: ${item.get('profundidade')?.value}cm`);
    return dimensoes.join(' × ') || 'Sem dimensões especificadas';
  }
}
