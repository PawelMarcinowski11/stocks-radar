import { DatePipe, DecimalPipe, NgClass, UpperCasePipe } from "@angular/common";
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { heroArrowDown, heroArrowPathRoundedSquare, heroArrowUp, heroCurrencyDollar, heroCurrencyEuro, heroCurrencyPound, heroCurrencyYen, heroMagnifyingGlass, heroStar, heroXMark } from "@ng-icons/heroicons/outline";
import { heroStarSolid } from "@ng-icons/heroicons/solid";

import { EMPTY, Subject, debounceTime, distinctUntilChanged, interval, switchMap, takeUntil } from "rxjs";

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
 *   [error]="errorMessage"
 *   [initialFavorites]="['AAPL', 'GOOGL']">
 * </lib-table>
 * ```
 */
@Component({
  selector: 'lib-table',
  standalone: true,
  imports: [DatePipe, DecimalPipe, UpperCasePipe, NgClass, NgIcon, FormsModule],
  templateUrl: './table.html',
  providers: [StocksTableStore, provideIcons({
    heroArrowUp,
    heroArrowDown,
    heroCurrencyEuro,
    heroCurrencyPound,
    heroCurrencyDollar,
    heroCurrencyYen,
    heroArrowPathRoundedSquare,
    heroMagnifyingGlass,
    heroXMark,
    heroStar,
    heroStarSolid
  })],
})

export class Table implements OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchTerms = new Subject<string>();

  protected readonly store = inject(StocksTableStore);
  protected readonly favoriteSymbols = this.store.favoriteSymbols;
  protected readonly loading = this.store.loading;
  protected readonly recentlyChanged = this.store.recentlyChanged;
  protected readonly searchQuery = this.store.searchQuery;
  protected readonly sortColumn = this.store.sortColumn;
  protected readonly sortDirection = this.store.sortDirection;
  protected readonly stocks = this.store.sortedStocks;

  @Input() public data: StockData[] = [];
  @Input() public error: string | null = null;
  @Input() public isLoading = true;
  public loadingIcon = 'hero-arrow-path-rounded-square';
  public searchTerm = '';

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
    
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((term: string) => {
      this.store.setSearchQuery(term);
    });
  }

  @Input() public set initialFavorites(favorites: string[]) {
    if (favorites && favorites.length > 0) {
      favorites.forEach(symbol => this.store.toggleFavorite(symbol));
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isInitialChange = Object.values(changes).some(change => change.firstChange);
    
    if (changes['data']) {
      this.store.setStocks(this.data);
      
      if (this.searchTerm && !isInitialChange && 
          changes['data'].previousValue?.length !== changes['data'].currentValue?.length) {
        this.clearSearch();
      }
    }

    if (changes['isLoading']) {
      this.store.setLoading(this.isLoading);
    }

    if (changes['error']) {
      this.store.setError(this.error);
    }
  }

  public ngOnDestroy(): void {
    this.searchTerms.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public randomizeLoadingIcon(): void {
    const loadingIcons = ['hero-currency-dollar', 'hero-currency-euro', 'hero-currency-pound', 'hero-currency-yen', 'hero-arrow-path-rounded-square'];
    loadingIcons.findIndex(icon => icon === this.loadingIcon);
    loadingIcons.splice(loadingIcons.findIndex(icon => icon === this.loadingIcon), 1);
    this.loadingIcon = loadingIcons[Math.floor(Math.random() * loadingIcons.length)];
  }

  protected clearSearch(): void {
    this.searchTerm = '';
    this.searchTerms.next(this.searchTerm);
    this.store.setSearchQuery('');
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

  protected onSearch(): void {
    this.searchTerms.next(this.searchTerm);
  }

  protected sortBy(column: SortColumn): void {
    this.store.updateSort(column);
  }

  protected toggleFavorite(symbol: string, event: MouseEvent): void {
    event.stopPropagation();
    this.store.toggleFavorite(symbol);
  }
}
