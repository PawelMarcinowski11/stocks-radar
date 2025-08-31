import { StocksEntity } from './stocks.models';
import {
  initialStocksState,
  stocksAdapter,
  StocksPartialState,
} from './stocks.reducer';
import * as StocksSelectors from './stocks.selectors';

describe('Stocks Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getStocksSymbol = (it: StocksEntity) => it.symbol;
  const createStocksEntity = (symbol: string, price = 100) =>
    ({
      symbol,
      price,
      change: 0,
      dayMax: price + 5,
      dayMin: price - 5,
      dayOpen: price - 2,
      lastUpdate: new Date().toISOString(),
      percentChange: 0,
    } as StocksEntity);

  let state: StocksPartialState;

  beforeEach(() => {
    state = {
      stocks: stocksAdapter.setAll(
        [
          createStocksEntity('PRODUCT-AAA'),
          createStocksEntity('PRODUCT-BBB'),
          createStocksEntity('PRODUCT-CCC'),
        ],
        {
          ...initialStocksState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
          connected: true,
        }
      ),
    };
  });

  describe('Stocks Selectors', () => {
    it('selectAllStocks() should return the list of Stocks', () => {
      const results = StocksSelectors.selectAllStocks(state);
      const symbol = results[1].symbol;

      expect(results.length).toBe(3);
      expect(symbol).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = StocksSelectors.selectEntity(state) as StocksEntity;
      const symbol = result.symbol;

      expect(symbol).toBe('PRODUCT-BBB');
    });

    it('selectStocksLoaded() should return the current "loaded" status', () => {
      const result = StocksSelectors.selectStocksLoaded(state);

      expect(result).toBe(true);
    });

    it('selectStocksError() should return the current "error" state', () => {
      const result = StocksSelectors.selectStocksError(state);

      expect(result).toBe(ERROR_MSG);
    });

    it('selectStocksConnected() should return the current "connected" state', () => {
      const result = StocksSelectors.selectStocksConnected(state);

      expect(result).toBe(true);
    });
  });
});
