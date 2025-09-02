/**
 * Page object utilities for interacting with the stocks table in Cypress tests
 */

/**
 * Gets the entire stocks table element
 */
export const getStocksTable = () => {
  return cy.get('[data-testid="stocks-table"]');
};

/**
 * Gets a specific stock row by symbol
 * @param symbol The stock symbol to find
 */
export const getStockRow = (symbol: string) => {
  return cy.get(`[data-testid="stock-row-${symbol}"]`);
};

/**
 * Gets the search input field
 */
export const getSearchInput = () => {
  return cy.get('[data-testid="search-input"]');
};

/**
 * Gets the favorite button for a specific stock
 * @param symbol The stock symbol to find the favorite button for
 */
export const getFavoriteButton = (symbol: string) => {
  return cy.get(`[data-testid="favorite-${symbol}"]`);
};

/**
 * Gets the loading indicator when table is in loading state
 */
export const getLoadingIndicator = () => {
  return cy.get('[data-testid="loading-indicator"]');
};

/**
 * Gets the error message when table is in error state
 */
export const getErrorMessage = () => {
  return cy.get('[data-testid="error-message"]');
};

/**
 * Gets the empty state message when no data is available
 */
export const getEmptyStateMessage = () => {
  return cy.get('[data-testid="empty-state"]');
};
