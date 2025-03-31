import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UserManagementUI';
  private authService = inject(AuthService);

  isLoggedIn(){
    return this.authService.isAuthenticated();
  }
  getUserName(){
    return this.authService.getUserName();
  }
  logOut(){
    this.authService.logout();
  }
}
