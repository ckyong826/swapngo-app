export interface AppError {
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
}

export interface TransferInitiateRequest {
  recipient: string;
  token: string;
  amount: number;
}

export interface TransferRecord {
  id: string;
  status: string;
  recipient: string;
  token: string;
  amount: number;
  sui_tx_hash?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DepositInitiateRequest {
  amount_myr: number;
}

export interface DepositRecord {
  id: string;
  status: string;
  amount_myr: number;
  myrc_minted?: number;
  billplz_payment_url?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface WithdrawInitiateRequest {
  destination_type: 'bank' | 'sui_wallet';
  destination_details: Record<string, string>;
  token: string;
  amount: number;
}

export interface WithdrawRecord {
  id: string;
  status: string;
  token: string;
  amount: number;
  sui_tx_hash?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}
