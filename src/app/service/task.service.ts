import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Task } from '../model/task.model';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(error => {
        this.handleError('Error fetching tasks', error);
        return throwError(() => error);
      })
    );
  }

  createTask(task: Task): Observable<Task> {
    
    const username = this.authService.getCurrentUser()?.username;
    if (username) {
      task.username = username;
    }

    return this.http.post<Task>(this.apiUrl, task).pipe(
      catchError(error => {
        this.handleError('Error creating task', error);
        return throwError(() => error);
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put<Task>(url, task).pipe(
      catchError(error => {
        this.handleError('Error updating task', error);
        return throwError(() => error);
      })
    );
  }

  deleteTask(taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        this.handleError('Error deleting task', error);
        return throwError(() => error);
      })
    );
  }

  getTaskById(taskId: number): Observable<Task> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.get<Task>(url).pipe(
      catchError(error => {
        this.handleError('Error fetching task', error);
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