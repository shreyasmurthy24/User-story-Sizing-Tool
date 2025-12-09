import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UsernameDialogComponent, LoggingService } from './username-dialog.component';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log message to console', () => {
    spyOn(console, 'log');
    service.log('Test message');
    expect(console.log).toHaveBeenCalledWith('Test message', undefined);
  });

  it('should log message with data to console', () => {
    spyOn(console, 'log');
    const data = { key: 'value' };
    service.log('Test message', data);
    expect(console.log).toHaveBeenCalledWith('Test message', data);
  });
});

describe('UsernameDialogComponent', () => {
  let component: UsernameDialogComponent;
  let fixture: ComponentFixture<UsernameDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<UsernameDialogComponent>>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockLoggingService = jasmine.createSpyObj('LoggingService', ['log']);

    await TestBed.configureTestingModule({
      imports: [UsernameDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
        { provide: LoggingService, useValue: mockLoggingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty userName', () => {
    expect(component.userName).toBe('');
  });

  describe('onCancel', () => {
    it('should log cancellation message', () => {
      component.onCancel();
      expect(mockLoggingService.log).toHaveBeenCalledWith('Username dialog canceled.');
    });

    it('should close dialog with null', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith(null);
    });

    it('should navigate to user-login', () => {
      component.onCancel();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/user-login');
    });
  });

  describe('onSubmit', () => {
    it('should close dialog with trimmed userName', () => {
      component.userName = '  John  ';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith('John');
    });

    it('should close dialog with empty string when userName is only whitespace', () => {
      component.userName = '   ';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith('');
    });

    it('should close dialog with userName when no trimming needed', () => {
      component.userName = 'John';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith('John');
    });
  });
});
