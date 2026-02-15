import LoginPage from "../pageObjects/loginPage";
import ShopPage from "../pageObjects/shopPage";
import CartPage from "../pageObjects/cartPage";
import CheckoutPage from "../pageObjects/checkoutPage";

// ── Random data helpers (no external dependencies) ──────────────────────────
function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomFirstName() {
  const names = ['James', 'Maria', 'Robert', 'Linda', 'Ahmed', 'Yuki', 'Carlos', 'Fatima', 'Chen', 'Olga'];
  return names[Math.floor(Math.random() * names.length)];
}

function randomLastName() {
  const names = ['Smith', 'Garcia', 'Johnson', 'Müller', 'Patel', 'Tanaka', 'Santos', 'Kim', 'Okafor', 'Brown'];
  return names[Math.floor(Math.random() * names.length)];
}

function randomEmail() {
  return `test.${randomString(6)}@mailtest.com`;
}

function randomMobile() {
  return '9' + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
}

function randomPinCode() {
  return String(100000 + Math.floor(Math.random() * 900000));
}

function randomState() {
  const states = ['Lagos', 'California', 'Ontario', 'Maharashtra', 'Bavaria', 'Tokyo', 'Queensland', 'Sao Paulo'];
  return states[Math.floor(Math.random() * states.length)];
}

function randomCity() {
  const cities = ['Ikeja', 'Los Angeles', 'Toronto', 'Mumbai', 'Munich', 'Shibuya', 'Brisbane', 'Campinas'];
  return cities[Math.floor(Math.random() * cities.length)];
}

function randomAddress() {
  const num = Math.floor(Math.random() * 9999) + 1;
  const streets = ['Main St', 'Cypress Ave', 'Oak Blvd', 'Elm Drive', 'Park Lane', 'Test Road', 'Automation Way'];
  return `${num} ${streets[Math.floor(Math.random() * streets.length)]}`;
}

function generateCheckoutData() {
  return {
    firstName: randomFirstName(),
    middleName: randomString(5),
    lastName: randomLastName(),
    email: randomEmail(),
    mobile: randomMobile(),
    address: randomAddress(),
    state: randomState(),
    city: randomCity(),
    pinCode: randomPinCode()
  };
}

// ── Test Suite ───────────────────────────────────────────────────────────────
describe("Checkout Page Tests", () => {
  const loginPage = new LoginPage();
  const shopPage = new ShopPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(function () {
    cy.visit(Cypress.env("baseURL"));

    cy.fixture("testData").then(function (data) {
      this.data = data;

      // Login -> Add item -> Cart -> Checkout
      loginPage.login(this.data.userName, this.data.password);
      shopPage.clickMenFashionBtn(this.data.clickMenFashionBtn);
      shopPage.clickGreenPant(this.data.getGreenPant);
      cartPage.openCart();
      cartPage.clickCheckoutBtn();

      cy.url().should("include", "/checkout.php");
      cy.contains("Billing Address").should("exist");
    });
  });

  // ── Happy Path ──────────────────────────────────────────────────────────
  it("should submit billing address with valid random data", function () {
    const checkoutData = generateCheckoutData();
    cy.log(`Using: ${checkoutData.firstName} ${checkoutData.lastName}, ${checkoutData.email}`);

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    // Confirm details page
    cy.url().should("include", "/confirm.php");
    cy.contains("Confirm Details").should("exist");

    // Place the order
    checkoutPage.clickPlaceOrder();

    // Thank you page
    cy.url().should("include", "/thanks.php");
    cy.contains("Thank You for Your Order!").should("exist");
  });

  it("should submit billing address without middle name (optional field)", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.middleName = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    cy.url().should("include", "/confirm.php");
    checkoutPage.clickPlaceOrder();

    cy.url().should("include", "/thanks.php");
    cy.contains("Thank You for Your Order!").should("exist");
  });

  // ── Negative: Empty Required Fields ─────────────────────────────────────
  it("should not proceed when First Name is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.firstName = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.firstName).should("have.value", "");
  });

  it("should not proceed when Last Name is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.lastName = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.lastName).should("have.value", "");
  });

  it("should not proceed when Email is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.email = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.email).should("have.value", "");
  });

  it("should not proceed when Mobile number is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.mobile = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.mobile).should("have.value", "");
  });

  it("should not proceed when Address is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.address = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.address).should("have.value", "");
  });

  it("should not proceed when State is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.state = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.state).should("have.value", "");
  });

  it("should not proceed when City is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.city = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.city).should("have.value", "");
  });

  it("should not proceed when Pin Code is empty", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.pinCode = "";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.pinCode).should("have.value", "");
  });

  // ── Negative: Invalid Formats ───────────────────────────────────────────
  it("should reject invalid email format", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.email = "invalid-email-format";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.email).should("have.value", "invalid-email-format");
  });

  it("should not proceed with a mobile number that is too short", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.mobile = "12345";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
  });

  it("should not proceed with non-numeric pin code", function () {
    const checkoutData = generateCheckoutData();
    checkoutData.pinCode = "ABCXYZ";

    checkoutPage.fillCheckoutForm(checkoutData);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
  });

  // ── Edge Cases ──────────────────────────────────────────────────────────
  it("should handle all required fields empty", function () {
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.firstName).should("have.value", "");
    cy.get(checkoutPage.selectors.lastName).should("have.value", "");
    cy.get(checkoutPage.selectors.email).should("have.value", "");
    cy.get(checkoutPage.selectors.mobile).should("have.value", "");
    cy.get(checkoutPage.selectors.address).should("have.value", "");
  });

  it("should verify all checkout form fields are visible", function () {
    cy.get(checkoutPage.selectors.firstName).should("be.visible");
    cy.get(checkoutPage.selectors.middleName).should("be.visible");
    cy.get(checkoutPage.selectors.lastName).should("be.visible");
    cy.get(checkoutPage.selectors.email).should("be.visible");
    cy.get(checkoutPage.selectors.mobile).should("be.visible");
    cy.get(checkoutPage.selectors.address).should("be.visible");
    cy.get(checkoutPage.selectors.state).should("be.visible");
    cy.get(checkoutPage.selectors.city).should("be.visible");
    cy.get(checkoutPage.selectors.pinCode).should("be.visible");
  });

  it("should verify checkout page heading and labels exist", function () {
    cy.contains("Billing Address").should("be.visible");
    cy.get(checkoutPage.selectors.continueBtn).should("be.visible");
  });

  it("should produce unique data across multiple runs", function () {
    const run1 = generateCheckoutData();
    const run2 = generateCheckoutData();

    // Extremely unlikely to collide — validates randomness is working
    expect(run1.email).to.not.equal(run2.email);

    checkoutPage.fillCheckoutForm(run1);
    checkoutPage.clickContinue();

    cy.url().should("include", "/confirm.php");
    checkoutPage.clickPlaceOrder();

    cy.url().should("include", "/thanks.php");
    cy.contains("Thank You for Your Order!").should("exist");
  });
});
