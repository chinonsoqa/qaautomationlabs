import LoginPage from "../pageObjects/loginPage";
import KidsWearPage  from "../pageObjects/kidsWearPage"

//describe('testing the URL', {browser: 'chrome'},() => {  //Browser specific defined
describe('shopping', () => {
    
  //Initialize page objects  
  const loginPage = new LoginPage()
  const kidsWearPage = new KidsWearPage()

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

it('select kids wear from dropdown', function () {
  //Assert that the kids wear dropdown link works
  cy.get('.dropdown-toggle').click();
  cy.get('.dropdown-menu > [href="kids-wear.php"]').click();
  cy.get('.active').should('exist');

})

it('should add crocks for kids to the cart', function () {
    kidsWearPage.clickKidsWearBtn(this.data.clickKidsWearBtn);
    kidsWearPage.clickCorksForKids(this.data.crocksForKids);

     //Verify cart item count and exact product
    cy.get('#cartCount').should('have.text', '1');

    // Verify product exists in cart
//cy.get('#cartTable tbody tr').should('contain.text', 'Crocks');
  });

  it('should add skirt and Top For Kids to the cart', function () {
    kidsWearPage.clickKidsWearBtn(this.data.clickKidsWearBtn);
    kidsWearPage.clickSkirtandTopForKids(this.data.skirtandTopForKids); 

    //Verify cart item count
    cy.get('#cartCount').should('have.text', '1');
   });

// it('should verify menu items are present (negative: missing menu items)', function () {
//   // Check that essential menu items exist to catch missing items
//   //cy.get('.nav-link').should('have.length.greaterThan', 0);
//   cy.get('.nav-link').should('have.length.not.lessThan', 1);
//   cy.get('[href*="shop"]').should('exist');
//   cy.get('.dropdown-toggle').should('exist');
// });

// it('should verify correct redirection on navigation (negative: incorrect redirection)', function () {
//   // Verify current URL is shop
//   cy.url().should('include', '/shop');
  
//   // Click mens wear dropdown and verify redirection
//   cy.get('.dropdown-toggle').click();
//   cy.get('.dropdown-menu').should('be.visible');
//   cy.get('.dropdown-menu > [href="mens-wear.php"]').click();
//   cy.url().should('include', 'mens-wear.php');
// });

// it('should verify dropdown functionality (negative: non-functional dropdown options)', function () {
//   // Check that dropdown toggles properly
//   cy.get('.dropdown-toggle').click();
//   cy.wait(5000); //wait for 5 sec
//   cy.get('.dropdown-menu').should('be.visible');
  
//   // Check that dropdown options are clickable
//   cy.get('.dropdown-menu > [href="mens-wear.php"]').should('be.visible').and('have.attr', 'href');
  
//   // Click option and verify it works
//   cy.get('.dropdown-menu > [href="mens-wear.php"]').click();
//   cy.get('.active').should('exist');
// });




});



