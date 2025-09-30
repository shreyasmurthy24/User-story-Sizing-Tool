import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSessions: { [pin: string]: { userName: string }[] } = {};

  addUser(userName: string, pin: string) {
    if (!this.userSessions[pin]) {
      this.userSessions[pin] = [];
    }
    this.userSessions[pin].push({ userName });
  }

  getUsers(pin: string) {
    return this.userSessions[pin] || [];
  }

  clearUsers(pin: string) {
    if (this.userSessions[pin]) {
      this.userSessions[pin] = [];
    }
  }

  validatePin(userName: string, pin: string): boolean {
    const session = this.userSessions[pin];
    return session ? session.some(user => user.userName === userName) : false;
  }

  getCurrentUserName(pin: string): string {
    const session = this.userSessions[pin];
    return session && session.length > 0 ? session[0].userName : 'Unknown User';
  }
}