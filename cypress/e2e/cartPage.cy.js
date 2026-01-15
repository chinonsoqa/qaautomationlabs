import LoginPage from "../pageObjects/loginPage";
import ShopPage from "../pageObjects/shopPage";
import CartPage from "../pageObjects/cartPage";
import KidsWearPage from "../pageObjects/kidsWearPage";

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
  // Assert item count
  cartPage.assertCartItemsCount(this.data.expectedCartItems);
  
  // Assert quantities by name
  this.data.initialCartItems.forEach(item => {
    cartPage.assertQtyByName(item.name, item.qty);
  });
})

it('should remove item from cart', function () {
  // Remove item by name
  cartPage.removeItemByName(this.data.removeProductName);
  
  // Assert updated item count
  cartPage.assertCartItemsCount(this.data.expectedCartItemsAfterRemoval);
  
  // Assert quantity of remaining item
  cartPage.assertQtyByName(this.data.remainingItemAfterRemoval.name, this.data.remainingItemAfterRemoval.qty);
});

it.only('should update item quantity in cart with kids items after removing item from cart', function () {
  // Remove an item from cart
  cartPage.removeItemByName(this.data.removeProductName);
  cartPage.assertCartItemsCount(this.data.expectedCartItemsAfterRemoval);

  // Go back to shopping
  cartPage.backToShopping();

  // Add kids items
  kidsWearPage.clickKidsWearBtn(this.data.clickKidsWearBtn);
  kidsWearPage.clickCroksForKids(this.data.crocksForKids); 
  kidsWearPage.clickSkirtandTopForKids(this.data.skirtandTopForKids);

  // Open cart
  cartPage.openCart();

  // Update quantities by name
  cartPage.updateMultipleQtyByName(this.data.cartQtyByNameAfterUpdate);
  
  // Assert updated item count
  cartPage.assertCartItemsCount(this.data.expectedCartItemsAfterUpdate);
  
  // Assert updated quantities by name
  Object.entries(this.data.cartQtyByNameAfterUpdate).forEach(([name, qty]) => {
    cartPage.assertQtyByName(name, qty);
  });
});
});