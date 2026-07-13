export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isPinned: boolean;
}

export interface Settings {
  precision: number;
  decimalSeparator: '.' | ',';
  groupingSeparator: ',' | '.' | ' ' | 'none';
  theme: 'light' | 'dark' | 'system';
  vibration: boolean;
  sound: boolean;
  autoSaveHistory: boolean;
  historyLimit: number;
  language: 'en' | 'vi';
  elderMode: boolean;
  historyFontSize: number;
  resultFontSize: number;
  expressionFontSize: number;
}

export interface CalculatorState {
  expression: string;
  result: string;
  history: HistoryItem[];
  settings: Settings;
  memory: number;
}

export type CalcButtonType = 
  | 'number' 
  | 'operator' 
  | 'function' 
  | 'memory' 
  | 'equals' 
  | 'backspace' 
  | 'clear';

export interface CalcButtonInfo {
  label: string;
  value: string;
  type: CalcButtonType;
  icon?: string; // Icon name if applicable
}
