import { HttpInterceptorFn } from '@angular/common/http';
import { Common } from '../shared/library/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Skip adding the token for the login, register and refresh token endpoints
  if (req.url.includes('Auth/login') || req.url.includes('Auth/refreshToken') || req.url.includes('Auth/register')) 
  {
    return next(req); // No token added for these requests
  }
  const newReq = req.clone(Common.getApiHeader());
  return next(newReq);
};
