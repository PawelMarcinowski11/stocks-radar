import { Injectable, computed, signal } from "@angular/core";

import { StockData } from "./models";

@Injectable()
export class StocksTableStore {
  private readonly _error = signal<string | null>(null);
  private readonly _loading = signal<boolean>(true);
  private readonly _sortColumn = signal<SortColumn>('symbol');
  private readonly _sortDirection = signal<SortDirection>('asc');
  private readonly _stocks = signal<StockData[]>([]);

  public readonly error = this._error.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly sortColumn = this._sortColumn.asReadonly();
  public readonly sortDirection = this._sortDirection.asReadonly();
  public readonly sortedStocks = computed(() => {
    const sorted = [...this._stocks()];

    return sorted.sort((a, b) => {
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

  public addStock(stock: StockData): void {
    this._stocks.update((stocks) => [...stocks, stock]);
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

  public setStocks(stocks: StockData[]): void {
    this._stocks.set(stocks);
    this._loading.set(false);
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

  public updateStock(updatedStock: StockData): void {
    this._stocks.update((stocks) =>
      stocks.map((stock) =>
        stock.symbol === updatedStock.symbol ? updatedStock : stock
      )
    );
  }
}

export type SortColumn = 'symbol' | 'price' | 'change' | 'percentChange';

export type SortDirection = 'asc' | 'desc';
