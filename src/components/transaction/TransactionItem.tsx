import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TransactionRecord } from '@/types/transaction.types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { COLORS } from '@/utils/constants';
import { formatCrypto, formatRelativeTime } from '@/utils/format';

const TYPE_ICONS: Record<string, string> = {
  transfer: '↗️',
  swap: '🔄',
  deposit: '⬇️',
  withdrawal: '⬆️',
};

const TYPE_LABELS: Record<string, string> = {
  transfer: 'Send',
  swap: 'Swap',
  deposit: 'Deposit',
  withdrawal: 'Withdraw',
};

interface Props {
  item: TransactionRecord;
}

export function TransactionItem({ item }: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/transaction/${item.id}?type=${item.type}`)}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{TYPE_ICONS[item.type]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.type}>{TYPE_LABELS[item.type]}</Text>
        <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatCrypto(item.amount, item.token)}</Text>
        <StatusBadge status={item.status} size="sm" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 18 },
  info: { flex: 1 },
  type: { fontSize: 15, fontWeight: '600', color: COLORS.black },
  time: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { fontSize: 14, fontWeight: '600', color: COLORS.black },
});
