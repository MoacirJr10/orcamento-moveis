import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrcamentoListComponent } from './orcamento-list.component';
import { OrcamentoService } from '../../services/orcamento.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Orcamento } from '../../models/orcamento.model';

describe('OrcamentoListComponent', () => {
  let component: OrcamentoListComponent;
  let fixture: ComponentFixture<OrcamentoListComponent>;
  let orcamentoServiceSpy: jasmine.SpyObj<OrcamentoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OrcamentoService', ['listarOrcamentos', 'getOrcamento']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrcamentoListComponent],
      providers: [
        { provide: OrcamentoService, useValue: spy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    orcamentoServiceSpy = TestBed.inject(OrcamentoService) as jasmine.SpyObj<OrcamentoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcamentoListComponent);
    component = fixture.componentInstance;

    const mockOrcamentos: Orcamento[] = [
      {
        id: 1,
        cliente: 'Cliente Teste',
        valorTotal: 1000,
        dataCriacao: new Date(),
        status: 'Pendente',
        itens: []
      }
    ];

    orcamentoServiceSpy.listarOrcamentos.and.returnValue(of({
      content: mockOrcamentos,
      totalElements: 1,
      totalPages: 1,
      size: 10,
      number: 0
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orcamentos on init', () => {
    expect(orcamentoServiceSpy.listarOrcamentos).toHaveBeenCalled();
    expect(component.orcamentos.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should calculate total correctly', () => {
    const itens = [
      { preco: 100, quantidade: 2 },
      { preco: 200, quantity: 1 }
    ] as ItemOrcamento[];
    expect(component.calcularTotal(itens)).toBe(400);
  });

  it('should handle error when loading orcamentos', () => {
    orcamentoServiceSpy.listarOrcamentos.and.returnValue(of([]));
    component.carregarOrcamentos();
    expect(component.errorMessage).toBe('');
  });
});
