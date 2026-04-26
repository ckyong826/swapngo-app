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
import { COLORS, TOKENS, TOKEN_ICONS } from '@/utils/constants';
import { TokenSymbol } from '@/types/wallet.types';

interface Props {
  label: string;
  value: TokenSymbol;
  onChange: (t: TokenSymbol) => void;
  exclude?: TokenSymbol;
}

export function TokenSelector({ label, value, onChange, exclude }: Props) {
  const [open, setOpen] = useState(false);
  const options = TOKENS.filter((t) => t !== exclude);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setOpen(true)}>
          <Text style={styles.icon}>{TOKEN_ICONS[value]}</Text>
          <Text style={styles.symbol}>{value}</Text>
          <Text style={styles.chevron}>▼</Text>
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
                <Text style={styles.optionIcon}>{TOKEN_ICONS[item]}</Text>
                <Text style={styles.optionText}>{item}</Text>
                {item === value && <Text style={styles.check}>✓</Text>}
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
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  icon: { fontSize: 22 },
  symbol: { flex: 1, fontSize: 16, fontWeight: '700', color: COLORS.black },
  chevron: { fontSize: 12, color: COLORS.gray },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  optionActive: { backgroundColor: COLORS.green },
  optionIcon: { fontSize: 22 },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.black },
  check: { fontSize: 16, color: COLORS.black, fontWeight: '700' },
});
