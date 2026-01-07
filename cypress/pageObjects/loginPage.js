class LoginPage {
  enterUserName(userName) {
    return cy.get('#email').type(userName);
  }

  enterPassword(password) {
    return cy.get('#password').type(password);
  }

  clickLogin() {
    return cy.get('#loginBtn').click();
  }

  login(userName, password) {
    this.enterUserName(userName);
    this.enterPassword(password);
    cy.wait(2000) //wait for 2 sec 
    this.clickLogin();
  }
}

export default LoginPage;