import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userApiUrl = `${environment.apiUrl}/users`;
  private tokenKey = 'auth_token';
  private userKey = 'user_info';
  
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          this.storeTokenAndUserInfo(response);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(username: string, email: string, password: string, role: string = 'USER'): Observable<any> {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
      role: role.toUpperCase() 
    };
    
    return this.http.post(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getCurrentUserInfo(): Observable<any> {
    return this.http.get(`${this.userApiUrl}/me`)
      .pipe(
        tap(user => {
          
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            const updatedUser = { ...currentUser, ...user };
            localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole === role.toUpperCase(); 
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  private storeTokenAndUserInfo(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);
    
    const userInfo = {
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role
    };
    
    localStorage.setItem(this.userKey, JSON.stringify(userInfo));
    this.currentUserSubject.next(userInfo);
  }

  private getUserFromStorage(): any {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }
}