import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import * as StocksActions from './stocks.actions';
import { StocksEffects } from './stocks.effects';
import { StocksFacade } from './stocks.facade';
import { StocksEntity } from './stocks.models';
import {
  STOCKS_FEATURE_KEY,
  StocksState,
  stocksReducer,
} from './stocks.reducer';

interface TestSchema {
  stocks: StocksState;
}

describe('StocksFacade', () => {
  let facade: StocksFacade;
  let store: Store<TestSchema>;
  const createStocksEntity = (symbol: string, price = 100): StocksEntity => ({
    symbol,
    price,
    change: 0,
    dayMax: price + 5,
    dayMin: price - 5,
    dayOpen: price - 2,
    lastUpdate: new Date().toISOString(),
    percentChange: 0,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(STOCKS_FEATURE_KEY, stocksReducer),
          EffectsModule.forFeature([StocksEffects]),
        ],
        providers: [StocksFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(StocksFacade);
    });

    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await firstValueFrom(facade.allStocks$);
      let isLoaded = await firstValueFrom(facade.loaded$);
      const isConnected = await firstValueFrom(facade.connected$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);
      expect(isConnected).toBe(false);

      facade.connect();

      list = await firstValueFrom(facade.allStocks$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    it('allStocks$ should return the loaded list; and loaded flag == true', async () => {
      let list = await firstValueFrom(facade.allStocks$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        StocksActions.stocksReceived({
          stocks: [createStocksEntity('AAA'), createStocksEntity('BBB')],
        })
      );

      list = await firstValueFrom(facade.allStocks$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });

    it('connected$ should reflect connection state', async () => {
      let isConnected = await firstValueFrom(facade.connected$);
      expect(isConnected).toBe(false);

      store.dispatch(StocksActions.stocksConnected());

      isConnected = await firstValueFrom(facade.connected$);
      expect(isConnected).toBe(true);

      store.dispatch(StocksActions.stocksDisconnected());

      isConnected = await firstValueFrom(facade.connected$);
      expect(isConnected).toBe(false);
    });

    it('error$ should reflect error state', async () => {
      const error = new Error('Test error');
      let errorState = await firstValueFrom(facade.error$);
      expect(errorState).toBeNull();

      store.dispatch(StocksActions.stocksConnectionError({ error }));

      errorState = await firstValueFrom(facade.error$);
      expect(errorState).toBe(String(error));
    });
  });
});
