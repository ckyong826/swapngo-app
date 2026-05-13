import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TokenBalance } from '@/types/wallet.types';
import { TOKEN_COLORS, COLORS } from '@/utils/constants';
import { formatCrypto, formatMYR } from '@/utils/format';

interface Props {
  item: TokenBalance;
}

export function AssetRow({ item }: Props) {
  const color = TOKEN_COLORS[item.token] ?? COLORS.purple;
  const label = item.token.slice(0, 3);

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: color + '18' }]}>
        <Text style={[styles.iconText, { color }]}>{label}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.symbol}>{item.token}</Text>
        <Text style={styles.amount}>{formatCrypto(item.amount, item.token)}</Text>
      </View>
      <View style={styles.valueCol}>
        <Text style={styles.myr}>{formatMYR(item.value_myr ?? 0)}</Text>
      </View>
    </View>
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
  iconText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.2 },
  info: { flex: 1 },
  symbol: { fontSize: 15, fontWeight: '700', color: COLORS.black },
  amount: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  valueCol: { alignItems: 'flex-end' },
  myr: { fontSize: 15, fontWeight: '600', color: COLORS.black },
});
