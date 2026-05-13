import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TransactionRecord } from '@/types/transaction.types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { COLORS } from '@/utils/constants';
import { formatCrypto, formatRelativeTime } from '@/utils/format';

type IoniconName = keyof typeof Ionicons.glyphMap;

const TYPE_ICONS: Record<string, IoniconName> = {
  transfer: 'arrow-up-outline',
  swap: 'swap-horizontal-outline',
  deposit: 'arrow-down-outline',
  withdrawal: 'arrow-up-circle-outline',
};

const TYPE_BG: Record<string, string> = {
  transfer: COLORS.purpleDim,
  swap: COLORS.purpleDim,
  deposit: '#D1FAE5',
  withdrawal: '#FEF3C7',
};

const TYPE_ICON_COLOR: Record<string, string> = {
  transfer: COLORS.purple,
  swap: COLORS.purple,
  deposit: '#059669',
  withdrawal: '#D97706',
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
  const iconName = TYPE_ICONS[item.type] ?? 'ellipse-outline';
  const bg = TYPE_BG[item.type] ?? COLORS.purpleDim;
  const iconColor = TYPE_ICON_COLOR[item.type] ?? COLORS.purple;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/transaction/${item.id}?type=${item.type}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: bg }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.type}>{TYPE_LABELS[item.type] ?? item.type}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1 },
  type: { fontSize: 15, fontWeight: '600', color: COLORS.black },
  time: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { fontSize: 14, fontWeight: '600', color: COLORS.black },
});
