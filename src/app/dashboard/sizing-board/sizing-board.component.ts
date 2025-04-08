import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UsernameDialogComponent } from '../../shared/username-dialog/username-dialog.component';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-sizing-board',
  templateUrl: './sizing-board.component.html',
  styleUrl: './sizing-board.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class SizingBoardComponent implements OnInit{
  private socket$!: WebSocketSubject<any>;
  users: { userName: string }[] = [];
  userNames: string[] = [];
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  clickedNumbers: (number | null)[] = [];
  displaySymbol: string[] = ['*', '*', '*', '*', '*'];
  tickMark: string = '✔';
  isRevealed: boolean = false;
  isReset: boolean = false;
  robotImage = '';
  pin: string = '';

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    console.log('SizingBoardComponent initialized');
    this.route.queryParams.subscribe(params => {
      this.pin = params['pin'];
      if (this.pin) {
        console.log('PIN found in URL:', this.pin);
        this.openUsernameDialog();
      } else {
        console.error('PIN is missing in the URL.');
      }
    });
  }

  openUsernameDialog(): void {
    const dialogRef = this.dialog.open(UsernameDialogComponent, {
      width: '300px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(userName => {
      if (userName) {
        this.initializeWebSocket(userName);
        this.clickedNumbers = new Array(this.userNames.length).fill(null);
      } else {
        console.error('User name is required to join the room.');
      }
    });
  }

  initializeWebSocket(userName: string) {
    if (!userName) {
      console.error('User name is not available. Ensure the user is logged in correctly.');
      return;
    }

    this.socket$ = new WebSocketSubject(`ws://localhost:3000?pin=${this.pin}`);
    this.socket$.subscribe((message: any) => {
      if (message.type === 'USER_JOINED') {
        this.users = message.users;
        this.userNames = this.users.map(user => user.userName);
        this.clickedNumbers = new Array(this.userNames.length).fill(null);
      }
    });

    this.socket$.next({ type: 'JOIN_ROOM', userName, pin: this.pin });
  }

  onNumberClick(num: number) {
    if (this.clickedNumbers) {
      for (let i = 0; i < this.clickedNumbers.length; i++) {
        if (this.clickedNumbers[i] === null) {
          this.clickedNumbers[i] = num;
          break;
        }
      }
      this.isRevealed = false;
    }
  }

  onReveal(): void {
    this.displayRobotImagesBasedOnUserSizes();
  }

  displayRobotImagesBasedOnUserSizes(): void {
    if (this.clickedNumberAreSame()) {
      this.robotImage = 'assets/HappyRobot.png';
      this.isRevealed = true;
    } else if (this.clickedNumberAreUnique()) {
      console.log('All clicked numbers are unique');
      this.robotImage = 'assets/SurprizedRobot.png';
      this.isRevealed = true;
    } else if (this.areSixtyPercentNumbersSame()) {
      console.log('At least 60% of the clicked numbers are the same');
      this.robotImage = 'assets/SortOfHappy.png';
      this.isRevealed = true;
    } else {
      console.log('More than 60% of the clicked numbers are different');
      this.robotImage = 'assets/SortOfSurprizedRobot.png';
      this.isRevealed = true;
    }
  }

  clickedNumberAreSame(): boolean {
    if (this.clickedNumbers.length === 0) {
      return false;
    }
    const firstNumber = this.clickedNumbers[0];
    return this.clickedNumbers.every(num => num === firstNumber);
  }

  clickedNumberAreUnique(): boolean {
    const uniqueNumbers = new Set(this.clickedNumbers.filter(num => num !== null));
    return uniqueNumbers.size === this.clickedNumbers.length;
  }

  areSixtyPercentNumbersSame(): boolean {
    if (this.clickedNumbers.length === 0) {
      return false;
    }
    const numberCounts = this.clickedNumbers.reduce((acc, num) => {
      if (num !== null) {
        acc[num] = (acc[num] || 0) + 1;
      }
      return acc;
    }, {} as { [key: number]: number });

    const totalNumbers = this.clickedNumbers.filter(num => num !== null).length;
    const sixtyPercent = totalNumbers * 0.6;

    return Object.values(numberCounts).some(count => count >= sixtyPercent);
  }

  onReset(): void {
    this.isRevealed = false;
    this.clickedNumbers = new Array(this.users.length).fill(null);
    this.displaySymbol = new Array(this.users.length).fill('?');
    this.robotImage = '';
  }

  calculateAverage(): number {
    const validNumbers = this.clickedNumbers.filter(num => num !== null);
    const sum = validNumbers.reduce((acc, num) => acc + num, 0);
    return validNumbers.length ? sum / validNumbers.length : 0;
  }
}