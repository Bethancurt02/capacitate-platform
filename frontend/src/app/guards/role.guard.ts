import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];
  const userRole = authService.currentUserValue?.rol;

  if (authService.currentUserValue && userRole === expectedRole) {
    return true;
  }

  if (userRole === 'admin') {
    router.navigate(['/admin']);
  } else if (userRole === 'user') {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
