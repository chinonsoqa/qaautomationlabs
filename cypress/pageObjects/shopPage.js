class ShopPage {
  // Click on Men Fashion button
  clickMenFashionBtn(selector) {
    cy.get(selector).as('menFashionBtn');
    cy.get(selector).click();
  }

  // Click on Green Pant item
  clickGreenPant(selector) {
    cy.get(selector).as('greenPant');
    cy.wait(2000); // wait for 2 sec
    cy.get(selector).first().click();
  }

  // Click on Blue Sports Shoes item
  clickBlueSportsShoes(selector) {
    cy.get(selector).as('blueSportsShoes');
    cy.wait(2000); // wait for 2 sec
    cy.get(selector).first().click();
  }

  // // Verify cart item text
  // verifyCartItem() {
  //   cy.get(':nth-child(1) > .product-item > .text-center > :nth-child(6)').should('have.text', 'Men - Formal');
  // }
}

export default ShopPage;