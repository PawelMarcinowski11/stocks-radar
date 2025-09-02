import { TestBed } from "@angular/core/testing";

import { StockData } from "./models";
import { StocksTableStore } from "./stocks-table.store";

describe('StocksTableStore', () => {
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
    },
    {
      symbol: 'GOOGL',
      price: 152.89,
      change: 3.45,
      percentChange: 2.71,
      dayMin: 148.5,
      dayMax: 153.0,
      dayOpen: 148.9,
      lastUpdate: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StocksTableStore]
    });
    store = TestBed.inject(StocksTableStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have initial loading state as true', () => {
      expect(store.loading()).toBe(true);
    });

    it('should have empty stocks initially', () => {
      expect(store.stocks().length).toBe(0);
    });

    it('should have empty favorites initially', () => {
      expect(store.favoriteSymbols().length).toBe(0);
    });

    it('should have empty search query initially', () => {
      expect(store.searchQuery()).toBe('');
    });

    it('should have default sort column as symbol', () => {
      expect(store.sortColumn()).toBe('symbol');
    });

    it('should have default sort direction as ascending', () => {
      expect(store.sortDirection()).toBe('asc');
    });
  });

  describe('setStocks', () => {
    it('should set stocks and set loading to false', () => {
      store.setStocks(mockStocks);
      expect(store.stocks().length).toBe(3);
      expect(store.loading()).toBe(false);
    });
  });

  describe('addStock', () => {
    it('should add a new stock to the existing stocks', () => {
      store.setStocks(mockStocks);
      const newStock: StockData = {
        symbol: 'AMZN',
        price: 178.25,
        change: -2.1,
        percentChange: -1.43,
        dayMin: 177.2,
        dayMax: 180.8,
        dayOpen: 180.3,
        lastUpdate: new Date().toISOString()
      };
      store.addStock(newStock);
      expect(store.stocks().length).toBe(4);
      expect(store.stocks()[3].symbol).toBe('AMZN');
    });
  });

  describe('removeStock', () => {
    it('should remove a stock by symbol', () => {
      store.setStocks(mockStocks);
      store.removeStock('MSFT');
      expect(store.stocks().length).toBe(2);
      expect(store.stocks().find(s => s.symbol === 'MSFT')).toBeUndefined();
    });
  });

  describe('updateSort', () => {
    beforeEach(() => {
      store.setStocks(mockStocks);
    });

    it('should change sort column when different column is selected', () => {
      store.updateSort('price');
      expect(store.sortColumn()).toBe('price');
      expect(store.sortDirection()).toBe('asc');
    });

    it('should toggle sort direction when same column is selected', () => {
      store.updateSort('symbol');
      expect(store.sortDirection()).toBe('desc');
      store.updateSort('symbol');
      expect(store.sortDirection()).toBe('asc');
    });
    
    it('should sort by price in ascending order', () => {
      store.updateSort('price');
      const sortedStocks = store.sortedStocks();
      expect(sortedStocks[0].symbol).toBe('GOOGL'); // Lowest price
      expect(sortedStocks[2].symbol).toBe('MSFT');  // Highest price
    });

    it('should sort by price in descending order', () => {
      store.updateSort('price');
      store.updateSort('price'); // Toggle to desc
      const sortedStocks = store.sortedStocks();
      expect(sortedStocks[0].symbol).toBe('MSFT');  // Highest price
      expect(sortedStocks[2].symbol).toBe('GOOGL'); // Lowest price
    });
  });

  describe('favoriting', () => {
    beforeEach(() => {
      store.setStocks(mockStocks);
    });

    it('should add a stock to favorites', () => {
      store.toggleFavorite('AAPL');
      expect(store.favoriteSymbols().length).toBe(1);
      expect(store.favoriteSymbols()[0]).toBe('AAPL');
      expect(store.isFavorite('AAPL')).toBe(true);
    });

    it('should remove a stock from favorites', () => {
      store.toggleFavorite('AAPL');
      store.toggleFavorite('AAPL');
      expect(store.favoriteSymbols().length).toBe(0);
      expect(store.isFavorite('AAPL')).toBe(false);
    });

    it('should display favorite stocks first in sorted list', () => {
      store.toggleFavorite('GOOGL');
      const sortedStocks = store.sortedStocks();
      expect(sortedStocks[0].symbol).toBe('GOOGL');
    });

    it('should maintain sort order within favorite and non-favorite groups', () => {
      store.toggleFavorite('MSFT');
      store.toggleFavorite('GOOGL');
      store.updateSort('price');
      
      const sortedStocks = store.sortedStocks();
      
      // Favorites should come first (GOOGL, MSFT) but sorted by price
      expect(sortedStocks[0].symbol).toBe('GOOGL'); // Lowest price among favorites
      expect(sortedStocks[1].symbol).toBe('MSFT');  // Highest price among favorites
      
      // Non-favorites follow
      expect(sortedStocks[2].symbol).toBe('AAPL'); // Only non-favorite
    });
  });

  describe('searching', () => {
    beforeEach(() => {
      store.setStocks(mockStocks);
    });

    it('should filter stocks by symbol', () => {
      store.setSearchQuery('MS');
      expect(store.sortedStocks().length).toBe(1);
      expect(store.sortedStocks()[0].symbol).toBe('MSFT');
    });

    it('should be case insensitive', () => {
      store.setSearchQuery('msft');
      expect(store.sortedStocks().length).toBe(1);
      expect(store.sortedStocks()[0].symbol).toBe('MSFT');
    });

    it('should return all stocks when search query is empty', () => {
      store.setSearchQuery('');
      expect(store.sortedStocks().length).toBe(3);
    });

    it('should maintain favorite order when filtering', () => {
      store.toggleFavorite('MSFT');
      store.setSearchQuery('M');
      expect(store.sortedStocks().length).toBe(1);
      expect(store.sortedStocks()[0].symbol).toBe('MSFT');
    });

    it('should return empty array when no matches found', () => {
      store.setSearchQuery('AMZN');
      expect(store.sortedStocks().length).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should set error state', () => {
      store.setError('Failed to fetch stocks');
      expect(store.error()).toBe('Failed to fetch stocks');
      expect(store.loading()).toBe(false);
    });

    it('should clear error when loading is set to true', () => {
      store.setError('Failed to fetch stocks');
      store.setLoading(true);
      expect(store.error()).toBeNull();
    });
  });

  describe('updateStock', () => {
    beforeEach(() => {
      store.setStocks(mockStocks);
    });

    it('should update an existing stock', () => {
      const updatedStock = {
        ...mockStocks[0],
        price: 190.5,
        change: 5.25
      };

      store.updateStock(updatedStock);
      
      const stock = store.stocks().find(s => s.symbol === 'AAPL');
      expect(stock?.price).toBe(190.5);
      expect(stock?.change).toBe(5.25);
    });

    it('should not change other stocks when updating one stock', () => {
      const originalMsft = store.stocks().find(s => s.symbol === 'MSFT');
      const updatedStock = {
        ...mockStocks[0],
        price: 190.5
      };

      store.updateStock(updatedStock);
      
      const msftAfterUpdate = store.stocks().find(s => s.symbol === 'MSFT');
      expect(msftAfterUpdate).toEqual(originalMsft);
    });
  });
});
