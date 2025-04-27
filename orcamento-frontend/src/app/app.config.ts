import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

/**
* Configuração principal da aplicação Angular
*
* Define os provedores globais e configurações essenciais
*/
export const appConfig: ApplicationConfig = {
providers: [
// Configuração otimizada do Zone.js para detecção de mudanças
provideZoneChangeDetection({
      eventCoalescing: true,  // Agrupa eventos similares para melhor performance
      runCoalescing: true    // Agrupa execuções de detecção de mudanças
    }),

    // Configuração do sistema de roteamento
    provideRouter(routes),

    // Configuração de hidratação para SSR (Server-Side Rendering)
    provideClientHydration(
      withEventReplay()  // Habilita replay de eventos após hidratação
    ),

    // Configuração do HttpClient com interceptors
    provideHttpClient(
      withInterceptors([
        loggingInterceptor  // Interceptor para logging de requisições
        // Adicione outros interceptors conforme necessário
      ])
    ),

    // Outros provedores globais podem ser adicionados aqui
    // { provide: APP_CONFIG, useValue: environment }
  ]
};
