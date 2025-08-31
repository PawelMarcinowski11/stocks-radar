import { createAction, props } from '@ngrx/store';
import { StocksEntity } from './stocks.models';

export const connectStocks = createAction('[Stocks WS] Connect');

export const stocksReceived = createAction(
  '[Stocks WS] Stocks Received',
  props<{ stocks: StocksEntity[] }>()
);

export const stocksConnectionError = createAction(
  '[Stocks WS] Connection Error',
  props<{ error: unknown }>()
);

export const stocksConnected = createAction('[Stocks WS] Connected');
export const stocksDisconnected = createAction('[Stocks WS] Disconnected');
