import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Orcamento } from '../models/orcamento.model';
import { environment } from '../../environments/environment';

@Injectable({
providedIn: 'root'
})
export class OrcamentoService {
private readonly apiUrl = `${environment.apiBaseUrl}/orcamentos`;
private readonly httpOptions = {
headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  listarOrcamentos(page: number = 1, pageSize: number = 10): Observable<{ data: Orcamento[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ data: Orcamento[], total: number }>(this.apiUrl, { params })
      .pipe(
        map(response => ({
          data: response.data.map(this.mapOrcamento),
          total: response.total
        })),
        retry(2), // Tentar novamente em caso de falha
        catchError(this.handleError)
      );
  }

  obterOrcamentoPorId(id: number): Observable<Orcamento> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID do orçamento inválido'));
    }

    return this.http.get<Orcamento>(`${this.apiUrl}/${id}`)
      .pipe(
        map(this.mapOrcamento),
        catchError(this.handleError)
      );
  }

  adicionarOrcamento(orcamento: Omit<Orcamento, 'id'>): Observable<Orcamento> {
    if (!this.isValidOrcamento(orcamento)) {
      return throwError(() => new Error('Dados do orçamento inválidos'));
    }

    return this.http.post<Orcamento>(
      this.apiUrl,
      this.sanitizeOrcamento(orcamento),
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  atualizarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    if (!this.isValidOrcamento(orcamento) || !orcamento.id) {
      return throwError(() => new Error('Dados do orçamento inválidos'));
    }

    return this.http.put<Orcamento>(
      `${this.apiUrl}/${orcamento.id}`,
      this.sanitizeOrcamento(orcamento),
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  excluirOrcamento(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID do orçamento inválido'));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  private mapOrcamento(orcamento: Orcamento): Orcamento {
    return {
      ...orcamento,
      data: orcamento.data ? new Date(orcamento.data) : new Date()
    };
  }

  private sanitizeOrcamento(orcamento: Partial<Orcamento>): any {
    const sanitized: any = { ...orcamento };

    // Converter Date para string ISO
    if (sanitized.data instanceof Date) {
      sanitized.data = sanitized.data.toISOString();
    }

    // Remover propriedades não necessárias
    delete sanitized.id;

    return sanitized;
  }

  private isValidOrcamento(orcamento: Partial<Orcamento>): boolean {
    return !!orcamento &&
      !!orcamento.cliente &&
      !!orcamento.descricao &&
      (orcamento.valor !== undefined && orcamento.valor !== null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.status === 0) {
      // Erro de conexão
      errorMessage = 'Erro de conexão com o servidor. Verifique sua conexão de internet.';
    } else if (error.status >= 400 && error.status < 500) {
      // Erro do cliente
      errorMessage = error.error?.message || `Erro na requisição: ${error.statusText}`;
    } else {
      // Erro do servidor
      errorMessage = 'Erro interno no servidor. Por favor, tente novamente mais tarde.';
    }

    console.error('[OrcamentoService] Erro:', error);
    return throwError(() => new Error(errorMessage));
  }
}
