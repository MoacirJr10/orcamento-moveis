import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);

if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Verificação de roles
  const requiredRoles = route.data['roles'];
  if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
