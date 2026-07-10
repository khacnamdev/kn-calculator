import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme, Card, Switch, SegmentedButtons, IconButton } from 'react-native-paper';

import { useCalculatorStore } from '../store/calculatorStore';
import { Settings } from '../types/calculator';

export function SettingsScreen() {
  const theme = useTheme();
  
  const settings = useCalculatorStore((state) => state.settings);
  const updateSettings = useCalculatorStore((state) => state.updateSettings);

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    updateSettings({ [key]: value });
  };

  const adjustPrecision = (amount: number) => {
    const nextPrecision = Math.max(4, Math.min(15, settings.precision + amount));
    handleSettingChange('precision', nextPrecision);
  };

  const adjustHistoryLimit = (amount: number) => {
    const nextLimit = Math.max(10, Math.min(500, settings.historyLimit + amount));
    handleSettingChange('historyLimit', nextLimit);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        
        {/* Theme Settings Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>Appearance</Text>
            
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Theme Mode</Text>
              <SegmentedButtons
                value={settings.theme}
                onValueChange={(val) => handleSettingChange('theme', val as any)}
                buttons={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Formatting Settings Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>Separators & Formatting</Text>
            
            {/* Decimal Separator */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Decimal Separator</Text>
              <SegmentedButtons
                value={settings.decimalSeparator}
                onValueChange={(val) => {
                  const newDec = val as '.' | ',';
                  // To avoid conflict, swap grouping separator if it matches
                  let newGroup = settings.groupingSeparator;
                  if (newDec === '.' && settings.groupingSeparator === '.') {
                    newGroup = ',';
                  } else if (newDec === ',' && settings.groupingSeparator === ',') {
                    newGroup = '.';
                  }
                  updateSettings({ decimalSeparator: newDec, groupingSeparator: newGroup });
                }}
                buttons={[
                  { value: '.', label: 'Dot (.)' },
                  { value: ',', label: 'Comma (,)' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>

            {/* Grouping Separator */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Thousands Separator</Text>
              <SegmentedButtons
                value={settings.groupingSeparator}
                onValueChange={(val) => {
                  const newGroup = val as ',' | '.' | ' ' | 'none';
                  // To avoid conflict, swap decimal separator if it matches
                  let newDec = settings.decimalSeparator;
                  if (newGroup === '.' && settings.decimalSeparator === '.') {
                    newDec = ',';
                  } else if (newGroup === ',' && settings.decimalSeparator === ',') {
                    newDec = '.';
                  }
                  updateSettings({ decimalSeparator: newDec, groupingSeparator: newGroup });
                }}
                buttons={[
                  { value: ',', label: 'Comma' },
                  { value: '.', label: 'Dot' },
                  { value: ' ', label: 'Space' },
                  { value: 'none', label: 'None' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>

            {/* Precision Digits */}
            <View style={styles.counterSettingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Decimal Precision</Text>
              <View style={styles.counterContainer}>
                <IconButton
                  icon="minus-circle-outline"
                  size={24}
                  iconColor={theme.colors.primary}
                  disabled={settings.precision <= 4}
                  onPress={() => adjustPrecision(-1)}
                />
                <Text style={[styles.counterValue, { color: theme.colors.onSurface }]}>
                  {settings.precision} digits
                </Text>
                <IconButton
                  icon="plus-circle-outline"
                  size={24}
                  iconColor={theme.colors.primary}
                  disabled={settings.precision >= 15}
                  onPress={() => adjustPrecision(1)}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* History Configuration Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>History Settings</Text>

            {/* Auto Save Toggle */}
            <View style={styles.rowSettingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Auto-Save Calculations</Text>
              <Switch
                value={settings.autoSaveHistory}
                onValueChange={(val) => handleSettingChange('autoSaveHistory', val)}
                color={theme.colors.primary}
              />
            </View>

            {/* History Limit */}
            <View style={styles.counterSettingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>History Limit</Text>
              <View style={styles.counterContainer}>
                <IconButton
                  icon="minus-circle-outline"
                  size={24}
                  iconColor={theme.colors.primary}
                  disabled={settings.historyLimit <= 10}
                  onPress={() => adjustHistoryLimit(-10)}
                />
                <Text style={[styles.counterValue, { color: theme.colors.onSurface }]}>
                  {settings.historyLimit} items
                </Text>
                <IconButton
                  icon="plus-circle-outline"
                  size={24}
                  iconColor={theme.colors.primary}
                  disabled={settings.historyLimit >= 500}
                  onPress={() => adjustHistoryLimit(10)}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Device Feedback Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>Keypad Feedback</Text>

            {/* Vibration Toggle */}
            <View style={styles.rowSettingItem}>
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Vibrate on Keypress</Text>
              <Switch
                value={settings.vibration}
                onValueChange={(val) => handleSettingChange('vibration', val)}
                color={theme.colors.primary}
              />
            </View>

            {/* Sound Feedback (Placeholder toggle) */}
            <View style={styles.rowSettingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>Audible Key Clicks</Text>
                <Text style={[styles.settingSublabel, { color: theme.colors.outline }]}>
                  Uses default system click sound
                </Text>
              </View>
              <Switch
                value={settings.sound}
                onValueChange={(val) => handleSettingChange('sound', val)}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  rowSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  counterSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  settingSublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  segmentedButtons: {
    width: '100%',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
});
