/**
 * Safe Mathematical Expression Parser
 * Implements a recursive descent parser to evaluate mathematical expressions.
 * Does not use eval() or Function() for security.
 */

export interface ParserResult {
  success: boolean;
  value: number;
  error?: string;
}

interface ExpressionResult {
  value: number;
  isPercentage: boolean;
}

export class Parser {
  private tokens: string[] = [];
  private index = 0;

  /**
   * Tokenizes an expression string.
   */
  private tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    const len = expression.length;

    while (i < len) {
      const char = expression[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Operators and Parentheses
      if ('+-*/%()'.indexOf(char) !== -1) {
        tokens.push(char);
        i++;
        continue;
      }

      // Numbers (integers and decimals)
      if (/[0-9.]/.test(char)) {
        let numStr = '';
        while (i < len && /[0-9.]/.test(expression[i])) {
          // If we hit a second decimal point in the same number, we stop or raise an error.
          // The tokenizer will split it, and the parser will fail gracefully.
          if (expression[i] === '.' && numStr.includes('.')) {
            break;
          }
          numStr += expression[i];
          i++;
        }
        tokens.push(numStr);
        continue;
      }

      // Unknown character, skip it or let parser fail
      i++;
    }

    return tokens;
  }

  /**
   * Auto-completes brackets and removes trailing operators for live-result safety.
   */
  public static sanitize(expression: string): string {
    let sanitized = expression.trim();

    if (!sanitized) return '';

    // Normalize operator symbols
    sanitized = sanitized
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // 1. Remove trailing operators that don't make sense at the end
    // Keep trailing percentage '%' since it is a postfix operator.
    while (sanitized.length > 0 && '+-*/'.indexOf(sanitized[sanitized.length - 1]) !== -1) {
      sanitized = sanitized.slice(0, -1).trim();
    }

    // 2. Count and close unclosed parentheses
    let openCount = 0;
    let closeCount = 0;
    for (let i = 0; i < sanitized.length; i++) {
      if (sanitized[i] === '(') openCount++;
      if (sanitized[i] === ')') closeCount++;
    }

    if (openCount > closeCount) {
      sanitized += ')'.repeat(openCount - closeCount);
    }

    return sanitized;
  }

  /**
   * Pre-processes expression string to handle localization.
   */
  public static normalize(
    expression: string,
    decimalSeparator: '.' | ',',
    groupingSeparator: ',' | '.' | ' ' | 'none'
  ): string {
    let normalized = expression.trim();

    // 1. Remove grouping separators
    if (groupingSeparator && groupingSeparator !== 'none') {
      const escapedGroup = groupingSeparator.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      normalized = normalized.replace(new RegExp(escapedGroup, 'g'), '');
    }

    // 2. Convert decimal separator to standard '.'
    if (decimalSeparator === ',') {
      normalized = normalized.replace(/,/g, '.');
    }

    // 3. Translate display operators to standard math operators
    normalized = normalized
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    return normalized;
  }

  /**
   * Main entry point to parse and evaluate an expression.
   */
  public parse(
    expression: string,
    decimalSeparator: '.' | ',' = '.',
    groupingSeparator: ',' | '.' | ' ' | 'none' = ','
  ): ParserResult {
    try {
      const normalized = Parser.normalize(expression, decimalSeparator, groupingSeparator);
      const sanitized = Parser.sanitize(normalized);

      if (!sanitized) {
        return { success: true, value: 0 };
      }

      this.tokens = this.tokenize(sanitized);
      this.index = 0;

      const result = this.parseExpression();

      // Check if all tokens were consumed
      if (this.index < this.tokens.length) {
        return { success: false, value: 0, error: 'Unexpected token: ' + this.tokens[this.index] };
      }

      return {
        success: true,
        value: Number.isNaN(result.value) ? 0 : result.value,
      };
    } catch (error: any) {
      return {
        success: false,
        value: 0,
        error: error.message || 'Parsing error',
      };
    }
  }

  // Grammar: expression -> term (( "+" | "-" ) term)*
  private parseExpression(): ExpressionResult {
    let result = this.parseTerm();

    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (token === '+' || token === '-') {
        this.index++;
        const op = token;
        const right = this.parseTerm();

        if (right.isPercentage) {
          // Context-aware percentage: A + B% => A + (A * B%) => A + A * (B/100)
          // Since B% is already divided by 100 in parsePostfix, right.value is B / 100.
          // So we scale it as: val + val * right.value
          const scale = result.value * right.value;
          result = {
            value: op === '+' ? result.value + scale : result.value - scale,
            isPercentage: false,
          };
        } else {
          result = {
            value: op === '+' ? result.value + right.value : result.value - right.value,
            isPercentage: false,
          };
        }
      } else {
        break;
      }
    }

    return result;
  }

  // Grammar: term -> factor (( "*" | "/" ) factor)*
  private parseTerm(): ExpressionResult {
    let result = this.parseFactor();

    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (token === '*' || token === '/') {
        this.index++;
        const op = token;
        const right = this.parseFactor();

        if (op === '*') {
          result = {
            value: result.value * right.value,
            isPercentage: false,
          };
        } else {
          if (right.value === 0) {
            throw new Error('Division by zero');
          }
          result = {
            value: result.value / right.value,
            isPercentage: false,
          };
        }
      } else {
        break;
      }
    }

    return result;
  }

  // Grammar: factor -> unary
  private parseFactor(): ExpressionResult {
    return this.parseUnary();
  }

  // Grammar: unary -> "-" unary | "+" unary | postfix
  private parseUnary(): ExpressionResult {
    if (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (token === '-') {
        this.index++;
        const val = this.parseUnary();
        return {
          value: -val.value,
          isPercentage: val.isPercentage,
        };
      }
      if (token === '+') {
        this.index++;
        return this.parseUnary();
      }
    }
    return this.parsePostfix();
  }

  // Grammar: postfix -> primary "%"?
  private parsePostfix(): ExpressionResult {
    const primary = this.parsePrimary();

    if (this.index < this.tokens.length && this.tokens[this.index] === '%') {
      this.index++;
      return {
        value: primary.value / 100,
        isPercentage: true,
      };
    }

    return primary;
  }

  // Grammar: primary -> number | "(" expression ")"
  private parsePrimary(): ExpressionResult {
    if (this.index >= this.tokens.length) {
      throw new Error('Unexpected end of expression');
    }

    const token = this.tokens[this.index];

    if (token === '(') {
      this.index++; // consume '('
      const result = this.parseExpression();
      if (this.index >= this.tokens.length || this.tokens[this.index] !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      this.index++; // consume ')'
      return {
        value: result.value,
        isPercentage: false, // Reset percentage state outside parentheses
      };
    }

    // Validate if it is a number
    const num = Number(token);
    if (Number.isNaN(num)) {
      throw new Error(`Invalid token: ${token}`);
    }

    this.index++; // consume number
    return {
      value: num,
      isPercentage: false,
    };
  }
}
