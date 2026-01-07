import LoginPage from "../pageObjects/loginPage";
import ShopPage from "../pageObjects/shopPage"
import CartPage from "../pageObjects/cartPage";

//describe('testing the URL', {browser: 'chrome'},() => {  //Browser specific defined
describe('shopping', () => {
    
  //Initialize page objects  
  const loginPage = new LoginPage()
  const shopPage = new ShopPage()
  const cartPage = new CartPage()

beforeEach(function () {
    cy.visit(Cypress.env('baseURL'))
   
    // Load fixture data inside function-scoped beforeEach
    cy.fixture('testData').then(function (data) {
      this.data = data

    //Perform login before each test  
      loginPage.login(this.data.userName, this.data.password);

    // Add an item to the cart for cart tests
      shopPage.clickMenFashionBtn(this.data.clickMenFashionBtn);
      shopPage.clickGreenPant(this.data.getGreenPant);
      shopPage.clickBlueSportsShoes(this.data.blueSportsShoes);

    // Open the cart before each cart test
      cartPage.openCart();  

    })

  })

it('should display cart items', function () {
  cartPage.verifyCartItem(this.data.expectedCartItems, this.data.expectedCartQuantities);
})

});