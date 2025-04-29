import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orcamento } from '../models/orcamento.model';

@Injectable({
providedIn: 'root'
})
export class OrcamentoService {
private apiUrl = 'http://localhost:8080/api/orcamentos';

constructor(private http: HttpClient) { }

  listarOrcamentos(): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(this.apiUrl);
  }
}
