export const env = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.160.44.123:8080',
  WS_URL: process.env.EXPO_PUBLIC_WS_URL ?? 'ws://10.160.44.123:8080',
  SUI_EXPLORER_URL: process.env.EXPO_PUBLIC_SUI_EXPLORER_URL ?? 'https://suiexplorer.com',
  ENV: process.env.EXPO_PUBLIC_ENV ?? 'development',
} as const;
