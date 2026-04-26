import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { depositApi, depositKeys } from '@/api/deposit.api';
import { useUIStore } from '@/stores/ui.store';
import { FsmStatus } from '@/types/fsm.types';

const TERMINAL: FsmStatus[] = ['completed', 'failed'];

export function useInitiateDeposit() {
  const showToast = useUIStore((s) => s.showToast);

  return useMutation({
    mutationFn: depositApi.initiate,
    onSuccess: async (data) => {
      await WebBrowser.openBrowserAsync(data.billplz_payment_url);
      router.push(`/deposit/status?id=${data.id}`);
    },
    onError: (err: { message: string }) => {
      showToast(err.message, 'error');
    },
  });
}

export function useDepositStatus(id: string) {
  return useQuery({
    queryKey: depositKeys.status(id),
    queryFn: () => depositApi.getStatus(id),
    enabled: !!id,
    refetchInterval: (query) =>
      TERMINAL.includes(query.state.data?.status as FsmStatus) ? false : 2000,
  });
}

export function useDepositHistory() {
  return useQuery({
    queryKey: depositKeys.all,
    queryFn: depositApi.getHistory,
  });
}
