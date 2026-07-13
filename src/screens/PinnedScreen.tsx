import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCalculatorStore } from '../store/calculatorStore';
import { HistoryItemRow } from '../components/HistoryItemRow';

export function PinnedScreen({ navigation }: any) {
  const theme = useTheme();
  
  const history = useCalculatorStore((state) => state.history);
  const restoreCalculation = useCalculatorStore((state) => state.restoreCalculation);
  const deleteHistoryItem = useCalculatorStore((state) => state.deleteHistoryItem);
  const togglePinHistoryItem = useCalculatorStore((state) => state.togglePinHistoryItem);
  const settings = useCalculatorStore((state) => state.settings);

  // Filter only pinned history items
  const pinnedHistory = history.filter((item) => item.isPinned);

  const handleRestore = (expression: string) => {
    restoreCalculation(expression);
    navigation.navigate('Calculator');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {pinnedHistory.length > 0 ? (
        <View style={{ flex: 1, width: '100%', paddingTop: 12 }}>
          <FlashList
            data={pinnedHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HistoryItemRow
                item={item}
                onRestore={handleRestore}
                onDelete={deleteHistoryItem}
                onTogglePin={togglePinHistoryItem}
                decimalSeparator={settings.decimalSeparator}
                groupingSeparator={settings.groupingSeparator}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="star-outline" size={64} color={theme.colors.outline} style={{ opacity: 0.5 }} />
          <Text style={[styles.emptyText, { color: theme.colors.outline }]}>
            No pinned calculations yet.{'\n'}Star calculations in the history log to pin them here for quick reuse.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('History')}
            style={styles.historyBtn}
          >
            Open History
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 68,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  historyBtn: {
    borderRadius: 20,
  },
});
