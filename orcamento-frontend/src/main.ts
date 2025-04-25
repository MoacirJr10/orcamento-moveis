import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';
import { routes } from './app/app.routes'; // Importe as rotas do arquivo de rotas

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Use o objeto de rotas importado
    provideHttpClient(withFetch()),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => { console.log('App initialized'); return Promise.resolve(); },
      multi: true
    }
  ]
}).catch(err => console.error(err));
