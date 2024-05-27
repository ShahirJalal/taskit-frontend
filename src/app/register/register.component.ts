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
    // Add 'user' role to the user data before registration
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: 'user'
    };

    // this.http.post<any>('https://taskit-backend-551e091e845d.herokuapp.com/api/users', userData)
    this.http.post<any>('http://localhost:8080/api/users', userData)
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
