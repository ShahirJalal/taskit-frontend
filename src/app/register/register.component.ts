import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { } // Inject Router

  onSubmit() {
    this.http.post<any>('http://localhost:8080/api/users', { username: this.username, email: this.email, password: this.password })
      .subscribe(
        response => {
          // Handle successful registration
          console.log('Registration successful:', response);
          // Redirect to login page
          setTimeout(() => {
            this.router.navigate(['/confirmation']);
          }, 2000);
        },
        error => {
          // Handle registration error
          console.error('Registration failed:', error);
        }
      );
  }
}