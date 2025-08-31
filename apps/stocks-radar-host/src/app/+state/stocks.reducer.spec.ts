import { Action } from '@ngrx/store';

import * as StocksActions from './stocks.actions';
import { StocksEntity } from './stocks.models';
import {
  StocksState,
  initialStocksState,
  stocksReducer,
} from './stocks.reducer';

describe('Stocks Reducer', () => {
  const createStocksEntity = (symbol: string, price = 100): StocksEntity => ({
    symbol,
    price,
    change: 0,
    dayMax: price + 5,
    dayMin: price - 5,
    dayOpen: price - 2,
    lastUpdate: new Date().toISOString(),
    percentChange: 0,
  });

  describe('valid Stocks actions', () => {
    it('stocksReceived should return the list of known Stocks', () => {
      const stocks = [createStocksEntity('AAPL'), createStocksEntity('MSFT')];
      const action = StocksActions.stocksReceived({ stocks });

      const result: StocksState = stocksReducer(initialStocksState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });

    it('stocksConnected should set connected to true', () => {
      const action = StocksActions.stocksConnected();
      const result = stocksReducer(initialStocksState, action);

      expect(result.connected).toBe(true);
    });

    it('stocksDisconnected should set connected to false', () => {
      const state = { ...initialStocksState, connected: true };
      const action = StocksActions.stocksDisconnected();
      const result = stocksReducer(state, action);

      expect(result.connected).toBe(false);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = stocksReducer(initialStocksState, action);

      expect(result).toBe(initialStocksState);
    });
  });
});
