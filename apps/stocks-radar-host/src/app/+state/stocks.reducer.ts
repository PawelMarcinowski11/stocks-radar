import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as StocksActions from './stocks.actions';
import { StocksEntity } from './stocks.models';

export const STOCKS_FEATURE_KEY = 'stocks';

export interface StocksState extends EntityState<StocksEntity> {
  selectedSymbol?: string | null;
  loaded: boolean;
  connected: boolean;
  error?: string | null;
}

export interface StocksPartialState {
  readonly [STOCKS_FEATURE_KEY]: StocksState;
}

export const stocksAdapter: EntityAdapter<StocksEntity> =
  createEntityAdapter<StocksEntity>();

export const initialStocksState: StocksState = stocksAdapter.getInitialState({
  loaded: false,
  connected: false,
});

const reducer = createReducer(
  initialStocksState,
  on(StocksActions.connectStocks, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(StocksActions.stocksReceived, (state, { stocks }) =>
    stocksAdapter.setAll(stocks, { ...state, loaded: true })
  ),
  on(StocksActions.stocksConnectionError, (state, { error }) => ({
    ...state,
    error: error == null ? null : String(error),
  })),
  on(StocksActions.stocksConnected, (state) => ({
    ...state,
    connected: true,
  })),
  on(StocksActions.stocksDisconnected, (state) => ({
    ...state,
    connected: false,
  }))
);

export function stocksReducer(state: StocksState | undefined, action: Action) {
  return reducer(state, action);
}
