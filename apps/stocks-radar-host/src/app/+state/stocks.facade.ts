import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as StocksActions from './stocks.actions';
import * as StocksFeature from './stocks.reducer';
import * as StocksSelectors from './stocks.selectors';

@Injectable()
export class StocksFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(StocksSelectors.selectStocksLoaded));
  allStocks$ = this.store.pipe(select(StocksSelectors.selectAllStocks));
  selectedStocks$ = this.store.pipe(select(StocksSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(StocksActions.initStocks());
  }
}
