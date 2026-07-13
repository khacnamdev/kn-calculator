import React from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { useCalculatorStore } from '../store/calculatorStore';

const FONT_SIZE_STEPS = [16, 20, 24, 28, 32, 36, 40];

export function HistoryFontSizeScreen() {
  const settings = useCalculatorStore((s) => s.settings);
  const updateSettings = useCalculatorStore((s) => s.updateSettings);

  const activeSize = settings.historyFontSize;
  const isElder = settings.elderMode;

  const mockItems = [
    { expr: '20+30=', result: '50' },
    { expr: '100+100=', result: '200' },
    { expr: '100+200+300=', result: '600' },
    { expr: '200×2+200×2=', result: '800' },
    { expr: '400÷2+100=', result: '300' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Dynamic Preview Area */}
      <View style={styles.previewContainer}>
        <View style={styles.previewList}>
          {mockItems.map((item, idx) => (
            <View key={idx} style={styles.previewRow}>
              <Text
                style={[
                  styles.previewText,
                  { fontSize: activeSize },
                  isElder && { fontWeight: 'bold' },
                ]}
                numberOfLines={1}
              >
                <Text style={styles.previewExpr}>{item.expr}</Text>
                <Text style={styles.previewResult}>{item.result}</Text>
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Discrete iOS-style Slider Control */}
      <View style={styles.controlContainer}>
        <Text style={styles.smallA}>A</Text>

        <View style={styles.sliderTrackWrapper}>
          {/* Main Track Line */}
          <View style={styles.trackLine} />

          {/* Steps & Thumb */}
          <View style={styles.ticksContainer}>
            {FONT_SIZE_STEPS.map((size) => {
              const isActive = activeSize === size;
              return (
                <Pressable
                  key={size}
                  onPress={() => updateSettings({ historyFontSize: size })}
                  style={styles.tickPressable}
                  accessibilityRole="button"
                  accessibilityLabel={`Set font size to ${size}`}
                >
                  {isActive ? (
                    <View style={styles.activeThumb} />
                  ) : (
                    <View style={styles.tickDot} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.largeA}>A</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  previewList: {
    gap: 8,
  },
  previewRow: {
    alignItems: 'flex-end',
    width: '100%',
  },
  previewText: {
    textAlign: 'right',
  },
  previewExpr: {
    color: '#888888',
  },
  previewResult: {
    color: '#FFFFFF',
  },

  // Custom Slider Controls
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  smallA: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  largeA: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '400',
  },
  sliderTrackWrapper: {
    flex: 1,
    marginHorizontal: 16,
    height: 40,
    justifyContent: 'center',
  },
  trackLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#38383A',
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tickPressable: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8E8E93',
  },
  activeThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
});
