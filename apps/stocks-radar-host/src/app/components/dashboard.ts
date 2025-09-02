import { AsyncPipe } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { StockData, Table } from "@stocks-radar/table";

import { Observable, Subject, map } from "rxjs";

import { StocksFacade } from "../+state/stocks.facade";
import { Theme } from "../services/theme";

@Component({
  selector: 'app-dashboard',
  imports: [Table, AsyncPipe],
  templateUrl: './dashboard.html',
  standalone: true,
  providers: [StocksFacade],
})
export class Dashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private stocksFacade = inject(StocksFacade);
  private themeService = inject(Theme);

  public error$ = this.stocksFacade.error$.pipe(map((error) => error || null));
  public isDarkMode = this.themeService.isDarkMode;
  public loading$ = this.stocksFacade.loaded$.pipe(
    map((loaded) => !loaded)
  );
  public stocks$: Observable<StockData[]> = this.stocksFacade.allStocks$;

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stocksFacade.disconnect();
  }

  public ngOnInit(): void {
    this.stocksFacade.connect();
  }

  public toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
