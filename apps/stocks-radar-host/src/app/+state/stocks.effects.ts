import { Injectable, OnDestroy, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  catchError,
  concat,
  concatMap,
  from,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';

import * as StocksActions from './stocks.actions';

import { Stocks } from '../services/stocks';
import { StocksEntity } from './stocks.models';

@Injectable()
export class StocksEffects implements OnDestroy {
  private actions$ = inject(Actions);
  private stocksService = inject(Stocks);

  public connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StocksActions.connectStocks),
      mergeMap(() =>
        from(this.stocksService.connect()).pipe(
          concatMap(() =>
            concat(
              of(StocksActions.stocksConnected()),
              this.stocksService.updates$.pipe(
                map((stocks: StocksEntity[]) =>
                  StocksActions.stocksReceived({ stocks })
                ),
                catchError((error) =>
                  of(StocksActions.stocksConnectionError({ error }))
                )
              )
            )
          )
        )
      ),
      catchError((error) => of(StocksActions.stocksConnectionError({ error })))
    )
  );
  public disconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StocksActions.stocksDisconnected),
        tap(() => {
          this.stocksService.disconnect();
        })
      ),
    { dispatch: false }
  );

  public ngOnDestroy() {
    this.stocksService.disconnect();
  }
}
