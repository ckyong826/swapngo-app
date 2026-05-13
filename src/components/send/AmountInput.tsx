import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Input } from '@/components/common/Input';
import { COLORS, TOKENS, TOKEN_COLORS } from '@/utils/constants';
import { TokenSymbol } from '@/types/wallet.types';

interface Props {
  amount: string;
  onAmountChange: (v: string) => void;
  token: TokenSymbol;
  onTokenChange: (t: TokenSymbol) => void;
  amountError?: string;
}

export function AmountInput({ amount, onAmountChange, token, onTokenChange, amountError }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tokenScroll}>
        <View style={styles.tokenRow}>
          {TOKENS.map((t) => {
            const color = TOKEN_COLORS[t] ?? COLORS.purple;
            const active = t === token;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => onTokenChange(t)}
                style={[styles.tokenChip, active && styles.tokenChipActive]}
              >
                <View style={[styles.tokenDot, { backgroundColor: color + '25' }]}>
                  <Text style={[styles.tokenDotText, { color }]}>{t.slice(0, 3)}</Text>
                </View>
                <Text style={[styles.tokenLabel, active && styles.tokenLabelActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <Input
        label="Amount"
        placeholder="0.00"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="decimal-pad"
        error={amountError}
        rightElement={<Text style={styles.symbol}>{token}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  tokenScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  tokenRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  tokenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    backgroundColor: COLORS.white,
  },
  tokenChipActive: {
    backgroundColor: COLORS.purpleDim,
    borderColor: COLORS.purple,
  },
  tokenDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  tokenDotText: { fontSize: 8, fontWeight: '800' },
  tokenLabel: { fontSize: 13, fontWeight: '600', color: COLORS.gray },
  tokenLabelActive: { color: COLORS.purple },
  symbol: { fontSize: 14, fontWeight: '700', color: COLORS.gray },
});
