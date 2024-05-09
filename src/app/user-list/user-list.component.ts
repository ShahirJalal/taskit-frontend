import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  visible: boolean = false;
  selectedUser: User | null = null; // Property to store the selected user for editing

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  editUser(user: User): void {
    // Open the dialog
    this.visible = true;
    // Set the selected user for editing
    this.selectedUser = user;
  }

  closeEditDialog(): void {
    // Close the dialog
    this.visible = false;
  }
}