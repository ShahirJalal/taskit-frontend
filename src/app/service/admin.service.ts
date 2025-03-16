import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminRegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  constructor(private http: HttpClient) { }
  
  registerAdmin(request: AdminRegisterRequest, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'Admin-API-Key': apiKey
    });
    
    return this.http.post(`${this.apiUrl}/register-admin`, request, { headers })
      .pipe(
        catchError(error => {
          
          if (error.status === 401) {
            return throwError(() => new Error('Invalid API key'));
          } else if (error.status === 409) {
            return throwError(() => new Error(error.error || 'Username or email already exists'));
          }
          return throwError(() => new Error('Admin registration failed'));
        })
      );
  }
}