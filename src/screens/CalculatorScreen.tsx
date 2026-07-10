import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import { Display } from '../components/Display';
import { CalcButton } from '../components/CalcButton';
import { HistoryPanel } from '../components/HistoryPanel';
import { useCalculatorStore } from '../store/calculatorStore';
import { useExternalKeyboard } from '../hooks/useExternalKeyboard';
import { CalcButtonInfo } from '../types/calculator';

export function CalculatorScreen({ navigation }: any) {
  const theme = useTheme();
  
  const pressKey = useCalculatorStore((state) => state.pressKey);
  const deleteLastToken = useCalculatorStore((state) => state.deleteLastToken);
  const clearHistory = useCalculatorStore((state) => state.clearHistory);
  const settings = useCalculatorStore((state) => state.settings);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // External physical keyboard hook
  const { inputRef, focusInput, handleKeyPress, handleTextChange } = useExternalKeyboard();

  const handleButtonPress = (value: string) => {
    if (value === 'settings') {
      navigation.navigate('Settings');
    } else if (value === 'history') {
      setIsHistoryOpen(true);
    } else if (value === 'clear_history') {
      if (settings.vibration) Vibration.vibrate(30);
      clearHistory();
    } else {
      pressKey(value);
    }
  };

  // Helper top bar items: Parentheses & Memory functions
  const UTILITY_BAR: CalcButtonInfo[] = [
    { label: '(', value: '(', type: 'number' },
    { label: ')', value: ')', type: 'number' },
    { label: 'MC', value: 'MC', type: 'memory' },
    { label: 'MR', value: 'MR', type: 'memory' },
    { label: 'MS', value: 'MS', type: 'memory' },
    { label: 'M+', value: 'M+', type: 'memory' },
    { label: 'M-', value: 'M-', type: 'memory' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      {/* Hidden text input for physical keyboard intercept */}
      <TextInput
        ref={inputRef}
        showSoftInputOnFocus={false} // Prevent soft keypad opening
        autoFocus
        style={styles.hiddenInput}
        onKeyPress={handleKeyPress}
        onChangeText={handleTextChange}
        value=""
        blurOnSubmit={false}
      />

      <Pressable style={styles.container} onPress={focusInput}>
        {/* Large screen Display area */}
        <View style={styles.displayWrapper}>
          <Display onSwipeLeft={deleteLastToken} />
        </View>

        {/* Keypad wrapper */}
        <View style={[styles.keypadWrapper, { backgroundColor: (theme.colors as any).keypadBackground }]}>
          {/* Utility Row: Parentheses and Memory operations */}
          <View style={styles.utilityRow}>
            {UTILITY_BAR.map((btn) => (
              <CalcButton
                key={btn.value}
                button={btn}
                onPress={handleButtonPress}
                height={38}
                style={styles.utilityBtn}
              />
            ))}
          </View>

          {/* Main Keypad Grid */}
          <View style={styles.gridRow}>
            {/* Columns 1-4 (Standard Keys) */}
            <View style={styles.keyColumnsWrapper}>
              {/* Row 1 */}
              <View style={styles.row}>
                <CalcButton button={{ label: 'AC', value: 'AC', type: 'clear' }} onPress={handleButtonPress} onLongPress={handleButtonPress} />
                <CalcButton button={{ label: '±', value: '±', type: 'function' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '%', value: '%', type: 'operator' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '⌫', value: 'backspace', type: 'backspace', icon: 'backspace-outline' }} onPress={handleButtonPress} onLongPress={deleteLastToken} />
              </View>

              {/* Row 2 */}
              <View style={styles.row}>
                <CalcButton button={{ label: '7', value: '7', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '8', value: '8', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '9', value: '9', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '÷', value: '/', type: 'operator' }} onPress={handleButtonPress} />
              </View>

              {/* Row 3 */}
              <View style={styles.row}>
                <CalcButton button={{ label: '4', value: '4', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '5', value: '5', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '6', value: '6', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '×', value: '*', type: 'operator' }} onPress={handleButtonPress} />
              </View>

              {/* Row 4 */}
              <View style={styles.row}>
                <CalcButton button={{ label: '1', value: '1', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '2', value: '2', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '3', value: '3', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '−', value: '-', type: 'operator' }} onPress={handleButtonPress} />
              </View>

              {/* Row 5 */}
              <View style={styles.row}>
                <CalcButton button={{ label: '0', value: '0', type: 'number' }} onPress={handleButtonPress} style={{ flex: 2 }} />
                <CalcButton button={{ label: settings.decimalSeparator, value: '.', type: 'number' }} onPress={handleButtonPress} />
                <CalcButton button={{ label: '+', value: '+', type: 'operator' }} onPress={handleButtonPress} />
              </View>
            </View>

            {/* Column 5 (Sidebar Action Panel) */}
            <View style={styles.sidebarColumn}>
              <CalcButton button={{ label: '⚙', value: 'settings', type: 'function', icon: 'cog-outline' }} onPress={handleButtonPress} />
              <CalcButton button={{ label: '🗑', value: 'clear_history', type: 'clear', icon: 'trash-can-outline' }} onPress={handleButtonPress} />
              <CalcButton button={{ label: '📜', value: 'history', type: 'function', icon: 'history' }} onPress={handleButtonPress} />
              
              {/* Tall vertical equal button */}
              <CalcButton
                button={{ label: '=', value: '=', type: 'equals' }}
                onPress={handleButtonPress}
                height={148} // Spans vertically across row 4 and 5
              />
            </View>
          </View>
        </View>
      </Pressable>

      {/* Floating overlay sliding history panel */}
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  displayWrapper: {
    flex: 4,
    justifyContent: 'flex-end',
  },
  keypadWrapper: {
    flex: 6,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  utilityBtn: {
    margin: 3,
    borderRadius: 12,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  keyColumnsWrapper: {
    flex: 4,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarColumn: {
    flex: 1,
    flexDirection: 'column',
  },
});
