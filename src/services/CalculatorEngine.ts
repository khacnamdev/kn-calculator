import { Parser } from './Parser';

/**
 * Handles calculator input mutations and state logic.
 */
export class CalculatorEngine {
  private parser = new Parser();

  /**
   * Appends a character or token to the current expression, enforcing mathematical rules.
   */
  public appendToken(expression: string, input: string): string {
    const lastChar = expression.length > 0 ? expression[expression.length - 1] : '';

    // 1. Handle operators (+, -, *, /)
    if ('+-*/'.includes(input)) {
      if (expression.length === 0) {
        // If expression is empty, allow '-' for negative numbers, or default '+' to '0+'
        if (input === '-') return '-';
        return `0${input}`;
      }

      // If last char is also an operator, check if we replace it or support negative prefix
      if ('+-*/'.includes(lastChar)) {
        // Allow expression like "5 * -" or "5 / -"
        if ((lastChar === '*' || lastChar === '/') && input === '-') {
          return expression + input;
        }
        
        // If the expression ends with "*-" or "/-" and we press another operator, replace both
        if (expression.length > 1 && '+-*/'.includes(expression[expression.length - 2]) && lastChar === '-') {
          return expression.slice(0, -2) + input;
        }

        // Otherwise replace the last operator
        return expression.slice(0, -1) + input;
      }

      // If last char is an open parenthesis, only allow '-'
      if (lastChar === '(') {
        if (input === '-') return expression + input;
        return expression; // Ignore other operators after '('
      }

      return expression + input;
    }

    // 2. Handle percentage '%'
    if (input === '%') {
      if (expression.length === 0 || '+-*/('.includes(lastChar)) {
        return expression; // Percentage cannot follow operators or start the expression
      }
      return expression + '%';
    }

    // 3. Handle decimal point '.'
    if (input === '.') {
      if (expression.length === 0 || '+-*/('.includes(lastChar)) {
        return expression + '0.';
      }
      if (lastChar === ')') {
        return expression + '*0.'; // Implicit multiplication
      }
      
      // Check if the current number already has a decimal point
      // We parse backwards to find the start of the current number
      let i = expression.length - 1;
      let hasDecimal = false;
      while (i >= 0 && /[0-9.]/.test(expression[i])) {
        if (expression[i] === '.') {
          hasDecimal = true;
          break;
        }
        i--;
      }
      
      if (hasDecimal) return expression; // Number already has a decimal
      return expression + '.';
    }

    // 4. Handle Parentheses '(' and ')'
    if (input === '(') {
      if (expression.length === 0) return '(';
      
      // If preceding character is a number, decimal, percentage, or ')', insert implicit multiplication
      if (/[0-9%)]./.test(lastChar)) {
        return expression + '*(';
      }
      return expression + '(';
    }

    if (input === ')') {
      // Only append if there's an unclosed '(' and preceding char is not an operator or '('
      let openParenCount = 0;
      let closeParenCount = 0;
      for (const char of expression) {
        if (char === '(') openParenCount++;
        if (char === ')') closeParenCount++;
      }

      if (openParenCount > closeParenCount && !'+-*/('.includes(lastChar)) {
        return expression + ')';
      }
      return expression;
    }

    // 5. Handle numbers (0-9)
    if (/[0-9]/.test(input)) {
      if (expression === '0') {
        return input; // Replace leading single zero
      }
      // If last char is '%' or ')', insert implicit multiplication
      if (lastChar === '%' || lastChar === ')') {
        return expression + '*' + input;
      }
      return expression + input;
    }

    return expression;
  }

  /**
   * Toggles the sign (negative/positive) of the last number in the expression.
   */
  public toggleNegation(expression: string): string {
    if (expression.length === 0) return '-';

    const lastChar = expression[expression.length - 1];

    // If expression ends in an operator or open bracket, we can just append '-'
    if ('+*/('.includes(lastChar)) {
      return expression + '-';
    }
    if (lastChar === '-') {
      // If it ends with a standalone minus, remove it
      return expression.slice(0, -1);
    }

    // Parse the expression from right to left to locate the last number/parenthesis block
    let i = expression.length - 1;
    
    // Skip trailing percentage if any
    let hasPercentage = false;
    if (expression[i] === '%') {
      hasPercentage = true;
      i--;
    }

    // Find the boundary of the last numeric block
    const numberChars = /[0-9.]/;
    let numStr = '';
    while (i >= 0 && numberChars.test(expression[i])) {
      numStr = expression[i] + numStr;
      i--;
    }

    if (numStr.length > 0) {
      // We found the last number. Now check the character preceding it.
      const prefixIdx = i;
      const prefixChar = prefixIdx >= 0 ? expression[prefixIdx] : '';

      if (prefixChar === '-') {
        // Check if this minus is unary (e.g. after a multiply or at start)
        const beforeMinus = prefixIdx > 0 ? expression[prefixIdx - 1] : '';
        if (prefixIdx === 0 || '+*/('.includes(beforeMinus)) {
          // Unary minus, remove it
          return expression.slice(0, prefixIdx) + numStr + (hasPercentage ? '%' : '');
        } else {
          // Binary minus (e.g. 5 - 3). Swap it to plus: 5 + 3
          return expression.slice(0, prefixIdx) + '+' + numStr + (hasPercentage ? '%' : '');
        }
      } else if (prefixChar === '+') {
        // Swap plus to minus
        return expression.slice(0, prefixIdx) + '-' + numStr + (hasPercentage ? '%' : '');
      } else {
        // No operator immediately prefixing, or operator is '*' or '/'. Insert a unary minus.
        return expression.slice(0, prefixIdx + 1) + '-' + numStr + (hasPercentage ? '%' : '');
      }
    }

    return expression;
  }

  /**
   * Deletes the last logical character.
   */
  public deleteLastChar(expression: string): string {
    if (expression.length === 0) return '';
    return expression.slice(0, -1);
  }

  /**
   * Deletes the last token (operator, parenthesis, or complete number block).
   */
  public deleteLastToken(expression: string): string {
    if (expression.length === 0) return '';

    const lastChar = expression[expression.length - 1];

    // If last char is an operator or bracket, delete just that single character (it is a token)
    if ('+-*/%()'.includes(lastChar)) {
      return expression.slice(0, -1);
    }

    // If it's a number, scan backwards to remove the entire sequence of digits/dots
    let i = expression.length - 1;
    while (i >= 0 && /[0-9.]/.test(expression[i])) {
      i--;
    }

    return expression.slice(0, i + 1);
  }
}
export const engine = new CalculatorEngine();
