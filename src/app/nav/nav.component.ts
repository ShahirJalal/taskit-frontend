import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  items: MenuItem[] = [];
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateMenu();
    
    
    this.authService.currentUser$.subscribe(() => {
      this.updateMenu();
    });
  }
  
  updateMenu() {
    const isLoggedIn = this.authService.isLoggedIn();
    const isAdmin = this.authService.isAdmin();
    const username = this.authService.getCurrentUser()?.username || '';
    
    this.items = [];
    
    if (isLoggedIn) {
      
      this.items.push(
        {
          label: 'Tasks',
          icon: 'pi pi-check-square',
          routerLink: '/tasks'
        }
      );
      
      
      if (isAdmin) {
        this.items.push(
          {
            label: 'Users',
            icon: 'pi pi-users',
            routerLink: '/users'
          }
        );
      }
      
      
      this.items.push(
        {
          label: username,
          icon: 'pi pi-user',
          items: [
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: () => this.logout()
            }
          ]
        }
      );
    } else {
      
      this.items.push(
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          routerLink: '/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          routerLink: '/register'
        }
      );
    }
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}