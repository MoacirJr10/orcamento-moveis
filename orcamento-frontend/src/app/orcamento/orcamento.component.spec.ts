import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';

import { OrcamentoComponent } from './orcamento.component';
import { OrcamentoService } from '../../services/orcamento.service';
import { Orcamento } from '../../models/orcamento.model';

describe('OrcamentoComponent', () => {
  let component: OrcamentoComponent;
  let fixture: ComponentFixture<OrcamentoComponent>;
  let orcamentoService: jasmine.SpyObj<OrcamentoService>;

  // Mock data
  const mockOrcamento: Orcamento = {
    id: 1,
    nomeCliente: 'Cliente Teste',
    data: new Date(),
    valorTotal: 1500,
    valorFinal: 1425,
    desconto: 75,
    status: 'PENDENTE',
    prazoEntrega: 30,
    formaPagamento: 'À vista',
    itens: [
      {
        id: 1,
        descricao: 'Mesa de escritório',
        quantidade: 1,
        valorUnitario: 1000,
        valorTotal: 1000
      },
      {
        id: 2,
        descricao: 'Cadeira de escritório',
        quantidade: 1,
        valorUnitario: 500,
        valorTotal: 500
      }
    ]
  };

  beforeEach(async () => {
    // Create a spy object for the OrcamentoService
    const orcamentoServiceSpy = jasmine.createSpyObj('OrcamentoService', [
      'obterOrcamento',
      'adicionarOrcamento',
      'atualizarOrcamento',
      'enviarOrcamentoPorEmail'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        OrcamentoComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        DatePipe,
        { provide: OrcamentoService, useValue: orcamentoServiceSpy }
      ]
    }).compileComponents();

    orcamentoService = TestBed.inject(OrcamentoService) as jasmine.SpyObj<OrcamentoService>;
    fixture = TestBed.createComponent(OrcamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a form containing default values', () => {
    expect(component.orcamentoForm).toBeDefined();
    expect(component.orcamentoForm.get('nomeCliente')?.value).toBe('');
    expect(component.orcamentoForm.get('status')?.value).toBe('PENDENTE');
    expect(component.itensFormArray.length).toBe(1);
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.orcamentoForm.get('nomeCliente')?.setValue('');
    component.itensFormArray.at(0).get('descricao')?.setValue('');

    expect(component.orcamentoForm.valid).toBeFalsy();
  });

  it('should add a new item to the form array', () => {
    const initialLength = component.itensFormArray.length;
    component.adicionarItem();
    expect(component.itensFormArray.length).toBe(initialLength + 1);
  });

  it('should remove an item from the form array', () => {
    // Add an extra item first
    component.adicionarItem();
    const initialLength = component.itensFormArray.length;

    component.removerItem(0);
    expect(component.itensFormArray.length).toBe(initialLength - 1);
  });

  it('should not remove item if it is the only one', () => {
    // Ensure there's only one item
    while (component.itensFormArray.length > 1) {
      component.removerItem(0);
    }

    const initialLength = component.itensFormArray.length;
    component.removerItem(0);
    expect(component.itensFormArray.length).toBe(initialLength);
  });

  it('should calculate item total value correctly', () => {
    const itemForm = component.itensFormArray.at(0);
    itemForm.get('quantidade')?.setValue(3);
    itemForm.get('valorUnitario')?.setValue(100);

    component.calcularValorItem(0);

    expect(itemForm.get('valorTotal')?.value).toBe('300.00');
  });

  it('should update total orcamento values when an item changes', () => {
    // Set up two items
    component.adicionarItem();

    // Configure first item
    const item1 = component.itensFormArray.at(0);
    item1.get('quantidade')?.setValue(2);
    item1.get('valorUnitario')?.setValue(100);

    // Configure second item
    const item2 = component.itensFormArray.at(1);
    item2.get('quantidade')?.setValue(1);
    item2.get('valorUnitario')?.setValue(50);

    // Calculate values
    component.calcularValorItem(0);
    component.calcularValorItem(1);

    // Check total
    expect(component.orcamentoForm.get('valorTotal')?.value).toBe('250.00');
  });

  it('should apply discount correctly to final value', () => {
    // Set total
    component.orcamentoForm.get('valorTotal')?.setValue('1000.00');

    // Apply discount
    component.orcamentoForm.get('desconto')?.setValue(100);
    component.calcularValorFinal();

    expect(component.orcamentoForm.get('valorFinal')?.value).toBe('900.00');
  });

  it('should load existing orcamento data correctly', fakeAsync(() => {
    orcamentoService.obterOrcamento.and.returnValue(of(mockOrcamento));

    component.carregarOrcamento(1);
    tick();

    expect(component.orcamentoForm.get('nomeCliente')?.value).toBe('Cliente Teste');
    expect(component.itensFormArray.length).toBe(2);
    expect(component.orcamentoForm.get('valorTotal')?.value).toBe('1500.00');
  }));

  it('should handle errors when loading orcamento', fakeAsync(() => {
    orcamentoService.obterOrcamento.and.returnValue(throwError(() => new Error('Server error')));

    spyOn(component, 'exibirMensagem');
    component.carregarOrcamento(1);
    tick();

    expect(component.exibirMensagem).toHaveBeenCalledWith(jasmine.stringMatching(/Erro ao carregar orçamento/), 'erro');
  }));

  it('should save new orcamento correctly', fakeAsync(() => {
    // Set form values
    component.orcamentoForm.get('nomeCliente')?.setValue('Novo Cliente');
    component.itensFormArray.at(0).get('descricao')?.setValue('Item Teste');
    component.itensFormArray.at(0).get('quantidade')?.setValue(1);
    component.itensFormArray.at(0).get('valorUnitario')?.setValue(100);

    orcamentoService.adicionarOrcamento.and.returnValue(of({ id: 123 }));

    spyOn(component, 'exibirMensagem');
    component.salvar();
    tick();

    expect(orcamentoService.adicionarOrcamento).toHaveBeenCalled();
    expect(component.exibirMensagem).toHaveBeenCalledWith('Orçamento criado com sucesso!', 'sucesso');
    expect(component.orcamentoId).toBe(123);
  }));

  it('should update existing orcamento correctly', fakeAsync(() => {
    // Setup edit mode
    component.modoEdicao = true;
    component.orcamentoId = 1;

    // Set form values
    component.orcamentoForm.get('id')?.setValue(1);
    component.orcamentoForm.get('nomeCliente')?.setValue('Cliente Atualizado');
    component.itensFormArray.at(0).get('descricao')?.setValue('Item Teste');
    component.itensFormArray.at(0).get('quantidade')?.setValue(1);
    component.itensFormArray.at(0).get('valorUnitario')?.setValue(100);

    orcamentoService.atualizarOrcamento.and.returnValue(of({ id: 1 }));

    spyOn(component, 'exibirMensagem');
    component.salvar();
    tick();

    expect(orcamentoService.atualizarOrcamento).toHaveBeenCalled();
    expect(component.exibirMensagem).toHaveBeenCalledWith('Orçamento atualizado com sucesso!', 'sucesso');
  }));

  it('should validate form before saving', () => {
    // Make form invalid
    component.orcamentoForm.get('nomeCliente')?.setValue('');

    spyOn(component, 'exibirMensagem');
    spyOn(component, 'marcarCamposComoTocados');

    component.salvar();

    expect(component.marcarCamposComoTocados).toHaveBeenCalled();
    expect(component.exibirMensagem).toHaveBeenCalledWith(jasmine.stringMatching(/corrija os erros/), 'erro');
    expect(orcamentoService.adicionarOrcamento).not.toHaveBeenCalled();
    expect(orcamentoService.atualizarOrcamento).not.toHaveBeenCalled();
  });

  it('should require orcamentoId before generating PDF', () => {
    component.orcamentoId = undefined;

    spyOn(component, 'exibirMensagem');
    spyOn(window, 'open');

    component.gerarPdf();

    expect(component.exibirMensagem).toHaveBeenCalledWith('Salve o orçamento antes de gerar o PDF', 'info');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should open PDF in new window when orcamentoId is available', () => {
    component.orcamentoId = 123;
    orcamentoService.apiUrl = 'http://localhost:8080/api';

    spyOn(window, 'open');

    component.gerarPdf();

    expect(window.open).toHaveBeenCalledWith('http://localhost:8080/api/orcamentos/123/pdf', '_blank');
  });
});
