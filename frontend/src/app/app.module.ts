import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Importando as rotas
import { routes } from './app.routes';

// Importando os componentes
import { AppComponent } from './app.component';
import { OrcamentoListComponent } from './orcamento-list/orcamento-list.component';
import { OrcamentoFromComponent } from './orcamento-from/orcamento-from.component';

@NgModule({
imports: [
BrowserModule,
ReactiveFormsModule,
HttpClientModule,
RouterModule.forRoot(routes)
    // Componentes standalone NÃO devem ser importados diretamente aqui
    // Eles já se declaram como standalone
  ],
  // Se os componentes não são standalone, coloque-os em declarations
  // Se forem standalone, não precisa declará-los
  declarations: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
