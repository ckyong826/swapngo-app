import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Input } from '@/components/common/Input';
import { COLORS } from '@/utils/constants';

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function RecipientInput({ value, onChange, error }: Props) {
  return (
    <View style={styles.container}>
      <Input
        label="Recipient"
        placeholder="Username, phone, or SUI address"
        value={value}
        onChangeText={onChange}
        error={error}
        rightElement={
          <TouchableOpacity
            onPress={() => router.push('/scan')}
            style={styles.scanBtn}
          >
            <Ionicons name="qr-code-outline" size={20} color={COLORS.purple} />
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0 },
  scanBtn: {
    padding: 4,
    backgroundColor: COLORS.green,
    borderRadius: 8,
  },
});
