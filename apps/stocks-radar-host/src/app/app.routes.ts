import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromStocks from './+state/stocks.reducer';
import { StocksEffects } from './+state/stocks.effects';
import { StocksFacade } from './+state/stocks.facade';

export const appRoutes: Route[] = [
  {
    path: '',
    component: NxWelcome,
    providers: [
      StocksFacade,
      provideState(fromStocks.STOCKS_FEATURE_KEY, fromStocks.stocksReducer),
      provideEffects(StocksEffects),
    ],
  },
];
