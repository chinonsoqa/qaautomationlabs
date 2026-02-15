class CheckoutPage {

  selectors = {
    firstName: 'input[placeholder="Enter First Name"]',
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
    if (data.firstName) cy.get(this.selectors.firstName).type(data.firstName)
    if (data.middleName) cy.get(this.selectors.middleName).type(data.middleName)
    if (data.lastName) cy.get(this.selectors.lastName).type(data.lastName)
    if (data.email) cy.get(this.selectors.email).type(data.email)
    if (data.mobile) cy.get(this.selectors.mobile).type(data.mobile)
    if (data.address) cy.get(this.selectors.address).type(data.address)
    if (data.state) cy.get(this.selectors.state).type(data.state)
    if (data.city) cy.get(this.selectors.city).type(data.city)
    if (data.pinCode) cy.get(this.selectors.pinCode).type(data.pinCode)
  }

  clickContinue() {
    cy.get(this.selectors.continueBtn).click()
  }

  clickPlaceOrder() {
    cy.contains('Place Order').click()
  }

  shouldStillBeOnCheckout() {
    cy.url().should('include', '/checkout.php')
    cy.contains('Billing Address').should('exist')
  }
}

export default CheckoutPage
