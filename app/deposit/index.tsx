import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { depositSchema, DepositFormData } from '@/utils/validation';
import { useInitiateDeposit } from '@/hooks/useDeposit';
import { COLORS } from '@/utils/constants';

export default function DepositScreen() {
  const { mutate: initiate, isPending } = useInitiateDeposit();

  const { control, handleSubmit, formState: { errors } } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  const onSubmit = ({ amount_myr }: DepositFormData) => {
    initiate({ amount_myr: Number(amount_myr) });
  };

  const presets = [50, 100, 200, 500];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>⬇️</Text>
            </View>
            <Text style={styles.title}>Deposit MYRC</Text>
            <Text style={styles.subtitle}>
              Pay via Billplz. MYRC is minted to your SUI wallet on confirmation.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Quick amounts</Text>
            <View style={styles.presetRow}>
              {presets.map((p) => (
                <View key={p} style={styles.presetChip}>
                  <Text style={styles.presetText}>RM {p}</Text>
                </View>
              ))}
            </View>

            <Controller
              control={control}
              name="amount_myr"
              render={({ field }) => (
                <Input
                  label="Amount (MYR)"
                  placeholder="Minimum RM 10"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="decimal-pad"
                  error={errors.amount_myr?.message}
                  rightElement={<Text style={styles.myrLabel}>MYR</Text>}
                />
              )}
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Powered by Billplz — secure Malaysian payment gateway</Text>
              <Text style={styles.infoText}>MYRC is 1:1 pegged to MYR, settled on SUI blockchain</Text>
            </View>

            <Button
              title="Proceed to Payment"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: 20, gap: 20 },
  back: { alignSelf: 'flex-start', paddingVertical: 4 },
  backText: { fontSize: 15, fontWeight: '600', color: COLORS.gray },
  header: { alignItems: 'center', gap: 8 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.black },
  subtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    gap: 16,
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: COLORS.gray },
  presetRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.green,
    borderRadius: 20,
  },
  presetText: { fontSize: 13, fontWeight: '600', color: COLORS.black },
  myrLabel: { fontSize: 14, fontWeight: '700', color: COLORS.gray },
  infoBox: { gap: 6 },
  infoText: { fontSize: 13, color: COLORS.gray, lineHeight: 18 },
});
