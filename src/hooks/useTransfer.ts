import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { transferApi, transferKeys } from '@/api/transfer.api';
import { useUIStore } from '@/stores/ui.store';
import { FsmStatus } from '@/types/fsm.types';

const TERMINAL: FsmStatus[] = ['completed', 'failed'];

export function useInitiateTransfer() {
  const showToast = useUIStore((s) => s.showToast);

  return useMutation({
    mutationFn: transferApi.initiate,
    onSuccess: (data) => {
      router.push(`/transaction/${data.id}?type=transfer`);
    },
    onError: (err: { message: string }) => {
      showToast(err.message, 'error');
    },
  });
}

export function useTransferStatus(id: string) {
  return useQuery({
    queryKey: transferKeys.status(id),
    queryFn: () => transferApi.getStatus(id),
    enabled: !!id,
    refetchInterval: (query) =>
      TERMINAL.includes(query.state.data?.status as FsmStatus) ? false : 2000,
  });
}

export function useTransferHistory() {
  return useQuery({
    queryKey: transferKeys.list(),
    queryFn: transferApi.getHistory,
  });
}
