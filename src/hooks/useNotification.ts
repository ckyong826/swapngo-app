import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsService, WsNotification } from '@/services/websocket.service';
import { useUIStore } from '@/stores/ui.store';
import { kycKeys } from '@/hooks/useKYC';

// Maps backend notification type strings to user-friendly messages.
const MESSAGES: Record<string, (n: WsNotification) => string> = {
  SWAP_COMPLETED: (n) => `Swap completed! You received ${n.actual_amount ?? ''} ${n.to_token ?? ''}.`,
  SWAP_FAILED: () => 'Swap failed. Please try again.',
  DEPOSIT_COMPLETED: (n) => `Deposit of ${n.amount ?? ''} MYRC confirmed.`,
  DEPOSIT_FAILED: () => 'Deposit failed. Please contact support.',
  WITHDRAW_COMPLETED: (n) => `Withdrawal of ${n.amount ?? ''} MYR processed.`,
  WITHDRAW_FAILED: () => 'Withdrawal failed. Please contact support.',
  TRANSFER_COMPLETED: (n) => `Transfer of ${n.amount ?? ''} MYRC sent successfully.`,
  TRANSFER_FAILED: () => 'Transfer failed. Please try again.',
  KYC_APPROVED: () => 'Your KYC has been approved! Full features are now unlocked.',
  KYC_REJECTED: (n) => `Your KYC was rejected. Reason: ${n.remarks ?? 'No reason provided.'}`,
};

/**
 * Listens for server-pushed WebSocket notifications and shows an Alert.
 * Mount this once at the root of the authenticated app (e.g. in the tabs layout).
 *
 * @param onNotification  Optional callback for custom handling (e.g. toast library).
 */
export function useNotification(onNotification?: (n: WsNotification) => void) {
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;
  const showToast = useUIStore((s) => s.showToast);
  const qc = useQueryClient();

  useEffect(() => {
    const unsub = wsService.addNotificationListener((notification) => {
      // Call optional custom handler
      onNotificationRef.current?.(notification);

      const formatter = MESSAGES[notification.type];
      const message = formatter
        ? formatter(notification)
        : `Update: ${notification.type}`;

      const isFailure = notification.type.endsWith('_FAILED') || notification.type === 'KYC_REJECTED';
      showToast(message, isFailure ? 'error' : 'success');

      if (notification.type.endsWith('_COMPLETED')) {
        qc.invalidateQueries({ queryKey: ['wallet'] });
        qc.invalidateQueries({ queryKey: ['transaction-history'] });
      } else if (notification.type.endsWith('_FAILED')) {
        qc.invalidateQueries({ queryKey: ['transaction-history'] });
      } else if (notification.type === 'KYC_APPROVED' || notification.type === 'KYC_REJECTED') {
        qc.invalidateQueries({ queryKey: kycKeys.status });
      }
    });

    return unsub;
  }, [showToast, qc]);
}
