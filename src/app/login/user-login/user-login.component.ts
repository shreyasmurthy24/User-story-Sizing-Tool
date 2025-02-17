import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user-service.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserLoginComponent {
  //userName: string = '';
  generatedPinValue: string = '';
  formGroup: FormGroup;
  //users: { userName: string }[] = [];

  constructor(private userService: UserService, private router: Router, private formbuilder: FormBuilder) {
    this.formGroup = this.formbuilder.group({
      userName: ['', Validators.required],
      pin: ['', Validators.required]
    });
  }

  // onLogin(userName: string) {
  //   // this.router.navigate(['/sizing-board'], { queryParams: { name: this.userName } });
  //   if (userName) {
  //     this.userService.addUser(userName);
  //     this.router.navigate(['/sizing-board']);
  //   }
  // }

  onLogin() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const userName = this.formGroup.get('userName')?.value;
    const pin = this.formGroup.get('pin')?.value;

    if (this.userService.validatePin(userName, pin)) {
      console.log('Login successful for user:', userName);
      // if (userName) {
      // this.userService.addUsers(userName);
      this.router.navigate(['/sizing-board'], { queryParams: { name: userName, pin } });
      // this.authService.clearPin();
      // }
    } else {
      console.log('Invalid pin', this.generatedPinValue);
    }
  }

  generatePin(pinInput: HTMLInputElement) {
    this.generatedPinValue = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(this.generatedPinValue);
    pinInput.placeholder = this.generatedPinValue;
    this.formGroup.get('pin')?.setValue(this.generatedPinValue);
    // this.authService.setPin(this.generatedPinValue);
    this.userService.addUser(this.formGroup.get('userName')?.value, this.generatedPinValue);
  }
}