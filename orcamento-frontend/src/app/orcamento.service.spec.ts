import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrcamentoService } from './orcamento.service';
import { Orcamento } from '../models/orcamento.model';
import { environment } from '../../environments/environment';

describe('OrcamentoService', () => {
  let service: OrcamentoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/orcamentos`;
  const mockOrcamento: Orcamento = {
    id: 1,
    cliente: 'Cliente Teste',
    data: new Date(),
    descricao: 'Orçamento de teste',
    valor: 1000,
    itens: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrcamentoService]
    });

    service = TestBed.inject(OrcamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Métodos CRUD', () => {
    it('deve listar orçamentos com GET', () => {
      const mockOrcamentos: Orcamento[] = [mockOrcamento];

      service.listarOrcamentos().subscribe(orcamentos => {
        expect(orcamentos.length).toBe(1);
        expect(orcamentos).toEqual(mockOrcamentos);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrcamentos);
    });

    it('deve obter orçamento por ID com GET', () => {
      service.obterOrcamentoPorId(1).subscribe(orcamento => {
        expect(orcamento).toEqual(mockOrcamento);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrcamento);
    });

    it('deve adicionar orçamento com POST', () => {
      service.adicionarOrcamento(mockOrcamento).subscribe(orcamento => {
        expect(orcamento).toEqual(mockOrcamento);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOrcamento);
      req.flush(mockOrcamento);
    });

    it('deve atualizar orçamento com PUT', () => {
      service.atualizarOrcamento(mockOrcamento).subscribe(orcamento => {
        expect(orcamento).toEqual(mockOrcamento);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockOrcamento);
      req.flush(mockOrcamento);
    });

    it('deve excluir orçamento com DELETE', () => {
      service.excluirOrcamento(1).subscribe(() => {
        expect().nothing(); // Apenas verifica se completa sem erros
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Tratamento de erros', () => {
    it('deve lidar com erro 404', () => {
      const errorMessage = 'Orçamento não encontrado';

      service.obterOrcamentoPorId(99).subscribe({
        error: (err) => {
          expect(err.message).toContain(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/99`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('deve lidar com erro de conexão', () => {
      const errorMessage = 'Erro de conexão';

      service.listarOrcamentos().subscribe({
        error: (err) => {
          expect(err.message).toContain(errorMessage);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('Network error'), {
        statusText: errorMessage
      });
    });
  });
});
