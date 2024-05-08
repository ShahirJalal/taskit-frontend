import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  visible: boolean = false;
  selectedTaskId: number | undefined;

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

  //commit test

  closeEditDialog(): void {
    localStorage.removeItem('taskId');
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  completeTask(task: Task): void {
    // Update the task status to 'completed' using the task service
    this.taskService.updateTask(task.id, { ...task, status: 'completed' }).subscribe(updatedTask => {
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