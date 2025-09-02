export interface StockData {
  change: number;
  dayMax: number;
  dayMin: number;
  dayOpen: number;
  lastUpdate: string;
  percentChange: number;
  price: number;
  symbol: string;
  flashPositive?: boolean; // Indicator for positive value change animation
  flashNegative?: boolean; // Indicator for negative value change animation
}
