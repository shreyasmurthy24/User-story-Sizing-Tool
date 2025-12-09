
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user-service.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class UserLoginComponent {
  generatedPinValue: string = '';
  formGroup: FormGroup;

  constructor(private userService: UserService, private router: Router, private formbuilder: FormBuilder) {
    this.formGroup = this.formbuilder.group({
      userName: ['', Validators.required],
      pin: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const pin = this.formGroup.get('pin')?.value;

    if (pin) {
      console.log('Login successful. Redirecting to sizing board with PIN:', pin);
      this.router.navigate(['/sizing-board'], { queryParams: { pin } });
    } else {
      console.log('Invalid PIN');
    }
  }

  generatePin(pinInput: HTMLInputElement) {
    this.generatedPinValue = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(this.generatedPinValue);
    pinInput.placeholder = this.generatedPinValue;
    this.formGroup.get('pin')?.setValue(this.generatedPinValue);
    this.userService.addUser(this.formGroup.get('userName')?.value, this.generatedPinValue);
  }
}