import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/utils/constants';
import { formatMYR } from '@/utils/format';
import { Skeleton } from '@/components/common/Skeleton';

interface Props {
  totalMYR: number;
  suiAddress: string;
  loading?: boolean;
  onReceive?: () => void;
}

export function BalanceCard({ totalMYR, suiAddress, loading, onReceive }: Props) {
  const short = suiAddress
    ? `${suiAddress.slice(0, 6)}...${suiAddress.slice(-4)}`
    : '';

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Portfolio</Text>
      {loading ? (
        <>
          <Skeleton width={180} height={40} borderRadius={10} style={{ marginVertical: 8 }} />
          <Skeleton width={120} height={14} borderRadius={7} />
        </>
      ) : (
        <>
          <Text style={styles.amount}>{formatMYR(totalMYR)}</Text>
          <TouchableOpacity onPress={onReceive} style={styles.addressRow}>
            <Text style={styles.address}>{short}</Text>
            <Text style={styles.receiveTag}>Receive</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.green,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
  },
  label: { fontSize: 13, color: '#4b5563', fontWeight: '500', marginBottom: 4 },
  amount: { fontSize: 36, fontWeight: '800', color: COLORS.black, letterSpacing: -1 },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  address: { fontSize: 13, color: '#374151', fontFamily: 'monospace' },
  receiveTag: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});
