import { StocksEntity } from './stocks.models';
import {
  stocksAdapter,
  StocksPartialState,
  initialStocksState,
} from './stocks.reducer';
import * as StocksSelectors from './stocks.selectors';

describe('Stocks Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getStocksId = (it: StocksEntity) => it.id;
  const createStocksEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
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
        }
      ),
    };
  });

  describe('Stocks Selectors', () => {
    it('selectAllStocks() should return the list of Stocks', () => {
      const results = StocksSelectors.selectAllStocks(state);
      const selId = getStocksId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = StocksSelectors.selectEntity(state) as StocksEntity;
      const selId = getStocksId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectStocksLoaded() should return the current "loaded" status', () => {
      const result = StocksSelectors.selectStocksLoaded(state);

      expect(result).toBe(true);
    });

    it('selectStocksError() should return the current "error" state', () => {
      const result = StocksSelectors.selectStocksError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
