import { describe, test, expect, beforeEach } from '@jest/globals';
import { Parser } from '../Parser';

describe('Mathematical Expression Parser Tests', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  test('should evaluate basic addition and subtraction', () => {
    const result = parser.parse('15 + 25 - 10');
    expect(result.success).toBe(true);
    expect(result.value).toBe(30);
  });

  test('should respect operator precedence (multiplication before addition)', () => {
    const result = parser.parse('5 + 3 * 4');
    expect(result.success).toBe(true);
    expect(result.value).toBe(17);
  });

  test('should respect parentheses grouping', () => {
    const result = parser.parse('(5 + 3) * 4');
    expect(result.success).toBe(true);
    expect(result.value).toBe(32);
  });

  test('should support decimal digits', () => {
    const result = parser.parse('1.5 * 3 + 2.25');
    expect(result.success).toBe(true);
    expect(result.value).toBe(6.75);
  });

  test('should support unary negative values', () => {
    const result = parser.parse('-5 * -3');
    expect(result.success).toBe(true);
    expect(result.value).toBe(15);
  });

  test('should support standard display symbols', () => {
    // Normalizes × to * and ÷ to /
    const result = parser.parse('10 × 5 ÷ 2');
    expect(result.success).toBe(true);
    expect(result.value).toBe(25);
  });

  test('should evaluate postfix percentages', () => {
    const result = parser.parse('50%');
    expect(result.success).toBe(true);
    expect(result.value).toBe(0.5);
  });

  test('should evaluate multiplication with percentage', () => {
    const result = parser.parse('200 * 5%');
    expect(result.success).toBe(true);
    expect(result.value).toBe(10);
  });

  test('should evaluate addition/subtraction with context percentage', () => {
    // A + B% => A + A * (B/100)
    // 200 + 5% => 200 + 200 * 0.05 => 210
    const addResult = parser.parse('200 + 5%');
    expect(addResult.success).toBe(true);
    expect(addResult.value).toBe(210);

    // 150 - 10% => 150 - 15 => 135
    const subResult = parser.parse('150 - 10%');
    expect(subResult.success).toBe(true);
    expect(subResult.value).toBe(135);
  });

  test('should auto-close parentheses', () => {
    const result = parser.parse('(5 + (3 * 2');
    expect(result.success).toBe(true);
    expect(result.value).toBe(11); // Evaluated as (5 + (3 * 2))
  });

  test('should strip trailing invalid operator for live result parsing', () => {
    const result = parser.parse('125 + 38 *');
    expect(result.success).toBe(true);
    expect(result.value).toBe(163); // Evaluated as 125 + 38
  });

  test('should handle division by zero errors', () => {
    const result = parser.parse('10 / 0');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Division by zero');
  });

  test('should support localized separators', () => {
    // Parses comma as decimal and dot as grouping
    const result = parser.parse('1.000 + 50,5', ',', '.');
    expect(result.success).toBe(true);
    expect(result.value).toBe(1050.5);
  });
});
