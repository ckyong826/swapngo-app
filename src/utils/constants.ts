import { TokenSymbol } from '@/types/wallet.types';

export const POLLING_INTERVAL_MS = 2000;

export const TOKENS: TokenSymbol[] = ['MYRC', 'USDT', 'USDC', 'BTC', 'ETH', 'SUI'];

export const TOKEN_ICONS: Record<TokenSymbol, string> = {
  MYRC: '🇲🇾',
  USDT: '💵',
  USDC: '💲',
  BTC: '₿',
  ETH: 'Ξ',
  SUI: '🔵',
};

export const TOKEN_COLORS: Record<TokenSymbol, string> = {
  MYRC: '#e8b4bc',
  USDT: '#26a17b',
  USDC: '#2775ca',
  BTC: '#f7931a',
  ETH: '#627eea',
  SUI: '#6fbcf0',
};

export const COLORS = {
  white: '#ffffff',
  green: '#f2fed0',
  greenDark: '#d4f5a0',
  black: '#0a0a0a',
  gray: '#6b7280',
  grayLight: '#f9fafb',
  grayBorder: '#e5e7eb',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  pending: '#f59e0b',
  processing: '#3b82f6',
};
