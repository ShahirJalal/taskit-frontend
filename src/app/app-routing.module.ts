import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { TaskListComponent } from './task-list/task-list.component'; // Import the TaskListComponent

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'tasks', component: TaskListComponent } // Define the route for TaskListComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }