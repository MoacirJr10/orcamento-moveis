import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

// Ativa o modo de produção se não estiver em desenvolvimento
if (environment.production) {
  enableProdMode();
}

/**
 * Configuração da aplicação para SSR (Server-Side Rendering)
 *
 * Inclui:
 * - Hidratação para SSR
 * - Configuração de roteamento com scroll restoration
 * - HttpClient configurado para SSR
 * - Providers globais
 */
const serverConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()), // Usa fetch para compatibilidade com SSR
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Restaura posição do scroll entre navegações
        anchorScrolling: 'enabled'       // Suporte a scroll para âncoras
      })
    ),
    // Adicione outros providers específicos do servidor aqui
    // { provide: SERVER_REQUEST, useValue: req } // Exemplo para acesso à requisição
  ]
};

/**
 * Função de bootstrap para a aplicação
 *
 * @returns Promise da aplicação inicializada
 */
const bootstrap = () => {
  return bootstrapApplication(AppComponent, serverConfig)
    .catch(err => console.error('Falha na inicialização da aplicação:', err));
};

export default bootstrap;
