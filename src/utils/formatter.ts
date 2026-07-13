/**
 * Utility for formatting numbers and mathematical expressions
 * according to user-selected locale settings (separators, precision).
 */

/**
 * Formats a raw number string (e.g. '1234567.89' using standard '.' decimal)
 * to a localized display string.
 */
export function formatNumberString(
  numStr: string,
  decimalSeparator: '.' | ',',
  groupingSeparator: ',' | '.' | ' ' | 'none'
): string {
  if (!numStr) return '';

  // Handle scientific notation (e.g. 1.23e+10 or 1.23E-5)
  if (numStr.toLowerCase().includes('e')) {
    const parts = numStr.toLowerCase().split('e');
    const base = formatNumberString(parts[0], decimalSeparator, groupingSeparator);
    const exponent = parts[1];
    return `${base} E${exponent.startsWith('+') ? exponent.slice(1) : exponent}`;
  }

  const parts = numStr.split('.');
  let integerPart = parts[0] || '0';
  const hasDecimal = numStr.includes('.');
  const decimalPart = parts[1] || '';

  // Add grouping separator to integer part
  if (groupingSeparator !== 'none') {
    const isNegative = integerPart.startsWith('-');
    if (isNegative) {
      integerPart = integerPart.slice(1);
    }
    
    // Group by 3 digits
    let grouped = '';
    const len = integerPart.length;
    for (let i = 0; i < len; i++) {
      if (i > 0 && (len - i) % 3 === 0) {
        grouped += groupingSeparator;
      }
      grouped += integerPart[i];
    }
    
    integerPart = isNegative ? `-${grouped}` : grouped;
  }

  // Combine with decimal part
  if (hasDecimal) {
    return `${integerPart}${decimalSeparator}${decimalPart}`;
  }

  return integerPart;
}

/**
 * Formats a final numeric result to a readable string based on precision and locale.
 */
export function formatResult(
  value: number,
  precision: number,
  decimalSeparator: '.' | ',',
  groupingSeparator: ',' | '.' | ' ' | 'none'
): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 'Error';
  }

  // Handle exponential numbers (very large or very small)
  const absValue = Math.abs(value);
  if (absValue > 0 && (absValue >= Math.pow(10, precision) || absValue < Math.pow(10, -4))) {
    // Return standard exponential notation first, then format the base
    const expStr = value.toExponential(precision - 4);
    return formatNumberString(expStr, decimalSeparator, groupingSeparator);
  }

  // Format to fixed precision
  // We use parseFloat to strip trailing zeros after toFixed
  let fixedStr = value.toFixed(precision);
  if (fixedStr.includes('.')) {
    // Remove trailing zeros and trailing dot
    fixedStr = fixedStr.replace(/\.?0+$/, '');
  }

  return formatNumberString(fixedStr, decimalSeparator, groupingSeparator);
}

/**
 * Formats a full expression string for display.
 * Identifies numbers inside the expression and localized operators and replaces them.
 */
export function formatExpression(
  expression: string,
  decimalSeparator: '.' | ',',
  groupingSeparator: ',' | '.' | ' ' | 'none'
): string {
  if (!expression) return '';

  // We tokenize/parse standard number blocks using regex
  // A number block is composed of digits, optionally containing '.'
  // E.g., '12345.67' or '.5'
  const numberRegex = /[0-9]+(?:\.[0-9]*)?|\.[0-9]+/g;

  let formatted = expression.replace(numberRegex, (match) => {
    return formatNumberString(match, decimalSeparator, groupingSeparator);
  });

  // Beautify operator symbols for premium Material 3 aesthetics
  formatted = formatted
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/\+/g, '+')
    .replace(/-/g, '−') // Use proper minus sign '−' instead of hyphen '-'
    .replace(/\s+/g, '') // Collapse all spaces
    .trim();

  // If the expression has parentheses, let's fix spacing
  // e.g., ' ( ' should not have leading/trailing spaces if adjacent to brackets or operators
  // but standard spacing helps readability.
  return formatted;
}
