import { env } from '@/config/env';

type PriceListener = (prices: Record<string, number>) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners = new Set<PriceListener>();
  private reconnectDelay = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldConnect = false;

  connect(token: string) {
    this.shouldConnect = true;
    this.reconnectDelay = 1000;
    this._open(token);
  }

  private _open(token: string) {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(`${env.WS_URL}/ws/prices?token=${token}`);

      this.ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as Record<string, number>;
          this.listeners.forEach((l) => l(data));
        } catch {}
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (this.shouldConnect) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
            this._open(token);
          }, this.reconnectDelay);
        }
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {}
  }

  disconnect() {
    this.shouldConnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  addListener(listener: PriceListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const wsService = new WebSocketService();
