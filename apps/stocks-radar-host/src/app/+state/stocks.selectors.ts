import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  STOCKS_FEATURE_KEY,
  StocksState,
  stocksAdapter,
} from './stocks.reducer';

// Lookup the 'Stocks' feature state managed by NgRx
export const selectStocksState =
  createFeatureSelector<StocksState>(STOCKS_FEATURE_KEY);

const { selectAll, selectEntities } = stocksAdapter.getSelectors();

export const selectStocksLoaded = createSelector(
  selectStocksState,
  (state: StocksState) => state.loaded
);

export const selectStocksError = createSelector(
  selectStocksState,
  (state: StocksState) => state.error
);

export const selectAllStocks = createSelector(
  selectStocksState,
  (state: StocksState) => selectAll(state)
);

export const selectStocksEntities = createSelector(
  selectStocksState,
  (state: StocksState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectStocksState,
  (state: StocksState) => state.selectedId
);

export const selectEntity = createSelector(
  selectStocksEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
