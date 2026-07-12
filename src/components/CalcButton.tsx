import React from 'react';
import { StyleSheet, Text, Pressable, Vibration, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CalcButtonInfo } from '../types/calculator';
import { useCalculatorStore } from '../store/calculatorStore';

interface CalcButtonProps {
  button: CalcButtonInfo;
  onPress: (value: string) => void;
  onLongPress?: (value: string) => void;
  style?: any;
  height?: number; // Optional for spanning height
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CalcButton({
  button,
  onPress,
  onLongPress,
  style,
  height,
}: CalcButtonProps) {
  const theme: any = useTheme();
  const settings = useCalculatorStore((state) => state.settings);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 10, stiffness: 200 });
  };

  const handlePress = () => {
    // Apply haptic feedback
    if (settings.vibration) {
      if (Platform.OS === 'android') {
        Vibration.vibrate(12); // Short vibration for Android key click
      } else {
        Vibration.vibrate(10); // Standard vibration for iOS
      }
    }
    
    onPress(button.value);
  };

  const handleLongPress = () => {
    if (onLongPress) {
      if (settings.vibration) {
        Vibration.vibrate(40); // Slightly longer vibration for long press
      }
      onLongPress(button.value);
    }
  };

  // Resolve color scheme according to MD3 and custom definitions
  let backgroundColor = theme.colors.surface;
  let textColor = theme.colors.onSurface;

  switch (button.type) {
    case 'number':
      backgroundColor = theme.colors.numberButton;
      textColor = theme.colors.onNumberButton;
      break;
    case 'operator':
      backgroundColor = theme.colors.operatorButton;
      textColor = theme.colors.onOperatorButton;
      break;
    case 'equals':
      backgroundColor = theme.colors.equalsButton;
      textColor = theme.colors.onEqualsButton;
      break;
    case 'function':
      backgroundColor = theme.colors.functionButton;
      textColor = theme.colors.onFunctionButton;
      break;
    case 'clear':
      backgroundColor = theme.colors.errorContainer;
      textColor = theme.colors.onErrorContainer;
      break;
    case 'backspace':
      backgroundColor = theme.colors.functionButton;
      textColor = theme.colors.onFunctionButton;
      break;
    case 'memory':
      backgroundColor = theme.colors.memoryButton;
      textColor = theme.colors.onMemoryButton;
      break;
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
      android_ripple={{
        color: theme.colors.surfaceVariant,
        borderless: false,
      }}
      style={[
        styles.button,
        {
          backgroundColor,
          height: height || 68,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={button.label}
    >
      {button.icon ? (
        <MaterialCommunityIcons
          name={button.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={24}
          color={textColor}
        />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>
          {button.label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 6,
    borderRadius: 24, // Rounded cards matching Material 3
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1, // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    overflow: 'hidden', // Ensures ripple effect is clipped
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
  },
});
