import { AppState } from 'react-native';
import { env } from '@/config/env';

export type PriceMap = Record<string, number>;

export interface WsNotification {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

type PriceListener = (prices: PriceMap) => void;
type NotificationListener = (notification: WsNotification) => void;
type ReconnectListener = () => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private priceListeners = new Set<PriceListener>();
  private notificationListeners = new Set<NotificationListener>();
  private reconnectListeners = new Set<ReconnectListener>();
  private reconnectDelay = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldConnect = false;
  private hasEverConnected = false;
  private token = '';

  constructor() {
    AppState.addEventListener('change', (state) => {
      if (state === 'active' && this.shouldConnect && !this.ws) {
        this._open(this.token);
      }
    });
  }

  connect(token: string) {
    this.token = token;
    this.shouldConnect = true;
    this.reconnectDelay = 1000;
    this.hasEverConnected = false;
    this._open(token);
  }

  private _open(token: string) {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(`${env.WS_URL}/ws/prices?token=${token}`);

      this.ws.onopen = () => {
        if (this.hasEverConnected) {
          this.reconnectListeners.forEach((l) => l());
        }
        this.hasEverConnected = true;
      };

      this.ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          // Every message is enveloped as { type, data, timestamp }.
          // PRICE_UPDATE carries the price map in `data`; everything else is a notification.
          if (!msg || typeof msg.type !== 'string') return;
          if (msg.type === 'PRICE_UPDATE') {
            this.priceListeners.forEach((l) => l(msg.data as PriceMap));
          } else {
            this.notificationListeners.forEach((l) => l(msg as WsNotification));
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
    return () => { this.priceListeners.delete(listener); };
  }

  /** @deprecated renamed to addPriceListener — kept for backwards compatibility */
  addListener(listener: PriceListener) {
    return this.addPriceListener(listener);
  }

  /** Subscribe to transaction / system notifications from the server. */
  addNotificationListener(listener: NotificationListener) {
    this.notificationListeners.add(listener);
    return () => { this.notificationListeners.delete(listener); };
  }

  /** Subscribe to reconnect events (fires on every successful open after the first). */
  addReconnectListener(listener: ReconnectListener) {
    this.reconnectListeners.add(listener);
    return () => { this.reconnectListeners.delete(listener); };
  }
}

export const wsService = new WebSocketService();
