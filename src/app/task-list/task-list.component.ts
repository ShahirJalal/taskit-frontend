import { Component, OnInit } from '@angular/core';
import { TaskService } from '../service/task.service';
import { Task } from '../model/task.model';

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
  newTask: any = {};
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) { }

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
    // Open the dialog
    this.visible = true;
    // Set the selected user for editing
    this.selectedTask = task;
  }

  saveTask(): void {
    // Save the edited user
    if (this.selectedTask) {
      this.taskService.updateTask(this.selectedTask).subscribe(updatedTask => {
        // Optionally, handle success or error
        this.visible = false; // Close the dialog after saving
      });
    }
  }

  showAddDialog(): void {
    this.addDialogVisible = true;
  }

  closeEditDialog(): void {
    localStorage.removeItem('taskId');
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask(): void {
    this.taskService.createTask(this.newTask).subscribe(
      (createdTask: Task) => {
        // If successful, add the created task to the local tasks list
        this.tasks.push(createdTask);
        // Reset the newTask object to clear the form fields
        this.newTask = {};
        // Close the add task dialog
        this.addDialogVisible = false;
      },
      (error) => {
        // Handle error if any
        console.error('Error adding task:', error);
        // Optionally, show a message to the user
      }
    );
  }  

  // completeTask(task: Task): void {
  //   // Update the task status to 'completed' using the task service
  //   this.taskService.updateTask(task.id, { ...task, status: 'completed' }).subscribe(updatedTask => {
  //     // If successful, update the local tasks list with the updated task
  //     const index = this.tasks.findIndex(t => t.id === updatedTask.id);
  //     if (index !== -1) {
  //       this.tasks[index] = updatedTask;
  //     }
  //   });
  // }

  completeTask(task: Task): void {
    // Update the task status to 'completed' using the task service
    task.status = 'completed'; // Update the status property
    this.taskService.updateTask(task).subscribe(updatedTask => {
      // If successful, update the local tasks list with the updated task
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    });
  }  

  deleteTask(task: Task): void {
    // Delete the task using the task service
    this.taskService.deleteTask(task.id).subscribe(() => {
      // If successful, remove the task from the local tasks list
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    });
  }
}