import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useTheme, Button, IconButton } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCalculatorStore } from '../store/calculatorStore';
import { HistoryItemRow } from '../components/HistoryItemRow';

export function HistoryScreen({ navigation }: any) {
  const theme = useTheme();
  
  const history = useCalculatorStore((state) => state.history);
  const restoreCalculation = useCalculatorStore((state) => state.restoreCalculation);
  const deleteHistoryItem = useCalculatorStore((state) => state.deleteHistoryItem);
  const togglePinHistoryItem = useCalculatorStore((state) => state.togglePinHistoryItem);
  const clearHistory = useCalculatorStore((state) => state.clearHistory);
  const settings = useCalculatorStore((state) => state.settings);

  const [searchQuery, setSearchQuery] = useState('');

  const handleRestore = (expression: string) => {
    restoreCalculation(expression);
    navigation.navigate('Calculator'); // Return to main screen on restore
  };

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.expression.toLowerCase().includes(query) ||
      item.result.toLowerCase().includes(query)
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
        <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.outline} style={styles.searchIcon} />
        <TextInput
          placeholder="Search calculations..."
          placeholderTextColor={theme.colors.outline}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.colors.onSurface }]}
        />
        {searchQuery ? (
          <IconButton
            icon="close-circle-outline"
            size={18}
            iconColor={theme.colors.outline}
            onPress={() => setSearchQuery('')}
            style={{ margin: 0 }}
          />
        ) : null}
      </View>

      {/* Header operations */}
      {history.length > 0 && (
        <View style={styles.actionHeader}>
          <Text style={[styles.itemCountText, { color: theme.colors.outline }]}>
            {filteredHistory.length} calculations found
          </Text>
          <Button
            mode="text"
            textColor={theme.colors.error}
            icon="trash-can-outline"
            onPress={clearHistory}
            compact
          >
            Clear All
          </Button>
        </View>
      )}

      {/* List */}
      {filteredHistory.length > 0 ? (
        <View style={{ flex: 1, width: '100%' }}>
          <FlashList
            data={filteredHistory}
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
          <MaterialCommunityIcons name="history" size={64} color={theme.colors.outline} style={{ opacity: 0.5 }} />
          <Text style={[styles.emptyText, { color: theme.colors.outline }]}>
            {searchQuery ? 'No calculations match your search' : 'Your history is empty'}
          </Text>
          {!searchQuery && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Calculator')}
              style={styles.calculatorBtn}
            >
              Go to Calculator
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 48,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  itemCountText: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 68,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  calculatorBtn: {
    borderRadius: 20,
  },
});
