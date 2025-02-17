import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // constructor() { 
  //   this.addUser('Angelina Joli', '1234');
  //   this.addUser('Tom Cat', '1234');
  //   this.addUser('Abraham Lincoln', '5678');
  //   this.addUser('John Doe', '5678');
  // }
  //private users: string[] = ['Angelina Joli', 'Tom Cat', 'Abraham Linclon', 'John Doe'];

  // private users: { userName: string, pin: string }[] = [];
  private userSessions: { [pin: string]: { userName: string }[] } = {};

  addUser(userName: string, pin: string) {
    // this.users.push({ userName, pin });
    if (!this.userSessions[pin]) {
      this.userSessions[pin] = [];
    }
    this.userSessions[pin].push({ userName });
  }

  getUsers(pin: string) {
    // return this.users;
    return this.userSessions[pin] || [];
  }

  clearUsers(pin: string) {
    // this.users = [];
    if (this.userSessions[pin]) {
      this.userSessions[pin] = [];
    }
  }

  validatePin(userName: string, pin: string): boolean {
    const session = this.userSessions[pin];
    return session ? session.some(user => user.userName === userName) : false;
  }
}