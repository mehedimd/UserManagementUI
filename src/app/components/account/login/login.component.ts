import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup; 
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (this.loginForm.valid) { 

      this.authService.login(this.loginForm.value).subscribe({
        next : (res : any) => {
          console.log(res);
          localStorage.setItem('token',res.accessToken);
          localStorage.setItem('refreshToken',res.refreshToken)
          this.router.navigate([''])
        },
        error : e => {
          this.errorMessage = e.error.message || 'Login failed! Please try again.';
        }
      })
    } else {
      console.log('Form is invalid');
    }
  }
}
