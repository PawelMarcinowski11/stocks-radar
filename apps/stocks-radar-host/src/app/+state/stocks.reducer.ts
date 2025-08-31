import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as StocksActions from './stocks.actions';
import { StocksEntity } from './stocks.models';

export const STOCKS_FEATURE_KEY = 'stocks';

export interface StocksState extends EntityState<StocksEntity> {
  selectedId?: string | number; // which Stocks record has been selected
  loaded: boolean; // has the Stocks list been loaded
  error?: string | null; // last known error (if any)
}

export interface StocksPartialState {
  readonly [STOCKS_FEATURE_KEY]: StocksState;
}

export const stocksAdapter: EntityAdapter<StocksEntity> =
  createEntityAdapter<StocksEntity>();

export const initialStocksState: StocksState = stocksAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialStocksState,
  on(StocksActions.initStocks, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(StocksActions.loadStocksSuccess, (state, { stocks }) =>
    stocksAdapter.setAll(stocks, { ...state, loaded: true })
  ),
  on(StocksActions.loadStocksFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function stocksReducer(state: StocksState | undefined, action: Action) {
  return reducer(state, action);
}
