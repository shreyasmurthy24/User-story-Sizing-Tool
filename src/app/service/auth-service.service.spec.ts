import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setPin', () => {
    it('should set the pin value', () => {
      service.setPin('1234');
      expect(service.validatePin('1234')).toBeTrue();
    });

    it('should overwrite previous pin when set again', () => {
      service.setPin('1234');
      service.setPin('5678');
      expect(service.validatePin('1234')).toBeFalse();
      expect(service.validatePin('5678')).toBeTrue();
    });
  });

  describe('validatePin', () => {
    it('should return true for matching pin', () => {
      service.setPin('1234');
      expect(service.validatePin('1234')).toBeTrue();
    });

    it('should return false for non-matching pin', () => {
      service.setPin('1234');
      expect(service.validatePin('9999')).toBeFalse();
    });

    it('should return false when no pin is set', () => {
      expect(service.validatePin('1234')).toBeFalse();
    });

    it('should return false for empty string when pin is set', () => {
      service.setPin('1234');
      expect(service.validatePin('')).toBeFalse();
    });
  });

  describe('clearPin', () => {
    it('should clear the stored pin', () => {
      service.setPin('1234');
      service.clearPin();
      expect(service.validatePin('1234')).toBeFalse();
    });

    it('should not throw when clearing an already null pin', () => {
      expect(() => service.clearPin()).not.toThrow();
    });
  });
});
