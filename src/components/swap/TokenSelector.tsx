import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TOKENS, TOKEN_COLORS } from '@/utils/constants';
import { TokenSymbol } from '@/types/wallet.types';

interface Props {
  label: string;
  value: TokenSymbol;
  onChange: (t: TokenSymbol) => void;
  exclude?: TokenSymbol;
}

function TokenBadge({ token, size = 32 }: { token: TokenSymbol; size?: number }) {
  const color = TOKEN_COLORS[token] ?? COLORS.purple;
  return (
    <View style={[styles.tokenBadge, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '18' }]}>
      <Text style={[styles.tokenBadgeText, { color, fontSize: size * 0.33 }]}>{token.slice(0, 3)}</Text>
    </View>
  );
}

export function TokenSelector({ label, value, onChange, exclude }: Props) {
  const [open, setOpen] = useState(false);
  const options = TOKENS.filter((t) => t !== exclude);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setOpen(true)}>
          <TokenBadge token={value} size={34} />
          <Text style={styles.symbol}>{value}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
        <SafeAreaView style={styles.sheet}>
          <Text style={styles.sheetTitle}>Select Token</Text>
          <FlatList
            data={options}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item === value && styles.optionActive]}
                onPress={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <TokenBadge token={item} size={38} />
                <Text style={styles.optionText}>{item}</Text>
                {item === value && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.purple} />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.black },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  tokenBadge: { justifyContent: 'center', alignItems: 'center' },
  tokenBadgeText: { fontWeight: '800', letterSpacing: 0.2 },
  symbol: { flex: 1, fontSize: 16, fontWeight: '700', color: COLORS.black },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  optionActive: { backgroundColor: COLORS.purpleDim },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.black },
});
