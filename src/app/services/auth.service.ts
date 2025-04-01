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
    console.log(this.isAuthenticated());
    return this.isAuthenticated()
  }

  getUserRole(){
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage.');
      return null;
    }
    const claims = this.decodeJwt(token);
    if (claims) { 

      console.log(claims);
      const role = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || claims["role"];
      return role ? role.toLowerCase() : null;

    } else {
      console.error('Failed to decode token.');
      return null;
    }
  }

  getUserName(){
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage.');
      return null;
    }
    const claims = this.decodeJwt(token);
    if (claims) { 

      console.log(claims);
      const userName = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      return userName;

    } else {
      console.error('Failed to decode token.');
      return null;
    }
  }

  // decode jwt token
  decodeJwt(token: any): any {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
      }
      // Decode the payload (second part)
      const payloadBase64 = parts[1];
      const decodedPayload = atob(payloadBase64); // Base64 decoding
      return JSON.parse(decodedPayload); // Parse as JSON
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
  login(user : Login) {
    return this.masterService.post<any>('Auth/login',user);
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
                reject({ message: e.message, error: e })
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
