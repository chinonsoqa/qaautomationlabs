import LoginPage from "../pageObjects/loginPage";
import ShopPage from "../pageObjects/shopPage";
import CartPage from "../pageObjects/cartPage";
import KidsWearPage  from "../pageObjects/kidsWearPage";

//describe('testing the URL', {browser: 'chrome'},() => {  //Browser specific defined
describe('shopping', () => {
    
  //Initialize page objects  
  const loginPage = new LoginPage()
  const shopPage = new ShopPage()
  const cartPage = new CartPage()
  const kidsWearPage = new KidsWearPage()

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
      // kidsWearPage.clickKidsWearBtn(this.data.clickKidsWearBtn);
      // kidsWearPage.clickCrocksForKids(this.data.crocksForKids);
      // kidsWearPage.clickSkirtandTopForKids(this.data.skirtandTopForKids);

    // Open the cart before each cart test
      cartPage.openCart();  

    })

  })

it('should display cart items', function () {
  cartPage.CartItem(this.data.expectedCartItems, this.data.expectedCartQuantities);
})

it('should remove item from cart', function () {
  
  // Verify the cart now has one less item
  cartPage.CartItemRemoval(this.data.expectedCartItemsAfterRemoval, this.data.expectedCartQuantitiesAfterRemoval);
});

it.only('should update item quantity in cart with kids items after removing item from cart', function () {
  // Remove an item from cart
  cartPage.CartItemRemoval(this.data.expectedCartItemsAfterRemoval, this.data.expectedCartQuantitiesAfterRemoval);

  // Go back to shopping
  cartPage.backToShopping();

  // Add kids items
  kidsWearPage.clickKidsWearBtn(this.data.clickKidsWearBtn);
  kidsWearPage.clickCorksForKids(this.data.crocksForKids);
  kidsWearPage.clickSkirtandTopForKids(this.data.skirtandTopForKids);

  // Open cart
  cartPage.openCart();

  // Update quantity and verify
  cartPage.CartItemUpdate(this.data.expectedCartItemsAfterUpdate, this.data.expectedCartQuantitiesAfterUpdate);
});


});