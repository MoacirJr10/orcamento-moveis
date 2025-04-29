import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrcamentoService } from '../services/orcamento.service';

@Component({
selector: 'app-orcamento-from',
standalone: true,
imports: [
CommonModule,
ReactiveFormsModule
],
templateUrl: './orcamento-from.component.html',
styleUrls: ['./orcamento-from.component.css']
})
export class OrcamentoFromComponent implements OnInit {
orcamentoForm: FormGroup = new FormGroup({});
ambientes = ['Cozinha', 'Quarto', 'Sala', 'Escritório', 'Banheiro', 'Lavanderia', 'Closet'];
materiais = ['MDF', 'MDP', 'Madeira Maciça', 'Laminado', 'Vidro', 'Alumínio'];

constructor(
    private fb: FormBuilder,
    private orcamentoService: OrcamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orcamentoForm = this.fb.group({
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      ambiente: ['', Validators.required],
      material: ['', Validators.required],
      cores: ['', Validators.required],
      dimensoes: this.fb.group({
        largura: ['', [Validators.required, Validators.min(0.1)]],
        altura: ['', [Validators.required, Validators.min(0.1)]],
        profundidade: ['', [Validators.required, Validators.min(0.1)]]
      }),
      observacoes: [''],
      prazoEntrega: ['', Validators.required],
      valorTotal: ['', [Validators.required, Validators.min(1)]]
    });

    // Adiciona listeners para calcular o valor quando as dimensões ou material mudam
    this.orcamentoForm.get('dimensoes')?.valueChanges.subscribe(() => this.calcularValorTotal());
    this.orcamentoForm.get('material')?.valueChanges.subscribe(() => this.calcularValorTotal());
  }

  onSubmit(): void {
    if (this.orcamentoForm.valid) {
      this.orcamentoService.saveOrcamento(this.orcamentoForm.value).subscribe({
        next: () => {
          this.router.navigate(['/orcamentos']);
        },
        error: (err: any) => {
          console.error('Erro ao salvar orçamento', err);
        }
      });
    } else {
      Object.keys(this.orcamentoForm.controls).forEach(key => {
        const control = this.orcamentoForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  calcularValorTotal(): void {
    const dimensoes = this.orcamentoForm.get('dimensoes')?.value;
    if (!dimensoes?.largura || !dimensoes?.altura || !dimensoes?.profundidade) {
      return;
    }

    // Cálculo simplificado de valor baseado nas dimensões e material
    const volume = dimensoes.largura * dimensoes.altura * dimensoes.profundidade;
    const material = this.orcamentoForm.get('material')?.value;

    let valorBase = volume * 1000; // Valor base por metro cúbico

    // Ajuste baseado no material
    switch(material) {
      case 'MDF':
        valorBase *= 1.2;
        break;
      case 'Madeira Maciça':
        valorBase *= 2.5;
        break;
      case 'Vidro':
        valorBase *= 1.8;
        break;
      default:
        break;
    }

    this.orcamentoForm.patchValue({
      valorTotal: valorBase.toFixed(2)
    });
  }
}
