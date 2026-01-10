class CartPage {
  openCart() {
    cy.get('#cartdesk > i.fas').click(); // Assuming the cart icon has this class
  }

  CartItem(expectedItems, expectedQuantities) {
    // Verify the number of items in the cart
    cy.get('#cartTable tbody tr').should('have.length', expectedItems);

    // Verify the quantity for each item
    cy.get('#cartTable tbody tr').each(($row, index) => {
      cy.wrap($row).find('td.align-middle input.qty').should('have.value', expectedQuantities[index]);
    });
  }

  CartItemRemoval(expectedItemsAfterRemoval, expectedQuantitiesAfterRemoval) {
    // Remove the first item from the cart
    cy.get(':nth-child(1) > :nth-child(5) > .btn > .fa').click();
    
    // Verify the number of items in the cart after removal
    cy.get('#cartTable tbody tr').should('have.length', expectedItemsAfterRemoval);

    // Verify the quantity after removal for each item
    cy.get('#cartTable tbody tr').each(($row, index) => {
      cy.wrap($row).find('td.align-middle input.qty').should('have.value', expectedQuantitiesAfterRemoval[index]);
    });
  }

  backToShopping() {
    cy.get('.col-md-2 > .btn').click(); // Click on "Back to Shop" button
  }

  CartItemUpdate(expectedCartItemsAfterUpdate, expectedCartQuantitiesAfterUpdate) {
    // Update the quantity for each item in the cart
    cy.get('#cartTable tbody tr').each(($row, index) => {
      cy.wrap($row).find('tr > td.align-middle > input.qty').clear().type(expectedCartQuantitiesAfterUpdate[index]).blur();
    });

    // Verify the number of items in the cart after update
    cy.get('#cartTable tbody tr').should('have.length', expectedCartItemsAfterUpdate);

    // Verify the quantity for each item after update
    cy.get('#cartTable tbody tr').each(($row, index) => {
      cy.wrap($row).find('td.align-middle input.qty').should('have.value', expectedCartQuantitiesAfterUpdate[index]);
    });
  }


  
}

export default CartPage;