import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Orcamento } from '../models/orcamento.model';

@Injectable({
providedIn: 'root'
})
export class OrcamentoService {
private apiUrl = 'http://localhost:8080/api/orcamentos';

constructor(private http: HttpClient) {}

  listarOrcamentos(): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(this.apiUrl)
      .pipe(
        map(orcamentos => orcamentos.map(orcamento => ({
          ...orcamento,
          data: new Date(orcamento.data)
        }))),
        catchError(this.handleError)
      );
  }

  obterOrcamentoPorId(id: number): Observable<Orcamento> {
    return this.http.get<Orcamento>(`${this.apiUrl}/${id}`)
      .pipe(
        map(orcamento => ({
          ...orcamento,
          data: new Date(orcamento.data)
        })),
        catchError(this.handleError)
      );
  }

  adicionarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.apiUrl, orcamento)
      .pipe(catchError(this.handleError));
  }

  atualizarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.http.put<Orcamento>(`${this.apiUrl}/${orcamento.id}`, orcamento)
      .pipe(catchError(this.handleError));
  }

  excluirOrcamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro ao processar a solicitação';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
