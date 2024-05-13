import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../model/user.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  visible: boolean = false;
  visibleAddUser: boolean = false;
  selectedUser: User | null = null; // Property to store the selected user for editing
  newUser: any = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openEditDialog(user: User): void {
    // Open the dialog
    this.visible = true;
    // Set the selected user for editing
    this.selectedUser = user;
  }

  closeEditDialog(): void {
    // Close the dialog
    this.visible = false;
  }

  openAddDialog() {
    this.visibleAddUser = true;
  }

  closeAddDialog() {
    this.visibleAddUser = false;
  }

  addUser() {
    this.userService.addUser(this.newUser).subscribe(() => {
      this.loadUsers(); // Reload users after adding a new user
      this.closeAddDialog(); // Close the add user dialog
    });
  }

  saveUser(): void {
    // Save the edited user
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe(updatedUser => {
        // Optionally, handle success or error
        this.visible = false; // Close the dialog after saving
      });
    }
  }
}