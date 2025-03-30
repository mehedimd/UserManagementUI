import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '../models/account/login';
import { Router } from '@angular/router';
import { TokenVM } from '../models/account/token';
import { MasterService } from '../shared/services/master.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private jwtHelper : JwtHelperService,
    private masterService : MasterService,
    private router : Router
  ){}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is null or undefined.');
      return false;
    }
  
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error('Token is not a valid JWT format:', token);
      return false;
    }
  
    // Safely check token expiration
    try {
      const isExpired = this.jwtHelper.isTokenExpired(token);
      console.log('Is token expired:', isExpired);
      return !isExpired; // Return true if not expired
    } catch (error) {
      console.error('Error in JwtHelperService.isTokenExpired:', error);
      return false;
    }
  }

  getAuthStatus(): boolean {
    console.log(this.isAuthenticated)
    return this.isAuthenticated()
  }

  login(user : Login) {
    return this.masterService.post('Auth/login',user);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  // refresh token

  async tryRefreshingTokens(): Promise<boolean> {
    console.log("Hello from Auth Gurard");
    try{
      const jwt: any = localStorage.getItem('token');
      const refreshToken: any = localStorage.getItem('refreshToken');
      if (!jwt || !refreshToken) { return false; }

      const credentials = {
        accessToken: jwt,
        refreshToken: refreshToken,
      };

      let isRefreshSuccess: boolean;

      const refreshRes = await new Promise<TokenVM>(
        (resolve, reject) => {
          this.masterService.post<TokenVM>('Auth/RefreshToken', credentials)
          .subscribe({
              next: (res: TokenVM) => {
                console.log(res)
                resolve(res);
              },
              error: (e) => {
                console.log(e)
                reject({ message: e.error.message, error: e })
              },
            });
        }
      );
      
      isRefreshSuccess = true;
      localStorage.setItem('token', refreshRes.accessToken);
      localStorage.setItem('refreshToken', refreshRes.refreshToken);
      return isRefreshSuccess;
    }
    catch(error : any){
      console.error('Error occurred:', error.message);
      return false;
    }
  }
}
