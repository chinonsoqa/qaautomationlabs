class CartPage {
  selectors = {
    cartRows: '#cartTable tbody tr',
    productCell: 'td.align-left',
    qtyInput: 'input.qty',
    removeBtn: 'button.remove',
    cartIcon: '#cartdesk > i.fas',  // Added for openCart
    backToShopBtn: '.col-md-2 > .btn',  // Added for backToShopping
  };

  openCart() {
    cy.get(this.selectors.cartIcon).click();
  }

  backToShopping() {
    cy.get(this.selectors.backToShopBtn).click();
  }

  removeItemByName(productName) {
    cy.get(this.selectors.cartRows)
      .contains(this.selectors.productCell, productName)
      .parents('tr')
      .find(this.selectors.removeBtn)
      .click();
  }

  updateQtyByName(productName, qty) {
    cy.get(this.selectors.cartRows)
      .contains(this.selectors.productCell, productName)
      .parents('tr')
      .find(this.selectors.qtyInput)
      .clear()
      .type(`${qty}`)
      .blur();
  }

  assertCartItemsCount(expectedCount) {
    cy.get(this.selectors.cartRows).should('have.length', expectedCount);
  }

  assertQtyByName(productName, expectedQty) {
    cy.get(this.selectors.cartRows)
      .contains(this.selectors.productCell, productName)
      .parents('tr')
      .find(this.selectors.qtyInput)
      .should('have.value', `${expectedQty}`);
  }

  updateMultipleQtyByName(qtyMap) {
    Object.entries(qtyMap).forEach(([name, qty]) => {
      this.updateQtyByName(name, qty);
    });
  }
}

export default CartPage;