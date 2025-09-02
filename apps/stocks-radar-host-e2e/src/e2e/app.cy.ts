// No imports needed for now

describe('stocks-radar-host-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display the stocks table', () => {
    // Verify the stocks table is visible
    cy.get('[data-testid="stocks-table"]').should('exist');
  });
});
