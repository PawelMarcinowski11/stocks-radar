import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  STOCKS_FEATURE_KEY,
  StocksState,
  stocksAdapter,
} from './stocks.reducer';

const { selectAll, selectEntities } = stocksAdapter.getSelectors();

export const selectStocksState =
  createFeatureSelector<StocksState>(STOCKS_FEATURE_KEY);
export const selectAllStocks = createSelector(
  selectStocksState,
  (state: StocksState) => selectAll(state)
);
export const selectSelectedId = createSelector(
  selectStocksState,
  (state: StocksState) => state.selectedSymbol
);
export const selectStocksEntities = createSelector(
  selectStocksState,
  (state: StocksState) => selectEntities(state)
);
export const selectEntity = createSelector(
  selectStocksEntities,
  selectSelectedId,
  (entities, selectedSymbol) =>
    selectedSymbol ? entities[selectedSymbol] : undefined
);
export const selectStocksConnected = createSelector(
  selectStocksState,
  (state: StocksState) => state.connected
);
export const selectStocksError = createSelector(
  selectStocksState,
  (state: StocksState) => state.error
);
export const selectStocksLoaded = createSelector(
  selectStocksState,
  (state: StocksState) => state.loaded
);
