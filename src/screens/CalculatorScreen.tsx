import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Vibration,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCalculatorStore } from '../store/calculatorStore';
import { useExternalKeyboard } from '../hooks/useExternalKeyboard';
import { formatExpression } from '../utils/formatter';
import { HistoryItem } from '../types/calculator';
import { useTranslation } from '../i18n/useTranslation';

// ── iOS-style colour palette (always dark) ───────────────────────────────────
const C = {
  bg: '#000000',
  historyExpr: '#888888',   // dimmed expression text
  historyResult: '#FFFFFF', // bright result text
  currentExpr: '#888888',   // secondary expression above big number
  currentResult: '#FFFFFF', // big number
  // button backgrounds
  funcBg: '#A5A5A5',        // AC / ± / %
  opBg: '#FF9F0A',          // ÷ × − + =
  numBg: '#333333',         // digits, ⌫, ⊞, 🗑, ≡
  // button text
  funcText: '#000000',
  opText: '#FFFFFF',
  numText: '#FFFFFF',
};

// ─────────────────────────────────────────────────────────────────────────────

function HistoryRow({ item, fontSize, isElder }: { item: HistoryItem; fontSize?: number; isElder?: boolean }) {
  const expr = item.expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−').replace(/\+/g, '+');
  const size = fontSize || 20;
  return (
    <View style={styles.historyRow}>
      <Text
        style={[
          styles.historyText,
          { fontSize: size },
          isElder && { fontWeight: 'bold' }
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        <Text style={[styles.historyExpr, isElder && { fontWeight: 'bold' }]}>{expr}=</Text>
        <Text style={[styles.historyResultText, isElder && { fontWeight: 'bold' }]}>{item.result}</Text>
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function CalculatorScreen({ navigation }: any) {
  const pressKey = useCalculatorStore((s) => s.pressKey);
  const deleteLastToken = useCalculatorStore((s) => s.deleteLastToken);
  const clearHistory = useCalculatorStore((s) => s.clearHistory);
  const expression = useCalculatorStore((s) => s.expression);
  const result = useCalculatorStore((s) => s.result);
  const history = useCalculatorStore((s) => s.history);
  const settings = useCalculatorStore((s) => s.settings);
  const t = useTranslation();

  const scrollRef = useRef<ScrollView>(null);
  const { inputRef, focusInput, handleKeyPress, handleTextChange } = useExternalKeyboard();

  // Auto-scroll history to bottom (newest at bottom)
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [history.length]);

  const handleButtonPress = (value: string) => {
    if (value === 'settings') {
      navigation.navigate('Settings');
    } else if (value === 'clear_history') {
      if (settings.vibration) Vibration.vibrate(30);
      clearHistory();
    } else {
      pressKey(value);
    }
  };

  const formattedExpression = formatExpression(
    expression,
    settings.decimalSeparator,
    settings.groupingSeparator,
  );

  // Display: if result is finalised show expression dimmed + big result,
  //          else show big expression + small live result.
  const showBig = result || formattedExpression || '0';
  const showSmall = result ? formattedExpression : '';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Hidden keyboard intercept input */}
      <TextInput
        ref={inputRef}
        showSoftInputOnFocus={false}
        autoFocus
        style={styles.hidden}
        onKeyPress={handleKeyPress}
        onChangeText={handleTextChange}
        value=""
        blurOnSubmit={false}
      />

      <Pressable style={styles.root} onPress={focusInput}>

        {/* ── HISTORY AREA (unscrolled vs scrollable) ── */}
        {settings.elderMode ? (
          <View style={[styles.historyScroll, { justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 8 }]}>
            {history.length === 0 ? (
              <Text style={[styles.historyEmpty, { fontSize: settings.historyFontSize }]}>{t.historyEmpty}</Text>
            ) : (
              history.slice(0, 2).reverse().map((item) => (
                <HistoryRow key={item.id} item={item} fontSize={settings.historyFontSize} isElder />
              ))
            )}
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.historyScroll}
            contentContainerStyle={styles.historyContent}
            showsVerticalScrollIndicator={false}
          >
            {history.length === 0 ? (
              <Text style={styles.historyEmpty}>{t.historyEmpty}</Text>
            ) : (
              [...history].reverse().map((item) => (
                <HistoryRow
                  key={item.id}
                  item={item}
                  fontSize={settings.historyFontSize}
                  isElder={false}
                />
              ))
            )}
          </ScrollView>
        )}

        {/* ── CURRENT DISPLAY ── */}
        <View style={styles.displayArea}>
          <Text
            style={[
              styles.displayResult,
              {
                fontSize: !result ? (settings.elderMode ? 72 : 50) : (settings.elderMode ? 48 : 36),
                fontWeight: 'bold',
                color: '#FFFFFF',
                lineHeight: !result ? (settings.elderMode ? 80 : 58) : (settings.elderMode ? 56 : 42),
              }
            ]}
            numberOfLines={!result ? 5 : 1}
            adjustsFontSizeToFit
            minimumFontScale={!result ? (settings.elderMode ? 52 / 72 : 40 / 50) : undefined}
          >
            {showBig}
          </Text>
          {showSmall ? (
            <Text
              style={[
                styles.displayExpr,
                {
                  fontSize: settings.elderMode ? 72 : 50,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  lineHeight: settings.elderMode ? 80 : 58,
                }
              ]}
              numberOfLines={5}
              adjustsFontSizeToFit
              minimumFontScale={settings.elderMode ? 52 / 72 : 40 / 50}
            >
              {showSmall}
            </Text>
          ) : null}
        </View>

        {/* ── KEYPAD ── */}
        <View style={styles.keypad}>

          {/* Row 1 */}
          <View style={styles.row}>
            <IosButton label="AC"  bg={C.funcBg} fg={C.funcText} onPress={() => handleButtonPress('AC')} />
            <IosButton label="+/-" bg={C.funcBg} fg={C.funcText} onPress={() => handleButtonPress('±')} />
            <IosButton label="%"   bg={C.funcBg} fg={C.funcText} onPress={() => handleButtonPress('%')} />
            <IosButton label="←"  bg={C.numBg}  fg={C.numText}  onPress={() => handleButtonPress('backspace')}
              onLongPress={() => deleteLastToken()} icon="backspace-outline" />
            <IosButton label="⊞"  bg={C.numBg}  fg={C.numText}  onPress={() => navigation.navigate('Settings')}
              icon="dots-grid" />
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <IosButton label="7" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('7')} />
            <IosButton label="8" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('8')} />
            <IosButton label="9" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('9')} />
            <IosButton label="÷" bg={C.opBg}  fg={C.opText}  onPress={() => handleButtonPress('/')} />
            <IosButton label="🗑" bg={C.numBg} fg={C.numText}  onPress={() => handleButtonPress('clear_history')}
              icon="trash-can-outline" />
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <IosButton label="4" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('4')} />
            <IosButton label="5" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('5')} />
            <IosButton label="6" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('6')} />
            <IosButton label="×" bg={C.opBg}  fg={C.opText}  onPress={() => handleButtonPress('*')} />
            <IosButton label="≡" bg={C.numBg} fg={C.numText}  onPress={() => navigation.navigate('Settings')}
              icon="format-list-bulleted" />
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <IosButton label="1" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('1')} />
            <IosButton label="2" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('2')} />
            <IosButton label="3" bg={C.numBg} fg={C.numText} onPress={() => handleButtonPress('3')} />
            <IosButton label="−" bg={C.opBg}  fg={C.opText}  onPress={() => handleButtonPress('-')} />
            {/* Equals spans rows 4–5 */}
            <IosButton label="=" bg={C.opBg} fg={C.opText} onPress={() => handleButtonPress('=')} tall />
          </View>

          {/* Row 5 */}
          <View style={styles.row}>
            <IosButton label="0"                              bg={C.numBg} fg={C.numText}
              onPress={() => handleButtonPress('0')} wide />
            <IosButton label={settings.decimalSeparator}     bg={C.numBg} fg={C.numText}
              onPress={() => handleButtonPress('.')} />
            <IosButton label="+"                             bg={C.opBg}  fg={C.opText}
              onPress={() => handleButtonPress('+')} />
            {/* Spacer for the tall = button above */}
            <View style={styles.btnSpacer} />
          </View>

        </View>
      </Pressable>
    </SafeAreaView>
  );
}

