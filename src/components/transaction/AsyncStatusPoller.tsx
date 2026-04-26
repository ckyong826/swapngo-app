import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FsmStatus } from '@/types/fsm.types';
import { COLORS } from '@/utils/constants';
import { suiExplorerTxUrl } from '@/utils/sui';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/utils/format';

interface Props {
  status?: FsmStatus;
  suiTxHash?: string;
  errorMessage?: string;
  createdAt?: string;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function AsyncStatusPoller({
  status,
  suiTxHash,
  errorMessage,
  createdAt,
  isLoading,
  onRetry,
}: Props) {
  if (isLoading || !status) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.black} />
        <Text style={styles.loadingText}>Loading status...</Text>
      </View>
    );
  }

  if (status === 'pending' || status === 'processing') {
    return (
      <View style={styles.center}>
        <View style={styles.pulseCircle}>
          <ActivityIndicator size="large" color={COLORS.black} />
        </View>
        <StatusBadge status={status} />
        <Text style={styles.title}>Processing on SUI Blockchain</Text>
        <Text style={styles.subtitle}>
          Your transaction is being confirmed. This usually takes 2–10 seconds.
        </Text>
        {createdAt ? (
          <Text style={styles.time}>Submitted {formatDate(createdAt)}</Text>
        ) : null}
      </View>
    );
  }

  if (status === 'completed') {
    return (
      <View style={styles.center}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <StatusBadge status="completed" />
        <Text style={styles.title}>Transaction Complete</Text>
        {suiTxHash ? (
          <TouchableOpacity
            style={styles.hashRow}
            onPress={() => Linking.openURL(suiExplorerTxUrl(suiTxHash))}
          >
            <Text style={styles.hashLabel}>SUI TX</Text>
            <Text style={styles.hash} numberOfLines={1}>
              {suiTxHash.slice(0, 20)}...
            </Text>
            <Text style={styles.openLink}>↗</Text>
          </TouchableOpacity>
        ) : null}
        {createdAt ? (
          <Text style={styles.time}>{formatDate(createdAt)}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <View style={styles.errorCircle}>
        <Text style={styles.errorIcon}>✕</Text>
      </View>
      <StatusBadge status="failed" />
      <Text style={styles.title}>Transaction Failed</Text>
      {errorMessage ? (
        <Text style={styles.errorMsg}>{errorMessage}</Text>
      ) : null}
      {onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  successIcon: { fontSize: 36, color: '#065f46', fontWeight: '700' },
  errorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorIcon: { fontSize: 36, color: '#991b1b', fontWeight: '700' },
  loadingText: { fontSize: 14, color: COLORS.gray },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.black, textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  time: { fontSize: 12, color: COLORS.gray },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    maxWidth: '90%',
  },
  hashLabel: { fontSize: 12, fontWeight: '700', color: COLORS.black },
  hash: { flex: 1, fontSize: 12, color: '#374151', fontFamily: 'monospace' },
  openLink: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  errorMsg: {
    fontSize: 13,
    color: COLORS.error,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: { fontSize: 15, fontWeight: '600', color: COLORS.black },
});
