import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Orcamento } from '../models/orcamento.model';

@Injectable({
providedIn: 'root'
})
export class OrcamentoService {
private apiUrl = `${environment.apiUrl}/orcamentos`;

constructor(private http: HttpClient) { }

  criarOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.apiUrl, orcamento);
  }

  listarOrcamentos(): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(this.apiUrl);
  }

  gerarPdf(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'text' });
  }
}
