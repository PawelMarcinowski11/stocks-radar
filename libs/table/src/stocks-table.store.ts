import { Injectable, computed, signal } from "@angular/core";

import { Subject, shareReplay } from "rxjs";

import { StockData } from "./models";

@Injectable()
export class StocksTableStore {
  private readonly _error = signal<string | null>(null);
  private readonly _favoriteSymbols = signal<string[]>([]);
  private readonly _loading = signal<boolean>(true);
  private readonly _recentlyChanged = signal<Map<string, 'up' | 'down'>>(new Map());
  private readonly _searchQuery = signal<string>('');
  private readonly _sortColumn = signal<SortColumn>('symbol');
  private readonly _sortDirection = signal<SortDirection>('asc');
  private readonly _stocks = signal<StockData[]>([]);
  private readonly stockUpdates$ = new Subject<{symbol: string, change: 'up' | 'down'}>();

  public readonly error = this._error.asReadonly();
  public readonly favoriteSymbols = this._favoriteSymbols.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly recentlyChanged = this._recentlyChanged.asReadonly();
  public readonly searchQuery = this._searchQuery.asReadonly();
  public readonly sortColumn = this._sortColumn.asReadonly();
  public readonly sortDirection = this._sortDirection.asReadonly();
  public readonly sortedStocks = computed(() => {
    const allStocks = [...this._stocks()];
    const favoriteSymbols = this._favoriteSymbols();
    
    const query = this._searchQuery().toLowerCase();
    const filtered = query 
      ? allStocks.filter(stock => stock.symbol.toLowerCase().includes(query))
      : allStocks;

    return filtered.sort((a, b) => {
      const aIsFavorite = favoriteSymbols.includes(a.symbol);
      const bIsFavorite = favoriteSymbols.includes(b.symbol);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      const aValue = a[this._sortColumn()];
      const bValue = b[this._sortColumn()];

      if (this._sortDirection() === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  });
  public readonly stocks = this._stocks.asReadonly();

  constructor() {
    this.stockUpdates$.pipe(
      shareReplay(undefined, 2000)
    ).subscribe(update => {
      this._recentlyChanged.update(map => {
        const newMap = new Map(map);
        newMap.set(update.symbol, update.change);

        return newMap;
      });
    });
  }

  public addStock(stock: StockData): void {
    this._stocks.update((stocks) => [...stocks, stock]);
  }

  public getPriceChangeDirection(symbol: string): 'up' | 'down' | undefined {
    const map = this._recentlyChanged();
    if (!map.has(symbol)) return undefined;

    return map.get(symbol);
  }

  public hasRecentlyChanged(symbol: string): boolean {
    return this._recentlyChanged().has(symbol);
  }

  public isFavorite(symbol: string): boolean {
    return this._favoriteSymbols().includes(symbol);
  }

  public removeStock(symbol: string): void {
    this._stocks.update((stocks) =>
      stocks.filter((stock) => stock.symbol !== symbol)
    );
  }

  public setError(error: string | null): void {
    this._error.set(error);
    if (error) {
      this._loading.set(false);
      console.log(error, !!error, this._loading());
    }
    console.log(error, !!error, this._loading());
  }

  public setLoading(isLoading: boolean): void {
    this._loading.set(isLoading);
    if (isLoading) {
      this._error.set(null);
    }
  }

  public setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  public setStocks(stocks: StockData[]): void {
    const currentStocks = this._stocks();
    
    if (currentStocks.length > 0) {
      stocks.forEach(newStock => {
        const existingStock = currentStocks.find(s => s.symbol === newStock.symbol);

        if (existingStock) {
          const priceChanged = existingStock.price !== newStock.price;

          if (priceChanged) {
            this.stockUpdates$.next({
              symbol: newStock.symbol,
              change: newStock.price > existingStock.price ? 'up' : 'down'
            });
          }
        }
        
      });
    }
    
    this._stocks.set(stocks);
    this._loading.set(false);
  }

  public toggleFavorite(symbol: string): void {
    this._favoriteSymbols.update(favorites => {
      const index = favorites.indexOf(symbol);
      if (index === -1) {
        return [...favorites, symbol];
      } else {
        return favorites.filter(s => s !== symbol);
      }
    });
  }

  public updateSort(column: SortColumn): void {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();

    if (currentColumn === column) {
      this._sortDirection.set(currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      this._sortColumn.set(column);
      this._sortDirection.set('asc');
    }
  }
}

export type SortColumn = 'symbol' | 'price' | 'change' | 'percentChange';

export type SortDirection = 'asc' | 'desc';
