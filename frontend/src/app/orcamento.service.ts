import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';

// Interface for Orcamento with improved typing
export interface Orcamento {
id: number;
cliente: string;
telefone: string;
email: string;
endereco: string;
ambiente: string;
material: string;
cores: string;
dimensoes: {
largura: number;
altura: number;
profundidade: number;
};
observacoes?: string;
prazoEntrega: number;
valorTotal: number;
dataCriacao: string;
status: 'Pendente' | 'Aprovado' | 'Recusado' | 'Em Produção' | 'Finalizado';
}

@Injectable({
providedIn: 'root'
})
export class OrcamentoService {
private apiUrl = 'api/orcamentos'; // API base URL

// Simulated data for development
private orcamentosSimulados: Orcamento[] = [
{
id: 1,
cliente: 'João Silva',
telefone: '11999887766',
email: 'joao.silva@email.com',
endereco: 'Rua das Flores, 123 - São Paulo/SP',
ambiente: 'Cozinha',
material: 'MDF',
cores: 'Branco com detalhes em madeira',
dimensoes: {
largura: 3.5,
altura: 2.8,
profundidade: 0.6
},
observacoes: 'Incluir ilha central e espaço para geladeira',
prazoEntrega: 30,
valorTotal: 12500.00,
dataCriacao: '2025-04-15T10:30:00Z',
status: 'Pendente'
},
// ... other sample data
];

constructor(private http: HttpClient) { }

  // Get all orçamentos
  getOrcamentos(): Observable<Orcamento[]> {
    // For development - return simulated data
    return of(this.orcamentosSimulados).pipe(
      delay(800),
      tap(data => console.log('Orçamentos carregados', data)),
      catchError(this.handleError<Orcamento[]>('getOrcamentos', []))
    );

    // For production:
    // return this.http.get<Orcamento[]>(this.apiUrl).pipe(
    //   catchError(this.handleError<Orcamento[]>('getOrcamentos', []))
    // );
  }

  // Get single orçamento by ID
  getOrcamentoById(id: number): Observable<Orcamento> {
    const orcamento = this.orcamentosSimulados.find(o => o.id === id);
    if (!orcamento) {
      return this.handleError<Orcamento>(`getOrcamentoById id=${id}`)(new Error('Orçamento não encontrado'));
    }

    return of(orcamento).pipe(
      delay(500),
      tap(data => console.log(`Orçamento ${id} carregado`, data)),
      catchError(this.handleError<Orcamento>(`getOrcamentoById id=${id}`))
    );

    // For production:
    // return this.http.get<Orcamento>(`${this.apiUrl}/${id}`).pipe(
    //   catchError(this.handleError<Orcamento>(`getOrcamentoById id=${id}`))
    // );
  }

  // Create new orçamento
  saveOrcamento(orcamento: Omit<Orcamento, 'id' | 'dataCriacao' | 'status'>): Observable<Orcamento> {
    const novoOrcamento: Orcamento = {
      ...orcamento,
      id: Math.max(...this.orcamentosSimulados.map(o => o.id)) + 1,
      dataCriacao: new Date().toISOString(),
      status: 'Pendente'
    };

    this.orcamentosSimulados.push(novoOrcamento);

    return of(novoOrcamento).pipe(
      delay(800),
      tap(data => console.log('Orçamento criado', data)),
      catchError(this.handleError<Orcamento>('saveOrcamento'))
    );

    // For production:
    // return this.http.post<Orcamento>(this.apiUrl, orcamento).pipe(
    //   catchError(this.handleError<Orcamento>('saveOrcamento'))
    // );
  }

  // Update orçamento
  updateOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    const index = this.orcamentosSimulados.findIndex(o => o.id === orcamento.id);
    if (index >= 0) {
      this.orcamentosSimulados[index] = orcamento;
    }

    return of(orcamento).pipe(
      delay(500),
      tap(data => console.log('Orçamento atualizado', data)),
      catchError(this.handleError<Orcamento>('updateOrcamento'))
    );

    // For production:
    // return this.http.put<Orcamento>(`${this.apiUrl}/${orcamento.id}`, orcamento).pipe(
    //   catchError(this.handleError<Orcamento>('updateOrcamento'))
    // );
  }

  // Delete orçamento
  deleteOrcamento(id: number): Observable<void> {
    this.orcamentosSimulados = this.orcamentosSimulados.filter(o => o.id !== id);
    return of(undefined).pipe(
      delay(500),
      tap(() => console.log(`Orçamento ${id} excluído`)),
      catchError(this.handleError<void>('deleteOrcamento'))
    );

    // For production:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    //   catchError(this.handleError<void>('deleteOrcamento'))
    // );
  }

  // Error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Optionally send error to logging service
      return of(result as T);
    };
  }
}
