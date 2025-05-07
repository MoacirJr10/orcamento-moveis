import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withDebugTracing, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, withJsonpSupport } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
providers: [
// Zone.js Configuration
provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true
    }),

    // Router Configuration
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable component input binding
      withDebugTracing(), // Enable router debugging in development
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // Smooth scrolling behavior
        anchorScrolling: 'enabled'
      })
    ),

    // Client Hydration (SSR)
    provideClientHydration(
      withEventReplay({
        // Customize event replay behavior
        eventReplayer: {
          replayAll: true,
          replayClick: true,
          replayFocus: true
        }
      })
    ),

    // HTTP Client Configuration
    provideHttpClient(
      withFetch(), // Use Fetch API instead of XHR
      withJsonpSupport(), // Enable JSONP support
      withInterceptors([
        authInterceptor, // Authentication interceptor
        errorHandlerInterceptor, // Global error handler
        loadingInterceptor // Loading state management
      ])
    ),

    // Animation Providers
    provideAnimations(), // Standard animations
    provideAnimationsAsync(), // Async animations support

    // Add any additional application-wide providers here
  ]
};
