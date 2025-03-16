import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  visible: boolean = false;
  visibleAddUser: boolean = false;
  selectedUser: User | null = null;
  newUser: any = {
    username: '',
    email: '',
    password: '',
    role: 'user'
  };
  isLoading: boolean = true;
  roleOptions = ['user', 'admin'];
  confirmDeleteVisible: boolean = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    if (!this.authService.isAdmin()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: 'You do not have permission to access this page'
      });
      this.router.navigate(['/tasks']);
      return;
    }
    
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    });
  }

  openEditDialog(user: User): void {
    
    this.selectedUser = { ...user, password: '' }; 
    this.visible = true;
  }

  closeEditDialog(): void {
    this.visible = false;
  }

  openAddDialog(): void {
    
    this.newUser = {
      username: '',
      email: '',
      password: '',
      role: 'user'
    };
    
    this.visibleAddUser = true;
  }

  closeAddDialog(): void {
    this.visibleAddUser = false;
  }

  addUser(): void {
    
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'All fields are required'
      });
      return;
    }
    
    
    this.userService.addUser(this.newUser).subscribe({
      next: () => {
        this.loadUsers(); 
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User added successfully'
        });
        this.closeAddDialog();
      },
      error: (error: any) => {
        console.error('Error adding user:', error);
      }
    });
  }

  saveUser(): void {
    
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe({
        next: () => {
          this.loadUsers(); 
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.closeEditDialog();
        },
        error: (error: any) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.confirmDeleteVisible = true;
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.confirmDeleteVisible = false;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;
    
    const userId = this.userToDelete.id;
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully'
        });
        this.cancelDelete();
      },
      error: (error: any) => {
        console.error('Error deleting user:', error);
      }
    });
  }
}