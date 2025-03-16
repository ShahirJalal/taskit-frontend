import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful');
          this.loading = false;
          
          if (this.authService.isAdmin()) {
            this.router.navigate(['/users']);
          } else {
            this.router.navigate(['/tasks']);
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully logged in'
          });
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loading = false;
          
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else {
            this.errorMessage = 'An error occurred during login. Please try again.';
          }
        }
      });
  }
}