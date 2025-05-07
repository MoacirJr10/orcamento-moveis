import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OrcamentoService } from '../services/orcamento.service';

export const loadingResolver: ResolveFn<boolean> = (route, state) => {
const orcamentoService = inject(OrcamentoService);
// Lógica para pré-carregamento de dados
return orcamentoService.preload().pipe(
    map(() => true),
    catchError(() => of(false))
  );
};
