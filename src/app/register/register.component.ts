import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit() {

    this.errorMessage = '';


    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }


    this.loading = true;


    this.authService.register(this.username, this.email, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/confirmation']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Registration failed:', error);

          if (error.status === 409) {
            this.errorMessage = 'Username or email already exists';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
  }
}