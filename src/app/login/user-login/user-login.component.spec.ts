import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserLoginComponent } from './user-login.component';
import { UserService } from '../../service/user-service.service';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['addUser']);

    await TestBed.configureTestingModule({
      imports: [UserLoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.formGroup.get('userName')?.value).toBe('');
      expect(component.formGroup.get('pin')?.value).toBe('');
    });

    it('should have required validators on userName', () => {
      const userNameControl = component.formGroup.get('userName');
      userNameControl?.setValue('');
      expect(userNameControl?.valid).toBeFalse();
      userNameControl?.setValue('John');
      expect(userNameControl?.valid).toBeTrue();
    });

    it('should have required validators on pin', () => {
      const pinControl = component.formGroup.get('pin');
      pinControl?.setValue('');
      expect(pinControl?.valid).toBeFalse();
      pinControl?.setValue('1234');
      expect(pinControl?.valid).toBeTrue();
    });
  });

  describe('onLogin', () => {
    it('should not navigate when form is invalid', () => {
      component.formGroup.get('userName')?.setValue('');
      component.formGroup.get('pin')?.setValue('');
      component.onLogin();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      component.formGroup.get('userName')?.setValue('');
      component.formGroup.get('pin')?.setValue('');
      component.onLogin();
      expect(component.formGroup.touched).toBeTrue();
    });

    it('should navigate to sizing-board with pin when form is valid', () => {
      component.formGroup.get('userName')?.setValue('John');
      component.formGroup.get('pin')?.setValue('1234');
      component.onLogin();
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/sizing-board'],
        { queryParams: { pin: '1234' } }
      );
    });
  });

  describe('generatePin', () => {
    it('should generate a 4-digit pin', () => {
      const mockInput = { placeholder: '' } as HTMLInputElement;
      component.formGroup.get('userName')?.setValue('John');
      component.generatePin(mockInput);
      expect(component.generatedPinValue.length).toBe(4);
      expect(parseInt(component.generatedPinValue)).toBeGreaterThanOrEqual(1000);
      expect(parseInt(component.generatedPinValue)).toBeLessThan(10000);
    });

    it('should set the generated pin in the form', () => {
      const mockInput = { placeholder: '' } as HTMLInputElement;
      component.formGroup.get('userName')?.setValue('John');
      component.generatePin(mockInput);
      expect(component.formGroup.get('pin')?.value).toBe(component.generatedPinValue);
    });

    it('should update input placeholder with generated pin', () => {
      const mockInput = { placeholder: '' } as HTMLInputElement;
      component.formGroup.get('userName')?.setValue('John');
      component.generatePin(mockInput);
      expect(mockInput.placeholder).toBe(component.generatedPinValue);
    });

    it('should add user to UserService with generated pin', () => {
      const mockInput = { placeholder: '' } as HTMLInputElement;
      component.formGroup.get('userName')?.setValue('John');
      component.generatePin(mockInput);
      expect(mockUserService.addUser).toHaveBeenCalledWith('John', component.generatedPinValue);
    });
  });
});
