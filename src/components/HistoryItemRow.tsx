import React from 'react';
import { StyleSheet, Text, View, Pressable, Clipboard, ToastAndroid, Platform } from 'react-native';
import { Card, useTheme, IconButton } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { HistoryItem } from '../types/calculator';
import { formatExpression } from '../utils/formatter';

interface HistoryItemRowProps {
  item: HistoryItem;
  onRestore: (expression: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  decimalSeparator: '.' | ',';
  groupingSeparator: ',' | '.' | ' ' | 'none';
}

export function HistoryItemRow({
  item,
  onRestore,
  onDelete,
  onTogglePin,
  decimalSeparator,
  groupingSeparator,
}: HistoryItemRowProps) {
  const theme = useTheme();
  
  const formattedExpr = formatExpression(item.expression, decimalSeparator, groupingSeparator);

  // Copy expression to clipboard
  const copyExpression = () => {
    Clipboard.setString(item.expression);
    notify('Expression copied!');
  };

  // Copy result to clipboard
  const copyResult = () => {
    Clipboard.setString(item.result);
    notify('Result copied!');
  };

  const notify = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  // Render the delete action on the right swipe
  const renderRightActions = () => {
    return (
      <Pressable
        onPress={() => onDelete(item.id)}
        style={[styles.deleteAction, { backgroundColor: theme.colors.error }]}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={26} color="#FFF" />
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  // Format timestamp (e.g. 17:15)
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2}>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => onRestore(item.expression)}
      >
        <Card.Content style={styles.cardContent}>
          {/* Pin Button */}
          <IconButton
            icon={item.isPinned ? 'star' : 'star-outline'}
            iconColor={item.isPinned ? '#FFB300' : theme.colors.outline}
            size={22}
            style={styles.actionButton}
            onPress={() => onTogglePin(item.id)}
            accessibilityLabel={item.isPinned ? 'Unpin calculation' : 'Pin calculation'}
          />

          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text numberOfLines={2} style={[styles.expressionText, { color: theme.colors.onSurfaceVariant }]}>
              {formattedExpr}
            </Text>
            <Text numberOfLines={1} style={[styles.resultText, { color: theme.colors.onSurface }]}>
              = {item.result}
            </Text>
            <Text style={[styles.timeText, { color: theme.colors.outline }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>

          {/* Copy and Actions buttons */}
          <View style={styles.actionsContainer}>
            <IconButton
              icon="content-copy"
              size={20}
              iconColor={theme.colors.primary}
              style={styles.actionButton}
              onPress={copyExpression}
              accessibilityLabel="Copy formula expression"
            />
            <IconButton
              icon="equal"
              size={20}
              iconColor={theme.colors.secondary}
              style={styles.actionButton}
              onPress={copyResult}
              accessibilityLabel="Copy calculation result"
            />
          </View>
        </Card.Content>
      </Card>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 16,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  expressionText: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 2,
  },
  resultText: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    margin: 0,
  },
  deleteAction: {
    width: 90,
    height: '84%',
    marginTop: 6,
    marginBottom: 6,
    marginRight: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
