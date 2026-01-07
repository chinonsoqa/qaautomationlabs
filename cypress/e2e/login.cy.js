import LoginPage from "../pageObjects/loginPage"
import 'allure-cypress';

//describe('testing the URL', {browser: 'chrome'},() => {  //Browser specific defined
describe('login test', () => {
  const loginPage = new LoginPage()

  beforeEach(function () {
    //cy.visit(`${Cypress.env('baseURL')}`)
    cy.visit(Cypress.env('baseURL'))
    //cy.visit("")


    // Load fixture data inside function-scoped beforeEach
    cy.fixture('testData').then(function (data) {
      this.data = data
    })

    //Set viewport and presets to your preferred mobile view.
    //You can pass the second parameter as portriat or landscape as required
    //cy.viewport('samsung-s10','portrait')
    //cy.viewport(550, 750) // Set viewport to 550px x 750px (width x height)
  })

  it('should validate empty username fields', function () {
    loginPage.clickLogin();
    //Assert that the user left the username field empty
    cy.get('#emailerror').should('exist')
  
})

  it('should validate empty password fields', function () {
    loginPage.enterUserName(this.data.userName);
    loginPage.clickLogin();
    //Assert that the user left the password field empty
    cy.get('#passerror').should('exist')

  })

  it('Verify invalid username validation', function (){

    loginPage.login(this.data.invalidUsername, this.data.password);

    //Assert that the user entered an invalid username
    cy.get('#emailerror').should('exist')

  })

  it('Verify invalid password validation', function (){

    loginPage.login(this.data.userName, this.data.invalidPassword);

    //Assert that the user entered an invalid password
    cy.get('#errorMsg').should('exist')

  })

  it('should log in with valid credentials', function () {
    loginPage.login(this.data.userName, this.data.password);

  //Assert that user got to the shopping page
    cy.url().should('include', '/shop');
    cy.get('[href="https://qaautomationlabs.com/about/"]').should('exist')
  });

  

})

