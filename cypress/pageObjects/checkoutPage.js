class CheckoutPage {

  selectors = {
    firstName: '#input[placeholder="Enter First Name"]',
    middleName: 'input[placeholder="Enter Middle Name"]',
    lastName: 'input[placeholder="Enter Last Name"]',
    email: 'input[placeholder="example@email.com"]',
    mobile: 'input[placeholder="9876543210"]',
    address: 'textarea[placeholder="Enter Address"]',
    state: 'input[placeholder="Enter State"]',
    city: 'input[placeholder="Enter City"]',
    pinCode: 'input[placeholder="Enter Pin Code"]',
    continueBtn: 'button:contains("Continue")'
  }

  fillCheckoutForm(data) {
    cy.get(this.selectors.firstName).type(data.firstName)
    cy.get(this.selectors.middleName).type(data.middleName)
    cy.get(this.selectors.lastName).type(data.lastName)
    cy.get(this.selectors.email).type(data.email)
    cy.get(this.selectors.mobile).type(data.mobile)
    cy.get(this.selectors.address).type(data.address)
    cy.get(this.selectors.state).type(data.state)
    cy.get(this.selectors.city).type(data.city)
    cy.get(this.selectors.pinCode).type(data.pinCode)
  }

  clickContinue() {
    cy.get(this.selectors.continueBtn).click()
  }
}

export default CheckoutPage
