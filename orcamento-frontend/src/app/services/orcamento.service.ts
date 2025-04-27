import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  listarOrcamentos(): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(this.apiUrl, this.httpOptions).pipe(
      map(orcamentos => this.mapOrcamentosDates(orcamentos)),
      catchError(this.handleError)
    );
  }

  obterOrcamentoPorId(id: number): Observable<Orcamento> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID do orçamento inválido'));
    }

    return this.http.get<Orcamento>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      map(orcamento => this.mapOrcamentoDate(orcamento)),
      catchError(this.handleError)
    );
  }

  adicionarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
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

    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private mapOrcamentosDates(orcamentos: Orcamento[]): Orcamento[] {
    return orcamentos.map(orcamento => this.mapOrcamentoDate(orcamento));
  }

  private mapOrcamentoDate(orcamento: Orcamento): Orcamento {
    return {
      ...orcamento,
      data: orcamento.data ? new Date(orcamento.data) : new Date()
    };
  }

  private sanitizeOrcamento(orcamento: Orcamento): any {
    // Remove propriedades não necessárias ou potencialmente problemáticas
    const { id, ...sanitized } = orcamento;

    // Converte a data para string ISO se for um objeto Date
    if (sanitized.data instanceof Date) {
      sanitized.data = sanitized.data.toISOString();
    }

    return sanitized;
  }

  private isValidOrcamento(orcamento: Orcamento): boolean {
    return !!orcamento &&
           !!orcamento.cliente &&
           !!orcamento.descricao &&
           !!orcamento.valor;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou rede
      errorMessage = `Erro de cliente: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = this.getServerErrorMessage(error);
    }

    console.error('[OrcamentoService]', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Requisição inválida. Verifique os dados enviados.';
      case 401:
        return 'Acesso não autorizado. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para executar esta ação.';
      case 404:
        return 'Orçamento não encontrado.';
      case 500:
        return 'Erro interno no servidor. Tente novamente mais tarde.';
      default:
        return `Erro no servidor: Código ${error.status}, Mensagem: ${error.message}`;
    }
  }
}
