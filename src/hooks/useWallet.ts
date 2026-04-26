import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/api/wallet.api';
import { usePriceSocket } from './usePriceSocket';
import { WalletInfo } from '@/types/wallet.types';

export function useWallet() {
  const { prices } = usePriceSocket();

  const query = useQuery({
    queryKey: ['wallet'],
    queryFn: walletApi.getWallet,
    staleTime: 30_000,
  });

  const walletWithPrices: WalletInfo | undefined = query.data
    ? {
        ...query.data,
        balances: query.data.balances.map((b) => ({
          ...b,
          value_myr: (prices[b.token] ?? 0) * b.amount,
        })),
        total_value_myr: query.data.balances.reduce(
          (sum, b) => sum + (prices[b.token] ?? 0) * b.amount,
          0
        ),
      }
    : undefined;

  return { ...query, data: walletWithPrices, prices };
}
