import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orcamento, OrcamentoPaginado, OrcamentoFiltro, StatusOrcamento } from '../models/orcamento.model';
import { environment } from '../../environments/environment';

@Injectable({
providedIn: 'root'
})
export class OrcamentoService {
private apiUrl = `${environment.apiUrl}/api/orcamentos`;

constructor(private http: HttpClient) { }

  /**
   * Lista orçamentos com paginação e filtros
   * @param filtro Parâmetros de filtragem e paginação
   */
  listarOrcamentos(filtro: OrcamentoFiltro = {}): Observable<OrcamentoPaginado> {
    let params = new HttpParams();

    if (filtro.page) params = params.set('page', filtro.page.toString());
    if (filtro.size) params = params.set('size', filtro.size.toString());
    if (filtro.sort) params = params.set('sort', filtro.sort);
    if (filtro.search) params = params.set('search', filtro.search);
    if (filtro.status) params = params.set('status', filtro.status);
    if (filtro.dataInicio) params = params.set('dataInicio', filtro.dataInicio);
    if (filtro.dataFim) params = params.set('dataFim', filtro.dataFim);

    return this.http.get<OrcamentoPaginado>(this.apiUrl, { params });
  }

  /**
   * Obtém um orçamento pelo ID
   * @param id ID do orçamento
   */
  getOrcamento(id: number): Observable<Orcamento> {
    return this.http.get<Orcamento>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo orçamento
   * @param orcamento Dados do orçamento
   */
  criarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.apiUrl, orcamento);
  }

  /**
   * Atualiza um orçamento existente
   * @param orcamento Dados atualizados do orçamento
   */
  atualizarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.http.put<Orcamento>(`${this.apiUrl}/${orcamento.id}`, orcamento);
  }

  /**
   * Atualiza apenas o status de um orçamento
   * @param id ID do orçamento
   * @param status Novo status
   */
  atualizarStatus(id: number, status: StatusOrcamento): Observable<Orcamento> {
    return this.http.patch<Orcamento>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Exclui um orçamento
   * @param id ID do orçamento
   */
  deletarOrcamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Gera PDF do orçamento
   * @param id ID do orçamento
   */
  gerarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Obtém estatísticas de orçamentos
   */
  getEstatisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estatisticas`);
  }

  /**
   * Busca rápida por nome do cliente
   * @param term Termo de busca
   */
  buscarPorCliente(term: string): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(`${this.apiUrl}/busca`, {
      params: { term }
    });
  }
}
