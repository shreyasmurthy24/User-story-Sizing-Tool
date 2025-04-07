import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//https://www.youtube.com/watch?v=ho8bJ-MQwiU
@Component({
  selector: 'app-username-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <h1 mat-dialog-title class="dialog-title">Welcome!</h1>
    <div mat-dialog-content class="dialog-content">
      <p>Please enter your name to join the room:</p>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Username</mat-label>
        <input matInput [(ngModel)]="userName" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()" class="cancel-button">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" cdkFocusInitial>Join</button>
    </div>
  `,
  styles: [`
    .dialog-title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .dialog-content {
      text-align: center;
      font-size: 1rem;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      margin-top: 10px;
    }
    .dialog-actions button {
      min-width: 120px;
    }
    .cancel-button {
      color: #f44336;
    }
  `]
})
export class UsernameDialogComponent {
  userName: string = '';
  constructor(public dialogRef: MatDialogRef<UsernameDialogComponent>) {}

  onCancel(): void {
    console.log('Username dialog canceled.');
    this.dialogRef.close(null);
  }

  onSubmit(): void {
      console.log('Username dialog');
    console.log('Username dialog submitted with username:', this.userName.trim());
    this.dialogRef.close(this.userName.trim());
  }
}
