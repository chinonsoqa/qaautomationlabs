class CartPage {
  openCart() {
    cy.get('#cartdesk > i.fas').click(); // Assuming the cart icon has this class
  }

  verifyCartItem(expectedItems, expectedQuantities) {
    // Verify the number of items in the cart
    cy.get('#cartTable tbody tr').should('have.length', expectedItems);

    // Verify the quantity for each item
    cy.get('#cartTable tbody tr').each(($row, index) => {
      cy.wrap($row).find('td.align-middle input.qty').should('have.value', expectedQuantities[index]);
    });
  }
}

export default CartPage;