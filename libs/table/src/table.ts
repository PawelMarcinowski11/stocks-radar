import { DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { heroArrowDown, heroArrowPathRoundedSquare, heroArrowUp, heroCurrencyDollar, heroCurrencyEuro, heroCurrencyPound, heroCurrencyYen } from "@ng-icons/heroicons/outline";

import { EMPTY, Subject, interval, switchMap, takeUntil } from "rxjs";

import { StockData } from "./models";
import { SortColumn, StocksTableStore } from "./stocks-table.store";

/**
 * Table component that displays stock data in a sortable table with stats.
 *
 * Features:
 * - Displays multiple stocks in a sortable table
 * - Provides sorting functionality by column
 * - Handles loading and error states
 * - Uses Angular signals for reactive state management
 *
 * Usage:
 * ```html
 * <lib-table
 *   [data]="stocksArray"
 *   [isLoading]="loading"
 *   [error]="errorMessage">
 * </lib-table>
 * ```
 */
@Component({
  selector: 'lib-table',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, NgIcon],
  templateUrl: './table.html',
  providers: [StocksTableStore, provideIcons({
    heroArrowUp,
    heroArrowDown,
    heroCurrencyEuro,
    heroCurrencyPound,
    heroCurrencyDollar,
    heroCurrencyYen,
    heroArrowPathRoundedSquare
  })],
})

export class Table implements OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();

  protected readonly store = inject(StocksTableStore);
  protected readonly loading = this.store.loading;
  protected readonly sortColumn = this.store.sortColumn;
  protected readonly sortDirection = this.store.sortDirection;
  protected readonly stocks = this.store.sortedStocks;

  @Input() public data: StockData[] = [];
  @Input() public error: string | null = null;
  @Input() public isLoading = true;
  public loadingIcon = 'hero-arrow-path-rounded-square';

  constructor() {
    toObservable(this.loading).pipe(
      switchMap(loading => {
        if (loading === true) {
          return interval(3000)
        }
        else return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.randomizeLoadingIcon();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.store.setStocks(this.data);
    }

    if (changes['isLoading']) {
      this.store.setLoading(this.isLoading);
    }

    if (changes['error']) {
      this.store.setError(this.error);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public randomizeLoadingIcon(): void {
    const loadingIcons = ['hero-currency-dollar', 'hero-currency-euro', 'hero-currency-pound', 'hero-currency-yen', 'hero-arrow-path-rounded-square'];
    loadingIcons.findIndex(icon => icon === this.loadingIcon);
    loadingIcons.splice(loadingIcons.findIndex(icon => icon === this.loadingIcon), 1);
    this.loadingIcon = loadingIcons[Math.floor(Math.random() * loadingIcons.length)];
  }

  protected getChangeColorClass(change: number): string {
    return change >= 0 ? 'positive-change' : 'negative-change';
  }

  protected getErrorMessage(): string {
    return this.store.error() || '';
  }

  protected getSortIcon(column: SortColumn): string {
    if (this.sortColumn() !== column) {
      return 'sort';
    }
    return this.sortDirection() === 'asc' ? 'sort-up' : 'sort-down';
  }

  protected hasErrorMessage(): boolean {
    return this.store.error() !== null;
  }

  protected sortBy(column: SortColumn): void {
    this.store.updateSort(column);
  }
}
