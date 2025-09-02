import { Injectable } from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

import { BehaviorSubject } from 'rxjs';

import { StocksEntity } from '../+state/stocks.models';

@Injectable({
  providedIn: 'root',
})
export class Stocks {
  private readonly _updates$ = new BehaviorSubject<StocksEntity[]>([]);

  private connection: HubConnection | null = null;

  public get updates$() {
    return this._updates$.asObservable();
  }

  public async connect(url = 'http://localhost:32770/stocks') {
    if (this.connection) {
      return;
    }

    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(url, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      this.connection.onclose(async (error?: Error) => {
        const errMsg = error ? String(error) : 'Connection closed';
        this._updates$.error(new Error(errMsg));
        setTimeout(() => void this.reconnect(url), 3000);
      });

      this.connection.on('updateStockPrice', (update: StocksEntity) => {
        const current = [...this._updates$.getValue()];
        const idx = current.findIndex((s) => s.symbol === update.symbol);
        if (idx >= 0) {
          current[idx] = { ...current[idx], ...update };
        } else {
          current.push(update);
        }
        this._updates$.next(current);
      });

      await this.connection.start();
      try {
        const all = await this.connection.invoke<StocksEntity[]>(
          'getAllStocks'
        );
        if (Array.isArray(all)) {
          this._updates$.next(all as StocksEntity[]);
        }
      } catch {
        void 0;
      }
    } catch (startErr) {
      this._updates$.error(startErr ?? new Error('Failed to connect'));
      throw startErr;
    }
  }

  public async disconnect() {
    if (!this.connection) return;
    await this.connection.stop();
    this.connection = null;
    this._updates$.complete();
  }

  private async reconnect(url: string) {
    try {
      await this.connect(url);
    } catch {
      setTimeout(() => void this.reconnect(url), 3000);
    }
  }
}
