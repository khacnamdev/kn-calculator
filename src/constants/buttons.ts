import { CalcButtonInfo } from '../types/calculator';

export const MEMORY_BUTTONS: CalcButtonInfo[] = [
  { label: 'MC', value: 'MC', type: 'memory' },
  { label: 'MR', value: 'MR', type: 'memory' },
  { label: 'MS', value: 'MS', type: 'memory' },
  { label: 'M+', value: 'M+', type: 'memory' },
  { label: 'M-', value: 'M-', type: 'memory' },
];

export const KEYPAD_LAYOUT: CalcButtonInfo[][] = [
  [
    { label: 'AC', value: 'AC', type: 'clear' },
    { label: '±', value: '±', type: 'function' },
    { label: '%', value: '%', type: 'operator' },
    { label: '⌫', value: 'backspace', type: 'backspace', icon: 'backspace-outline' },
    { label: '⚙', value: 'settings', type: 'function', icon: 'cog-outline' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '÷', value: '/', type: 'operator' },
    { label: '🗑', value: 'clear_history', type: 'clear', icon: 'trash-can-outline' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
    { label: '📜', value: 'history', type: 'function', icon: 'history' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '−', value: '-', type: 'operator' },
    { label: '=', value: '=', type: 'equals' }, // Spans 2 rows vertically
  ],
  [
    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: '(', value: '(', type: 'number' },
    { label: ')', value: ')', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
  ],
];
