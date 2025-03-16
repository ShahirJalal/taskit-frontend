import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(error => {
        this.handleError('Error fetching users', error);
        return throwError(() => error);
      })
    );
  }

  
  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(error => {
        this.handleError('Error fetching user', error);
        return throwError(() => error);
      })
    );
  }

  
  getCurrentUser(): Observable<User> {
    const url = `${this.apiUrl}/me`;
    return this.http.get<User>(url).pipe(
      catchError(error => {
        this.handleError('Error fetching current user', error);
        return throwError(() => error);
      })
    );
  }

  
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        this.handleError('Error adding user', error);
        return throwError(() => error);
      })
    );
  }

  
  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    
    
    if (!user.password) {
      
      const { password, ...userWithoutPassword } = user;
      return this.http.put<User>(url, userWithoutPassword).pipe(
        catchError(error => {
          this.handleError('Error updating user', error);
          return throwError(() => error);
        })
      );
    }
    
    return this.http.put<User>(url, user).pipe(
      catchError(error => {
        this.handleError('Error updating user', error);
        return throwError(() => error);
      })
    );
  }

  
  deleteUser(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(error => {
        this.handleError('Error deleting user', error);
        return throwError(() => error);
      })
    );
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}