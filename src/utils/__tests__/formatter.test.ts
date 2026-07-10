import { describe, test, expect } from '@jest/globals';
import { formatNumberString, formatResult, formatExpression } from '../formatter';

describe('Number and Expression Formatter Tests', () => {
  
  describe('formatNumberString', () => {
    test('should format standard numbers with comma grouping and dot decimal', () => {
      expect(formatNumberString('1234567.89', '.', ',')).toBe('1,234,567.89');
    });

    test('should format numbers with dot grouping and comma decimal', () => {
      expect(formatNumberString('1234567.89', ',', '.')).toBe('1.234.567,89');
    });

    test('should format numbers with space grouping', () => {
      expect(formatNumberString('1234567.89', '.', ' ')).toBe('1 234 567.89');
    });

    test('should format numbers with no grouping', () => {
      expect(formatNumberString('1234567.89', '.', 'none')).toBe('1234567.89');
    });

    test('should preserve trailing decimal points during editing', () => {
      expect(formatNumberString('12345.', '.', ',')).toBe('12,345.');
      expect(formatNumberString('12345.', ',', '.')).toBe('12.345,');
    });
  });

  describe('formatResult', () => {
    test('should apply precision limits and strip trailing zeros', () => {
      expect(formatResult(10 / 3, 9, '.', ',')).toBe('3.333333333');
      expect(formatResult(1.2500001, 5, '.', ',')).toBe('1.25');
    });

    test('should format large results using scientific notation', () => {
      expect(formatResult(9.950995e6, 9, '.', ',')).toBe('9,950,995');
      // Extremely large numbers transition to E notation (matching screenshot without + sign)
      expect(formatResult(1.2345e22, 9, '.', ',')).toBe('1.23450 E22');
    });

    test('should handle division by zero or NaN cases gracefully', () => {
      expect(formatResult(NaN, 9, '.', ',')).toBe('Error');
      expect(formatResult(Infinity, 9, '.', ',')).toBe('Error');
    });
  });

  describe('formatExpression', () => {
    test('should format full expressions with nice operator spacing', () => {
      const expr = '12345+678*9%-(12.3/4)';
      const formatted = formatExpression(expr, '.', ',');
      expect(formatted).toBe('12,345 + 678 × 9% − ( 12.3 ÷ 4 )');
    });

    test('should format localized separator expressions correctly', () => {
      const expr = '12345+67.89'; // Internally normalized
      const formatted = formatExpression(expr, ',', '.'); // Displays with European formatting
      expect(formatted).toBe('12.345 + 67,89');
    });
  });
});
