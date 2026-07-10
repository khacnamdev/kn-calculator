import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { formatExpression } from '../utils/formatter';
import { useCalculatorStore } from '../store/calculatorStore';

interface DisplayProps {
  onSwipeLeft: () => void;
}

export function Display({ onSwipeLeft }: DisplayProps) {
  const theme = useTheme();
  const expression = useCalculatorStore((state) => state.expression);
  const result = useCalculatorStore((state) => state.result);
  const settings = useCalculatorStore((state) => state.settings);

  // Swipe gesture detection (left swipe triggers token deletion)
  const panGesture = Gesture.Pan()
    .activeOffsetX(-30) // Require minimum horizontal drag to trigger
    .failOffsetY([-15, 15]) // Avoid triggering swipe when scrolling vertically
    .onEnd((event) => {
      if (event.translationX < -50) {
        runOnJS(onSwipeLeft)();
      }
    });

  const formattedExpression = formatExpression(
    expression,
    settings.decimalSeparator,
    settings.groupingSeparator
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Scrollable/Shrinkable Expression Display */}
        <View style={styles.expressionContainer}>
          <Text
            selectable
            numberOfLines={4}
            adjustsFontSizeToFit
            style={[styles.expressionText, { color: theme.colors.onBackground }]}
            accessibilityLabel={`Expression: ${formattedExpression}`}
          >
            {formattedExpression || '0'}
          </Text>
        </View>

        {/* Live Result Display */}
        <View style={styles.resultContainer}>
          {result ? (
            <Text
              selectable
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.resultText, { color: theme.colors.primary }]}
              accessibilityLabel={`Live Result: ${result}`}
            >
              {result}
            </Text>
          ) : null}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  expressionContainer: {
    width: '100%',
    maxHeight: '75%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  expressionText: {
    fontSize: 54, // Large bold display for current formula
    fontWeight: '300',
    textAlign: 'right',
    letterSpacing: -1,
  },
  resultContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  resultText: {
    fontSize: 32, // Smaller, clear display for result
    fontWeight: '400',
    opacity: 0.85,
  },
});
