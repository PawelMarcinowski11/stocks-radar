import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import * as StocksActions from './stocks.actions';
import { StocksEffects } from './stocks.effects';
import { StocksFacade } from './stocks.facade';
import { StocksEntity } from './stocks.models';
import {
  STOCKS_FEATURE_KEY,
  StocksState,
  initialStocksState,
  stocksReducer,
} from './stocks.reducer';
import * as StocksSelectors from './stocks.selectors';

interface TestSchema {
  stocks: StocksState;
}

describe('StocksFacade', () => {
  let facade: StocksFacade;
  let store: Store<TestSchema>;
  const createStocksEntity = (id: string, name = ''): StocksEntity => ({
    id,
    name: name || `name-${id}`,
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

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await firstValueFrom(facade.allStocks$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await firstValueFrom(facade.allStocks$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadStocksSuccess` to manually update list
     */
    it('allStocks$ should return the loaded list; and loaded flag == true', async () => {
      let list = await firstValueFrom(facade.allStocks$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        StocksActions.loadStocksSuccess({
          stocks: [createStocksEntity('AAA'), createStocksEntity('BBB')],
        })
      );

      list = await firstValueFrom(facade.allStocks$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
