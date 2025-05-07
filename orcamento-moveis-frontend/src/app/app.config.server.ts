import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const serverConfig: ApplicationConfig = {
providers: [
provideServerRendering(),
    provideServerRouting(serverRoutes),
    provideHttpClient(withFetch()), // Configuração específica para SSR
    provideAnimationsAsync(), // Suporte a animações no servidor
    // Providers específicos para SSR podem ser adicionados aqui
    {
      provide: 'SERVER_URL',
      useValue: process.env['SERVER_URL'] || 'http://localhost:4200'
    },
    // Adicione outros providers necessários para SSR
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
