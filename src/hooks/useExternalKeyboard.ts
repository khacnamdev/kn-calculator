import { useRef, useCallback } from 'react';
import { TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useCalculatorStore } from '../store/calculatorStore';

export function useExternalKeyboard() {
  const pressKey = useCalculatorStore((state) => state.pressKey);
  const inputRef = useRef<TextInput>(null);

  // Focus the input to capture external keyboard events
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle special keys (Backspace, Enter, Escape, etc.)
  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = e.nativeEvent.key;
      
      switch (key) {
        case 'Backspace':
          pressKey('backspace');
          break;
        case 'Enter':
          pressKey('=');
          break;
        case 'Escape':
        case 'Delete':
          pressKey('AC');
          break;
        default:
          // Other keys will be handled by onChangeText to support different keyboard layouts
          break;
      }
    },
    [pressKey]
  );

  // Handle text characters (numbers, basic operators, decimals)
  const handleTextChange = useCallback(
    (text: string) => {
      if (!text) return;

      // Handle typed characters one by one
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (/[0-9]/.test(char)) {
          pressKey(char);
        } else if (char === '+' || char === '-' || char === '*' || char === '/' || char === '%') {
          // Normalize multiply and divide symbols
          const normalizedMap: Record<string, string> = {
            '*': '*',
            '/': '/',
          };
          pressKey(normalizedMap[char] || char);
        } else if (char === '.' || char === ',') {
          // Map both dot and comma to dot internally (handling localized keyboard layouts)
          pressKey('.');
        } else if (char === '(' || char === ')') {
          pressKey(char);
        } else if (char === '=') {
          pressKey('=');
        } else if (char.toLowerCase() === 'c') {
          pressKey('AC');
        }
      }

      // Immediately clear the input so we are ready to receive the next characters
      if (inputRef.current) {
        inputRef.current.clear();
      }
    },
    [pressKey]
  );

  return {
    inputRef,
    focusInput,
    handleKeyPress,
    handleTextChange,
  };
}
