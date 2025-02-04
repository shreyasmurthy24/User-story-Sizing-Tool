import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user-service.service';

@Component({
  selector: 'app-sizing-board',
  templateUrl: './sizing-board.component.html',
  styleUrl: './sizing-board.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class SizingBoardComponent {
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

  // constructor(private route: ActivatedRoute) { }
  constructor(private userService: UserService, private route: ActivatedRoute) { }

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe(params => {
  //     this.userNames = params['name'] || 'Guest';
  //   });
  // }

  ngOnInit() {
    // this.users = this.userService.getUsers();
    // this.clickedNumbers = new Array(this.users.length).fill(null);
    // this.users = this.userService.getUsers();
    // this.userNames = this.users.map(user => user.userName);
    // this.clickedNumbers = new Array(this.userNames.length).fill(null);
    // this.displaySymbol = new Array(this.userNames.length).fill('?');
    this.route.queryParams.subscribe(params => {
      this.pin = params['pin'];
      this.users = this.userService.getUsers(this.pin);
      this.userNames = this.users.map(user => user.userName);
      this.clickedNumbers = new Array(this.userNames.length).fill(null);
      this.displaySymbol = new Array(this.userNames.length).fill('?');
    });
  }

  onNumberClick(num: number) {
    if (this.clickedNumbers) {
      for (let i = 0; i < this.clickedNumbers.length; i++) {
        if (this.clickedNumbers[i] === null) {
          this.clickedNumbers[i] = num;
          this.displaySymbol[i] = this.tickMark;
          break;
        }
      }
      this.isRevealed = false;
    }
  }

  onReveal(): void {
    // this.isRevealed = true;
    // this.robotImage = 'assets/HappyRobot.png';
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
    // this.isReset = true;
    // this.clickedNumbers = [];
    // this.displaySymbol = '?';
    // this.isRevealed = false;
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