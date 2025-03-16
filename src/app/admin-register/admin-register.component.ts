import { Component } from '@angular/core';
import { AdminService, AdminRegisterRequest } from '../service/admin.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent {
  adminRequest: AdminRegisterRequest = {
    username: '',
    email: '',
    password: ''
  };

  confirmPassword: string = '';
  apiKey: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private router: Router
  ) { }

  onSubmit() {
    this.errorMessage = '';

    if (!this.adminRequest.username || !this.adminRequest.email ||
      !this.adminRequest.password || !this.confirmPassword || !this.apiKey) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.adminRequest.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.adminService.registerAdmin(this.adminRequest, this.apiKey)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin user created successfully'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Failed to create admin user';
        }
      });
  }
}