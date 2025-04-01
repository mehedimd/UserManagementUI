import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  roles: any[] = [];
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {}
  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.email]],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.getRoles();
  }

  getRoles() {
    this.accountService.getRoles().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (e) => console.log(e),
    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
        },
        error: (e) => {
          this.errorMessage =
            e.error.message || 'Registration failed! Please try again.';
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
