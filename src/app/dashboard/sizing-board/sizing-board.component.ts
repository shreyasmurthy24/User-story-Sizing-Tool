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
  currentUserName: string = '';
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  clickedNumbers: (number | null)[] = [];
  displaySymbol: string[] = ['*', '*', '*', '*', '*'];
  tickMark: string = '✔';
  isRevealed: boolean = false;
  isReset: boolean = false;
  robotImage = '';
  pin: string = '';

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {
  }

  ngOnInit() : void {
    this.route.queryParams.subscribe(params => {
      this.pin = params['pin'];
      if (this.pin) {
        this.openUsernameDialog();
      } else {
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
        this.currentUserName = userName;
        this.userNames.push(userName);
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

    const wsUrl = `wss://tap-size.amrock-sb.foc.zone:3000?pin=${this.pin}`;

    this.socket$ = new WebSocketSubject(wsUrl);
    this.socket$.subscribe((message: any) => {
      if (message.type === 'USER_JOINED') {
        this.users = message.users;
        this.userNames = this.users.map(user => user.userName);
        this.clickedNumbers = new Array(this.userNames.length).fill(null);
      }

      if (message.type === 'NUMBER_CLICKED') {
        const userIndex = this.userNames.indexOf(message.userName);
        if (userIndex !== -1) {
          this.clickedNumbers[userIndex] = message.number;
        }
      }

      if (message.type === 'REVEAL') {
        this.clickedNumbers = message.clickedNumbers;
        this.isRevealed = true;
        this.displayRobotImagesBasedOnUserSizes();
      }

      if (message.type === 'RESET') {
        this.isRevealed = false;
        this.clickedNumbers = new Array(this.users.length).fill(null);
        this.displaySymbol = new Array(this.users.length).fill('?');
        this.robotImage = '';
      }
    });

    this.socket$.next({ type: 'JOIN_ROOM', userName, pin: this.pin });
  }

  onNumberClick(num: number) {
    const userIndex = this.userNames.indexOf(this.currentUserName);
    if (userIndex !== -1 && this.clickedNumbers[userIndex] === null) {
      this.clickedNumbers[userIndex] = num;

      this.socket$.next({
        type: 'NUMBER_CLICKED',
        userName: this.currentUserName,
        number: num,
        pin: this.pin
      });

      this.isRevealed = false;
    } else {
      console.error('Unable to map the clicked number to the logged-in user.');
    }
  }

  onReveal(): void {
    this.socket$.next({
      type: 'REVEAL',
      pin: this.pin,
      clickedNumbers: this.clickedNumbers
    });

    this.displayRobotImagesBasedOnUserSizes();
  }

  displayRobotImagesBasedOnUserSizes(): void {
    if (this.clickedNumberAreSame()) {
      this.robotImage = 'assets/HappyRobot.png';
      this.isRevealed = true;
    } else if (this.clickedNumberAreUnique()) {
      this.robotImage = 'assets/SurprizedRobot.png';
      this.isRevealed = true;
    } else if (this.areSixtyPercentNumbersSame()) {
      this.robotImage = 'assets/SortOfHappy.png';
      this.isRevealed = true;
    } else {
      this.robotImage = 'assets/SortOfSurprizedRobot.png';
      this.isRevealed = true;
    }
  }

  clickedNumberAreSame(): boolean {
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
    const ninetyPercent = totalNumbers * 0.9;
  
    return Object.values(numberCounts).some(count => count >= ninetyPercent);
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

    this.socket$.next({
      type: 'RESET',
      pin: this.pin
    });
  }

  calculateAverage(): number {
    const validNumbers = this.clickedNumbers.filter(num => num !== null);
    const sum = validNumbers.reduce((acc, num) => acc + num, 0);
    return validNumbers.length ? sum / validNumbers.length : 0;
  }
}