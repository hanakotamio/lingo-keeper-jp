import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateJLPTLevel,
  validateCEFRLevel,
} from '@/utils/validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.jp')).toBe(true);
      expect(validateEmail('admin@test-domain.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for passwords with 8 or more characters', () => {
      expect(validatePassword('12345678')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('VeryLongPassword123!')).toBe(true);
    });

    it('should return false for passwords with less than 8 characters', () => {
      expect(validatePassword('1234567')).toBe(false);
      expect(validatePassword('pass')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateJLPTLevel', () => {
    it('should return true for valid JLPT levels', () => {
      expect(validateJLPTLevel('N5')).toBe(true);
      expect(validateJLPTLevel('N4')).toBe(true);
      expect(validateJLPTLevel('N3')).toBe(true);
      expect(validateJLPTLevel('N2')).toBe(true);
      expect(validateJLPTLevel('N1')).toBe(true);
    });

    it('should return false for invalid JLPT levels', () => {
      expect(validateJLPTLevel('N6')).toBe(false);
      expect(validateJLPTLevel('N0')).toBe(false);
      expect(validateJLPTLevel('A1')).toBe(false);
      expect(validateJLPTLevel('')).toBe(false);
      expect(validateJLPTLevel('n5')).toBe(false);
    });
  });

  describe('validateCEFRLevel', () => {
    it('should return true for valid CEFR levels', () => {
      expect(validateCEFRLevel('A1')).toBe(true);
      expect(validateCEFRLevel('A2')).toBe(true);
      expect(validateCEFRLevel('B1')).toBe(true);
      expect(validateCEFRLevel('B2')).toBe(true);
      expect(validateCEFRLevel('C1')).toBe(true);
      expect(validateCEFRLevel('C2')).toBe(true);
    });

    it('should return false for invalid CEFR levels', () => {
      expect(validateCEFRLevel('A3')).toBe(false);
      expect(validateCEFRLevel('D1')).toBe(false);
      expect(validateCEFRLevel('N5')).toBe(false);
      expect(validateCEFRLevel('')).toBe(false);
      expect(validateCEFRLevel('a1')).toBe(false);
    });
  });
});
