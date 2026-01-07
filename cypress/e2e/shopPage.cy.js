import LoginPage from "../pageObjects/loginPage";
import ShopPage from "../pageObjects/shopPage"

//describe('testing the URL', {browser: 'chrome'},() => {  //Browser specific defined
describe('shopping', () => {
    
  //Initialize page objects  
  const loginPage = new LoginPage()
  const shopPage = new ShopPage()

beforeEach(function () {
    cy.visit(Cypress.env('baseURL'))
   
    // Load fixture data inside function-scoped beforeEach
    cy.fixture('testData').then(function (data) {
      this.data = data

    //Perform login before each test  
      loginPage.login(this.data.userName, this.data.password);
    })

  })
    

it('should log in with valid credentials', function () {
  //Assert that user got to the shopping page
  cy.url().should('include', '/shop');
  cy.get('[href="https://qaautomationlabs.com/about/"]').should('exist');
});

it('shop navigation link', function () {
  //Assert that the shop navigation link exists
  cy.get('div.nav-item > a.nav-link > i.fa').click();
})

it('select mens wear from dropdown', function () {
  //Assert that the mens wear dropdown link works
  cy.get('.dropdown-toggle').click();
  cy.get('.dropdown-menu > [href="mens-wear.php"]').click();
  cy.get('.active').should('exist');

})

it('should add men fashion green pant to the cart', function () {
    shopPage.clickMenFashionBtn(this.data.clickMenFashionBtn);
    shopPage.clickGreenPant(this.data.getGreenPant);

     //Verify cart item count
    cy.get('#cartCount').should('have.text', '1');
  });

  it('should add blue sports shoes to the cart', function () {
    shopPage.clickMenFashionBtn(this.data.clickMenFashionBtn);
    shopPage.clickBlueSportsShoes(this.data.blueSportsShoes); 

    //Verify cart item count
    cy.get('#cartCount').should('have.text', '1');
   });

it('should verify menu items are present (negative: missing menu items)', function () {
  // Check that essential menu items exist to catch missing items
  //cy.get('.nav-link').should('have.length.greaterThan', 0);
  cy.get('.nav-link').should('have.length.not.lessThan', 1);
  cy.get('[href*="shop"]').should('exist');
  cy.get('.dropdown-toggle').should('exist');
});

it('should verify correct redirection on navigation (negative: incorrect redirection)', function () {
  // Verify current URL is shop
  cy.url().should('include', '/shop');
  
  // Click mens wear dropdown and verify redirection
  cy.get('.dropdown-toggle').click();
  cy.get('.dropdown-menu').should('be.visible');
  cy.get('.dropdown-menu > [href="mens-wear.php"]').click();
  cy.url().should('include', 'mens-wear.php');
});

it('should verify dropdown functionality (negative: non-functional dropdown options)', function () {
  // Check that dropdown toggles properly
  cy.get('.dropdown-toggle').click();
  cy.wait(5000); //wait for 5 sec
  cy.get('.dropdown-menu').should('be.visible');
  
  // Check that dropdown options are clickable
  cy.get('.dropdown-menu > [href="mens-wear.php"]').should('be.visible').and('have.attr', 'href');
  
  // Click option and verify it works
  cy.get('.dropdown-menu > [href="mens-wear.php"]').click();
  cy.get('.active').should('exist');
});




});



