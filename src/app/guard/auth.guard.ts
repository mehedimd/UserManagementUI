import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  if (authService.getAuthStatus()) {
    return true;
  }
  const isRefreshSuccess = await authService.tryRefreshingTokens();
  if (!isRefreshSuccess) {
    router.navigate(['/login']);
  }
  return isRefreshSuccess;
};
