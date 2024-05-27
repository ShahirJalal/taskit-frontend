import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) { }

  onSubmit() {
    this.http.post<any>('https://taskit-backend-551e091e845d.herokuapp.com/api/users/login', { username: this.username, password: this.password })
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error('Login failed:', error);
        }
      );
  }
}
