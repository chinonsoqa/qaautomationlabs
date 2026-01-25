import LoginPage from "../pageObjects/loginPage";
import ShopPage from "../pageObjects/shopPage";
import CartPage from "../pageObjects/cartPage";
import CheckoutPage from "../pageObjects/checkoutPage";

describe("checkout tests", () => {
  const loginPage = new LoginPage();
  const shopPage = new ShopPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  // Reusable setup: login -> add item -> cart -> checkout
  beforeEach(function () {
    cy.visit(Cypress.env("baseURL"));

    cy.fixture("testData").then((data) => {
      this.data = data;

      loginPage.login(this.data.userName, this.data.password);

      // Add an item so checkout has cart content
      shopPage.clickMenFashionBtn(this.data.clickMenFashionBtn);
      shopPage.clickGreenPant(this.data.getGreenPant);

      // Go to cart then checkout
      cartPage.openCart();
      cartPage.clickCheckoutBtn();

      cy.url().should("include", "/checkout.php");
      cy.contains("BILLING ADDRESS").should("exist");
    });
  });

  it("Happy path: should submit billing address with valid data", function () {
    checkoutPage.fillForm(this.data.checkoutValid);
    checkoutPage.clickContinue();

    // If the app redirects after continue, assert the next page / success behavior here.
    // For now, confirm user did not remain blocked on checkout with empty fields.
    // A safe assertion: Continue should not throw and user remains in a valid state.
    cy.contains("Payment").should("exist");
  });

  // -------------------------
  // Negative tests (required fields)
  // -------------------------

  it("Negative: should not proceed when First Name is empty", function () {
    const bad = { ...this.data.checkoutValid, firstName: "" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.firstName).then(($el) => {
      // HTML5 required validation often sets :invalid
      cy.wrap($el).should("have.value", "");
    });
  });

  it("Negative: should not proceed when Last Name is empty", function () {
    const bad = { ...this.data.checkoutValid, lastName: "" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.lastName).should("have.value", "");
  });

  it("Negative: should not proceed when Email is empty", function () {
    const bad = { ...this.data.checkoutValid, email: "" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.email).should("have.value", "");
  });

  it("Negative: should not proceed when Mobile number is empty", function () {
    const bad = { ...this.data.checkoutValid, mobile: "" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.mobile).should("have.value", "");
  });

  it("Negative: should not proceed when Address is empty", function () {
    const bad = { ...this.data.checkoutValid, address: "" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.address).should("have.value", "");
  });

  it("Negative: should not proceed when State/City/Pin Code are empty", function () {
    const bad = { ...this.data.checkoutValid, state: "", city: "", pinCode: "" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.state).should("have.value", "");
    cy.get(checkoutPage.selectors.city).should("have.value", "");
    cy.get(checkoutPage.selectors.pinCode).should("have.value", "");
  });

  // -------------------------
  // Validation negatives (format rules)
  // -------------------------

  it("Negative: should reject invalid email format", function () {
    const bad = { ...this.data.checkoutValid, email: "not-an-email" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    // If input type="email", browser validation blocks submission
    checkoutPage.shouldStillBeOnCheckout();
    cy.get(checkoutPage.selectors.email).should("have.value", "not-an-email");
  });

  it("Edge: mobile number too short should not proceed (if validation exists)", function () {
    const bad = { ...this.data.checkoutValid, mobile: "12345" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    // App-dependent: if no validation, this may pass. If it passes, adjust expected behavior.
    checkoutPage.shouldStillBeOnCheckout();
  });

  it("Edge: pin code non-numeric should not proceed (if validation exists)", function () {
    const bad = { ...this.data.checkoutValid, pinCode: "ABCDEF" };
    checkoutPage.fillForm(bad);
    checkoutPage.clickContinue();

    checkoutPage.shouldStillBeOnCheckout();
  });

  // -------------------------
  // Edge cases (data boundaries)
  // -------------------------

  it("Edge: should allow middle name to be optional (leave blank)", function () {
    const ok = { ...this.data.checkoutValid, middleName: "" };
    checkoutPage.fillForm(ok);
    checkoutPage.clickContinue();

    cy.contains("Payment").should("exist");
  });

  it("Edge: should trim leading/trailing spaces (if app sanitizes)", function () {
    const ok = {
      ...this.data.checkoutValid,
      firstName: "  John  ",
      lastName: "  Doe ",
      city: " Ikeja "
    };

    checkoutPage.fillForm(ok);
    checkoutPage.clickContinue();

    // App-dependent: if it trims, you can assert normalized values after submission.
    cy.contains("Payment").should("exist");
  });
});
