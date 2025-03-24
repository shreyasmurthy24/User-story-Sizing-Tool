import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pin: string | null = null;

  constructor() { }

  setPin(pin: string) {
    this.pin = pin;
  }

  validatePin(enteredPin: string): boolean {
    return this.pin === enteredPin;
  }

  clearPin() {
    this.pin = null;
  }
}