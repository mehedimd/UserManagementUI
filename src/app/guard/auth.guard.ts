import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  if (authService.getAuthStatus()) {
    console.log('router guard true');
    return true;
  }
  const isRefreshSuccess = await authService.tryRefreshingTokens();
  console.log(isRefreshSuccess);
  if (!isRefreshSuccess) {
    console.log('router guard false');
    router.navigate(['/login']);
  }
  return isRefreshSuccess;
};
