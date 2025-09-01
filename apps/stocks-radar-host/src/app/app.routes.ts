import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import * as fromStocks from './+state/stocks.reducer';

import { StocksEffects } from './+state/stocks.effects';
import { StocksFacade } from './+state/stocks.facade';
import { Dashboard } from './components/dashboard';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    component: Dashboard,
    providers: [
      StocksFacade,
      provideState(fromStocks.STOCKS_FEATURE_KEY, fromStocks.stocksReducer),
      provideEffects(StocksEffects),
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
