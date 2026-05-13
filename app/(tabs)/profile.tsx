import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth.store';
import { useWallet } from '@/hooks/useWallet';
import { Modal } from '@/components/common/Modal';
import { QRDisplay } from '@/components/qr/QRDisplay';
import { COLORS } from '@/utils/constants';
import { truncateSuiAddress } from '@/utils/sui';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface MenuItem {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const { logout } = useAuthStore();
  const { data: wallet } = useWallet();
  const [showQR, setShowQR] = useState(false);

  const address = wallet?.sui_address ?? '';

  const confirmLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems: MenuItem[] = [
    { icon: 'qr-code-outline', label: 'My QR Code', onPress: () => setShowQR(true) },
    { icon: 'copy-outline', label: 'Copy Wallet Address', onPress: () => {} },
    { icon: 'shield-checkmark-outline', label: 'Security', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Support', onPress: () => {} },
    { icon: 'log-out-outline', label: 'Sign Out', onPress: confirmLogout, danger: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={COLORS.purple} />
          </View>
          <Text style={styles.email}>{wallet ? 'user@swapngo.com' : '...'}</Text>
          <TouchableOpacity
            style={styles.addressBadge}
            onPress={() => setShowQR(true)}
          >
            <Ionicons name="wallet-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text style={styles.addressText}>{truncateSuiAddress(address)}</Text>
            <Ionicons name="qr-code-outline" size={13} color={COLORS.purpleLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Network" value="SUI Testnet" />
          <View style={styles.statDivider} />
          <StatBox label="Wallet" value="Custodial" />
          <View style={styles.statDivider} />
          <StatBox label="Status" value="Active" color={COLORS.success} />
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, idx) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                <View style={[styles.menuIconWrap, item.danger && styles.menuIconDanger]}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.danger ? COLORS.error : COLORS.purple}
                  />
                </View>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
                {!item.danger && (
                  <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
                )}
              </TouchableOpacity>
              {idx < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>

        <Text style={styles.version}>Swap N Go v1.0.0 · SUI Blockchain</Text>
      </ScrollView>

      <Modal visible={showQR} onClose={() => setShowQR(false)} title="My QR Code">
        {address ? (
          <QRDisplay address={address} onClose={() => setShowQR(false)} />
        ) : null}
      </Modal>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  scroll: { padding: 20, gap: 20 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.black },
  avatarCard: {
    alignItems: 'center',
    backgroundColor: COLORS.purpleDark,
    borderRadius: 24,
    padding: 28,
    gap: 10,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.purpleDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  email: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  addressText: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    padding: 16,
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 14, fontWeight: '700', color: COLORS.black },
  statLabel: { fontSize: 11, color: COLORS.gray },
  statDivider: { width: 1, height: 32, backgroundColor: COLORS.grayBorder },
  menu: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.purpleDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: { backgroundColor: '#fee2e2' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.black },
  menuLabelDanger: { color: COLORS.error },
  menuDivider: { height: 1, backgroundColor: COLORS.grayBorder, marginHorizontal: 16 },
  version: { fontSize: 12, color: COLORS.gray, textAlign: 'center', paddingBottom: 8 },
});
