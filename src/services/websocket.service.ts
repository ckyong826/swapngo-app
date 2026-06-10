import { env } from '@/config/env';

export type PriceMap = Record<string, number>;

export interface WsNotification {
  type: string;
  [key: string]: unknown;
}

type PriceListener = (prices: PriceMap) => void;
type NotificationListener = (notification: WsNotification) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private priceListeners = new Set<PriceListener>();
  private notificationListeners = new Set<NotificationListener>();
  private reconnectDelay = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldConnect = false;
  private token = '';

  connect(token: string) {
    this.token = token;
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
          const data = JSON.parse(e.data);
          // Messages with a "type" string field are transaction notifications.
          // All other messages are price broadcasts (Record<string, number>).
          if (data && typeof data.type === 'string') {
            this.notificationListeners.forEach((l) => l(data as WsNotification));
          } else {
            this.priceListeners.forEach((l) => l(data as PriceMap));
          }
        } catch {}
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (this.shouldConnect) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
            this._open(this.token);
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

  /** Subscribe to live price broadcasts. */
  addPriceListener(listener: PriceListener) {
    this.priceListeners.add(listener);
    return () => this.priceListeners.delete(listener);
  }

  /** @deprecated renamed to addPriceListener — kept for backwards compatibility */
  addListener(listener: PriceListener) {
    return this.addPriceListener(listener);
  }

  /** Subscribe to transaction / system notifications from the server. */
  addNotificationListener(listener: NotificationListener) {
    this.notificationListeners.add(listener);
    return () => this.notificationListeners.delete(listener);
  }
}

export const wsService = new WebSocketService();
