import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrcamentoService } from '../../services/orcamento.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-orcamento-form',
templateUrl: './orcamento-form.component.html',
styleUrls: ['./orcamento-form.component.css']
})
export class OrcamentoFormComponent {
orcamentoForm: FormGroup;

constructor(
    private fb: FormBuilder,
    private orcamentoService: OrcamentoService,
    private router: Router
  ) {
    this.orcamentoForm = this.fb.group({
      cliente: ['', Validators.required],
      descricao: [''],
      itens: this.fb.array([this.criarItem()])
    });
  }

  get itens(): FormArray {
    return this.orcamentoForm.get('itens') as FormArray;
  }

  criarItem(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      material: [''],
      largura: [0],
      altura: [0],
      profundidade: [0],
      preco: [0, Validators.min(0)],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      cor: [''],
      acabamento: ['']
    });
  }

  adicionarItem(): void {
    this.itens.push(this.criarItem());
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  onSubmit(): void {
    if (this.orcamentoForm.valid) {
      const formValue = this.orcamentoForm.value;
      const orcamento = {
        ...formValue,
        valorTotal: this.calcularTotalForm()
      };

      this.orcamentoService.criarOrcamento(orcamento).subscribe({
        next: () => {
          this.router.navigate(['/']);
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
}
