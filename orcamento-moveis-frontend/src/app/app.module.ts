import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';

import { AppComponent } from './app.component';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';
import { routes } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

@NgModule({
declarations: [
AppComponent,
OrcamentoListComponent,
OrcamentoFormComponent
],
imports: [
BrowserModule,
HttpClientModule,
BrowserAnimationsModule,
RouterModule,
CoreModule,
SharedModule,
// Outros módulos de funcionalidades
],
providers: [
provideClientHydration(),
    provideAnimations(),
    provideRouter(
      routes,
      withComponentInputBinding() // Habilita binding de inputs via rota
    ),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorHandlerInterceptor,
        loadingInterceptor
      ])
    ),
    // Outros providers globais
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
