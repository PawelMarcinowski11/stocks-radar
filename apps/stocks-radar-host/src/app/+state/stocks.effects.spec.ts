import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as StocksActions from './stocks.actions';
import { StocksEffects } from './stocks.effects';

describe('StocksEffects', () => {
  let actions: Observable<Action>;
  let effects: StocksEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        StocksEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(StocksEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: StocksActions.initStocks() });

      const expected = hot('-a-|', {
        a: StocksActions.loadStocksSuccess({ stocks: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
