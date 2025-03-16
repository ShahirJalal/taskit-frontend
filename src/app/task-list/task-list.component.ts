import { Component, OnInit } from '@angular/core';
import { TaskService } from '../service/task.service';
import { Task } from '../model/task.model';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  visible: boolean = false;
  selectedTaskId: number | undefined;
  addDialogVisible: boolean = false;
  newTask: any = {
    title: '',
    description: '',
    urgency: 'Medium',
    status: 'New'
  };
  selectedTask: Task | null = null;
  isLoading: boolean = true;
  urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];
  statusOptions = ['New', 'In Progress', 'Completed', 'Cancelled'];

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  showEditDialog(taskId: number): void {
    this.selectedTaskId = taskId;
    localStorage.setItem('taskId', taskId.toString());
    this.visible = true;
    console.log('Editing task with ID:', taskId);
  }

  openEditDialog(task: Task): void {
    
    if (!this.canEditTask(task)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to edit this task'
      });
      return;
    }
    
    
    this.visible = true;
    
    this.selectedTask = { ...task }; 
  }

  saveTask(): void {
    
    if (this.selectedTask) {
      this.taskService.updateTask(this.selectedTask).subscribe({
        next: updatedTask => {
          
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task updated successfully'
          });
          
          this.visible = false; 
        },
        error: error => {
          console.error('Error updating task:', error);
        }
      });
    }
  }

  showAddDialog(): void {
    
    this.newTask = {
      title: '',
      description: '',
      urgency: 'Medium',
      status: 'New'
    };
    
    this.addDialogVisible = true;
  }

  closeEditDialog(): void {
    this.visible = false;
    localStorage.removeItem('taskId');
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    });
  }

  addTask(): void {
    if (!this.newTask.title) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Title is required'
      });
      return;
    }

    this.taskService.createTask(this.newTask).subscribe({
      next: (createdTask: Task) => {
        
        this.tasks.push(createdTask);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task created successfully'
        });
        
        
        this.newTask = {
          title: '',
          description: '',
          urgency: 'Medium',
          status: 'New'
        };
        
        
        this.addDialogVisible = false;
      },
      error: (error) => {
        
        console.error('Error adding task:', error);
      }
    });
  }

  completeTask(task: Task): void {
    
    if (!this.canEditTask(task)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to update this task'
      });
      return;
    }
    
    
    const updatedTask = { ...task, status: 'Completed' };
    
    this.taskService.updateTask(updatedTask).subscribe({
      next: result => {
        
        const index = this.tasks.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.tasks[index] = result;
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task marked as completed'
        });
      },
      error: error => {
        console.error('Error completing task:', error);
      }
    });
  }

  deleteTask(task: Task): void {
    
    if (!this.canDeleteTask(task)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to delete this task'
      });
      return;
    }
    
    
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task deleted successfully'
        });
      },
      error: error => {
        console.error('Error deleting task:', error);
      }
    });
  }

  
  canEditTask(task: Task): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    
    if (this.authService.isAdmin()) {
      return true;
    }
    
    
    return currentUser && task.username === currentUser.username;
  }

  
  canDeleteTask(task: Task): boolean {
    
    return this.canEditTask(task);
  }

  
  getUrgencyColor(urgency: string): string {
    switch (urgency.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'info';
    }
  }

  
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'new': return 'info';
      case 'in progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }
}