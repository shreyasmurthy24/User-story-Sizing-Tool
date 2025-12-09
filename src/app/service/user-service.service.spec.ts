import { TestBed } from '@angular/core/testing';

import { UserService } from './user-service.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addUser', () => {
    it('should add a user to a new session', () => {
      service.addUser('John', '1234');
      const users = service.getUsers('1234');
      expect(users.length).toBe(1);
      expect(users[0].userName).toBe('John');
    });

    it('should add multiple users to the same session', () => {
      service.addUser('John', '1234');
      service.addUser('Jane', '1234');
      const users = service.getUsers('1234');
      expect(users.length).toBe(2);
      expect(users[0].userName).toBe('John');
      expect(users[1].userName).toBe('Jane');
    });

    it('should keep users in separate sessions by pin', () => {
      service.addUser('John', '1234');
      service.addUser('Jane', '5678');
      expect(service.getUsers('1234').length).toBe(1);
      expect(service.getUsers('5678').length).toBe(1);
    });
  });

  describe('getUsers', () => {
    it('should return empty array for non-existent pin', () => {
      const users = service.getUsers('9999');
      expect(users).toEqual([]);
    });

    it('should return all users for a given pin', () => {
      service.addUser('John', '1234');
      service.addUser('Jane', '1234');
      const users = service.getUsers('1234');
      expect(users.length).toBe(2);
    });
  });

  describe('clearUsers', () => {
    it('should clear all users for a given pin', () => {
      service.addUser('John', '1234');
      service.addUser('Jane', '1234');
      service.clearUsers('1234');
      expect(service.getUsers('1234')).toEqual([]);
    });

    it('should not affect users in other sessions', () => {
      service.addUser('John', '1234');
      service.addUser('Jane', '5678');
      service.clearUsers('1234');
      expect(service.getUsers('1234')).toEqual([]);
      expect(service.getUsers('5678').length).toBe(1);
    });

    it('should not throw when clearing non-existent session', () => {
      expect(() => service.clearUsers('9999')).not.toThrow();
    });
  });

  describe('validatePin', () => {
    it('should return true if user exists in session', () => {
      service.addUser('John', '1234');
      expect(service.validatePin('John', '1234')).toBeTrue();
    });

    it('should return false if user does not exist in session', () => {
      service.addUser('John', '1234');
      expect(service.validatePin('Jane', '1234')).toBeFalse();
    });

    it('should return false for non-existent pin', () => {
      expect(service.validatePin('John', '9999')).toBeFalse();
    });

    it('should return false for empty session', () => {
      service.addUser('John', '1234');
      service.clearUsers('1234');
      expect(service.validatePin('John', '1234')).toBeFalse();
    });
  });

  describe('getCurrentUserName', () => {
    it('should return the first user name in session', () => {
      service.addUser('John', '1234');
      service.addUser('Jane', '1234');
      expect(service.getCurrentUserName('1234')).toBe('John');
    });

    it('should return "Unknown User" for non-existent pin', () => {
      expect(service.getCurrentUserName('9999')).toBe('Unknown User');
    });

    it('should return "Unknown User" for empty session', () => {
      service.addUser('John', '1234');
      service.clearUsers('1234');
      expect(service.getCurrentUserName('1234')).toBe('Unknown User');
    });
  });
});
