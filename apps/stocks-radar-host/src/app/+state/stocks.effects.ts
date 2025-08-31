import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as StocksActions from './stocks.actions';
import * as StocksFeature from './stocks.reducer';

@Injectable()
export class StocksEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StocksActions.initStocks),
      switchMap(() => of(StocksActions.loadStocksSuccess({ stocks: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(StocksActions.loadStocksFailure({ error }));
      })
    )
  );
}
