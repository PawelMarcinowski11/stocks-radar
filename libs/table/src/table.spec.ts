import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { heroStar } from "@ng-icons/heroicons/outline";
import { heroStarSolid } from "@ng-icons/heroicons/solid";

import { StockData } from "./models";
import { StocksTableStore } from "./stocks-table.store";
import { Table } from "./table";

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;
  let store: StocksTableStore;

  const mockStocks: StockData[] = [
    {
      symbol: 'AAPL',
      price: 185.25,
      change: 2.5,
      percentChange: 1.69,
      dayMin: 183.5,
      dayMax: 186.2,
      dayOpen: 183.0,
      lastUpdate: new Date().toISOString()
    },
    {
      symbol: 'MSFT',
      price: 415.45,
      change: -1.2,
      percentChange: -0.39,
      dayMin: 414.1,
      dayMax: 417.8,
      dayOpen: 416.7,
      lastUpdate: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Table,
        FormsModule,
        NgIcon
      ],
      providers: [
        StocksTableStore,
        provideIcons({ heroStar, heroStarSolid })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    store = TestBed.inject(StocksTableStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI rendering', () => {
    it('should show loading state when loading is true', () => {
      component.isLoading = true;
      store.setLoading(true);
      fixture.detectChanges();
      
      const loadingElement = fixture.debugElement.query(By.css('.animate-spin'));
      expect(loadingElement).toBeTruthy();
    });
  });
});
