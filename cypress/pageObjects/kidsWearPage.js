class KidsWearPage {
  // Click on Kids Wear button
  clickKidsWearBtn(selector) {
    cy.get(selector).as('kidsWearBtn');
    cy.get(selector).click();
  }

  // Click on Crocks item
  clickCorksForKids(selector) {
    cy.get(selector).as('crocksForKids');
    cy.wait(2000); // wait for 2 sec
    cy.get(selector).first().click();
  }

  // Click on Skirt and Top item
  clickSkirtandTopForKids(selector) {
    cy.get(selector).as('skirtandTopForKids');
    cy.wait(2000); // wait for 2 sec
    cy.get(selector).first().click();
  }

}

export default KidsWearPage
;