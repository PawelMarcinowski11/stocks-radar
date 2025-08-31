import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as StocksActions from './stocks.actions';
import * as StocksSelectors from './stocks.selectors';

@Injectable()
export class StocksFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(StocksSelectors.selectStocksLoaded));
  allStocks$ = this.store.pipe(select(StocksSelectors.selectAllStocks));
  selectedStocks$ = this.store.pipe(select(StocksSelectors.selectEntity));
  connected$ = this.store.pipe(select(StocksSelectors.selectStocksConnected));
  error$ = this.store.pipe(select(StocksSelectors.selectStocksError));

  connect() {
    this.store.dispatch(StocksActions.connectStocks());
  }

  disconnect() {
    this.store.dispatch(StocksActions.stocksDisconnected());
  }
}
