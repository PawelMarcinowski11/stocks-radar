import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable, Subject } from 'rxjs';

import { Stocks } from '../services/stocks';
import * as StocksActions from './stocks.actions';
import { StocksEffects } from './stocks.effects';

describe('StocksEffects', () => {
  let actions: Observable<Action>;
  let effects: StocksEffects;

  beforeEach(() => {
    const mockUpdates = new Subject<import('./stocks.models').StocksEntity[]>();
    const mockStocks = {
      updates$: mockUpdates.asObservable(),
      connect: () => Promise.resolve(),
    } as unknown as Stocks;

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        StocksEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        { provide: Stocks, useValue: mockStocks },
      ],
    });

    effects = TestBed.inject(StocksEffects);
  });

  describe('connect$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: StocksActions.connectStocks() });

      const expected = hot('-a-|', {
        a: StocksActions.stocksConnected(),
      });

      expect(effects.connect$).toBeObservable(expected);
    });
  });

  describe('disconnect$', () => {
    it('should have a disconnect$ effect', () => {
      expect(effects.disconnect$).toBeDefined();
    });
  });
});
