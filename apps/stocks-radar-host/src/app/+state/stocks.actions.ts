import { createAction, props } from '@ngrx/store';
import { StocksEntity } from './stocks.models';

export const initStocks = createAction('[Stocks Page] Init');

export const loadStocksSuccess = createAction(
  '[Stocks/API] Load Stocks Success',
  props<{ stocks: StocksEntity[] }>()
);

export const loadStocksFailure = createAction(
  '[Stocks/API] Load Stocks Failure',
  props<{ error: any }>()
);
