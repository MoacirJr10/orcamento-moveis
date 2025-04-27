import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './app/core/interceptors/error-handler.interceptor';
import { ConfigurationService } from './app/core/services/configuration.service';

// Enable production mode unless in development
if (environment.production) {
  enableProdMode();
}

// Application initialization function
function initializeApp(configService: ConfigurationService) {
  return () => configService.loadConfiguration();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Enhanced router configuration
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable component input binding
      withRouterConfig({
        paramsInheritanceStrategy: 'always', // Inherit route params
        onSameUrlNavigation: 'reload' // Handle same URL navigation
      })
    ),

    // HTTP client with interceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        errorHandlerInterceptor
      ])
    ),

    // Angular Material modules (example)
    importProvidersFrom(MatSnackBarModule),

    // Browser animations
    provideAnimations(),

    // App initialization
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigurationService],
      multi: true
    },

    // Add other application-wide providers here
    // { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
}).catch(err => console.error('Application bootstrap failed', err));
