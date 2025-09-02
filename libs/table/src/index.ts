/**
 * Stock Table Library
 *
 * This library provides a reusable table component for displaying stock data.
 * It is completely decoupled from any host application and can be used anywhere.
 *
 * Main exports:
 * - Table: The main component for displaying stock data
 * - StockData: Interface defining the expected structure of stock data
 * - SortColumn: Type defining which columns can be sorted
 * - SortDirection: Type defining sort direction options
 */

// Main component
export { Table } from './table';

// Data models and types
export type { StockData } from './models';
export type { SortColumn, SortDirection } from './stocks-table.store';
