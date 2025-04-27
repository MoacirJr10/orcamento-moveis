import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
providers: [

provideServerRendering(),

    // Configura as rotas específicas para SSR
    provideServerRoutesConfig(serverRoutes),

    // Aqui podem ser adicionados providers específicos para SSR
    // { provide: SOME_TOKEN, useValue: 'server-value' }
  ]
};

/**
 * Configuração final mesclando a configuração padrão do app
 * com as configurações específicas do servidor
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
