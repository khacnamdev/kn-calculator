import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, TextInput } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCalculatorStore } from '../store/calculatorStore';
import { HistoryItemRow } from './HistoryItemRow';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH * 0.85; // Slide drawer spans 85% of screen width

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const theme = useTheme();
  
  const history = useCalculatorStore((state) => state.history);
  const restoreCalculation = useCalculatorStore((state) => state.restoreCalculation);
  const deleteHistoryItem = useCalculatorStore((state) => state.deleteHistoryItem);
  const togglePinHistoryItem = useCalculatorStore((state) => state.togglePinHistoryItem);
  const clearHistory = useCalculatorStore((state) => state.clearHistory);
  const settings = useCalculatorStore((state) => state.settings);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Shared animation values
  const translateX = useSharedValue(SCREEN_WIDTH);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      // Slide in panel
      translateX.value = withSpring(0, { damping: 20, stiffness: 120 });
      opacity.value = withTiming(0.4, { duration: 250 });
    } else {
      // Slide out panel
      translateX.value = withSpring(SCREEN_WIDTH, { damping: 20, stiffness: 120 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen, opacity, translateX]);

  const closePanel = () => {
    onClose();
  };

  // Filter history based on search query
  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.expression.toLowerCase().includes(query) ||
      item.result.toLowerCase().includes(query)
    );
  });

  const handleRestore = (expr: string) => {
    restoreCalculation(expr);
    closePanel(); // Auto-close drawer on restore
  };

  // Animated styles
  const panelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!isOpen && translateX.value === SCREEN_WIDTH) {
    return null; // Don't render overlay structure when completely closed
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop Background */}
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={styles.backdropPressable} onPress={closePanel} />
      </Animated.View>

      {/* Floating sliding history list */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: theme.colors.background,
            borderLeftColor: theme.colors.surfaceVariant,
          },
          panelAnimatedStyle,
        ]}
      >
        {/* Header bar */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>History</Text>
          <View style={styles.headerActions}>
            {history.length > 0 && (
              <IconButton
                icon="trash-can-outline"
                iconColor={theme.colors.error}
                size={22}
                onPress={clearHistory}
                accessibilityLabel="Clear all history"
              />
            )}
            <IconButton
              icon="close"
              iconColor={theme.colors.onBackground}
              size={24}
              onPress={closePanel}
              accessibilityLabel="Close history panel"
            />
          </View>
        </View>

        {/* Search Input bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.outline} style={styles.searchIcon} />
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
              style={{ margin: 0 }}
              onPress={() => setSearchQuery('')}
            />
          ) : null}
        </View>

        {/* Scrollable list */}
        {filteredHistory.length > 0 ? (
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
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={48} color={theme.colors.outline} />
            <Text style={[styles.emptyText, { color: theme.colors.outline }]}>
              {searchQuery ? 'No matching history found' : 'No calculations yet'}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  backdropPressable: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: PANEL_WIDTH,
    borderLeftWidth: 1,
    paddingTop: 45, // Account for status bar
    shadowColor: '#000',
    shadowOffset: { width: -3, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});