// ── Standalone iOS-style circular button ─────────────────────────────────────

interface IosButtonProps {
  label: string;
  bg: string;
  fg: string;
  onPress: () => void;
  onLongPress?: () => void;
  icon?: string;
  wide?: boolean;   // double-width (the 0 button)
  tall?: boolean;   // double-height (the = button)
}

function IosButton({ label, bg, fg, onPress, onLongPress, icon, wide, tall }: IosButtonProps) {
  const settings = useCalculatorStore((s) => s.settings);
  const isElder = settings.elderMode;
  const buttonFontSize = isElder ? 36 : 32;
  const iconSize = isElder ? 30 : 28;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.btn,
        wide  && styles.btnWide,
        tall  && styles.btnTall,
        { backgroundColor: bg, opacity: pressed ? 0.75 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon as any}
          size={iconSize}
          color={fg}
        />
      ) : (
        <Text
          style={[
            styles.btnText,
            { color: fg, fontSize: buttonFontSize, fontWeight: 'bold' }
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const BTN_SIZE = (Dimensions.get('window').width - 16 * 2 - 8 * 4) / 5; // 5 cols

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  hidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  root: {
    flex: 1,
  },

  // ── History ──────────────────────────────────────────────
  historyScroll: {
    flex: 1,
  },
  historyContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  historyEmpty: {
    color: '#444',
    textAlign: 'right',
    fontSize: 16,
    paddingVertical: 8,
  },
  historyRow: {
    paddingVertical: 3,
  },
  historyText: {
    textAlign: 'right',
    fontSize: 20,
  },
  historyExpr: {
    color: C.historyExpr,
    fontWeight: '300',
  },
  historyResultText: {
    color: C.historyResult,
    fontWeight: '500',
  },

  // ── Current display ──────────────────────────────────────
  displayArea: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  displayExpr: {
    color: C.currentExpr,
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'right',
  },
  displayResult: {
    color: C.currentResult,
    fontSize: 80,
    fontWeight: '200',
    textAlign: 'right',
    lineHeight: 88,
  },

  // ── Keypad ───────────────────────────────────────────────
  keypad: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    height: BTN_SIZE,
  },

  // ── Individual buttons ───────────────────────────────────
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWide: {
    width: BTN_SIZE * 2 + 8,
    borderRadius: BTN_SIZE / 2,
    alignItems: 'flex-start',
    paddingLeft: BTN_SIZE * 0.38,
  },
  btnTall: {
    height: BTN_SIZE * 2 + 8,
    borderRadius: BTN_SIZE / 2,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  btnSpacer: {
    width: BTN_SIZE,
  },
  btnText: {
    fontSize: 28,
    fontWeight: '400',
  },
});
