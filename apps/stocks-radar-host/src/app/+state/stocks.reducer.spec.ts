import { Action } from '@ngrx/store';

import * as StocksActions from './stocks.actions';
import { StocksEntity } from './stocks.models';
import {
  StocksState,
  initialStocksState,
  stocksReducer,
} from './stocks.reducer';

describe('Stocks Reducer', () => {
  const createStocksEntity = (id: string, name = ''): StocksEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Stocks actions', () => {
    it('loadStocksSuccess should return the list of known Stocks', () => {
      const stocks = [
        createStocksEntity('PRODUCT-AAA'),
        createStocksEntity('PRODUCT-zzz'),
      ];
      const action = StocksActions.loadStocksSuccess({ stocks });

      const result: StocksState = stocksReducer(initialStocksState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
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
