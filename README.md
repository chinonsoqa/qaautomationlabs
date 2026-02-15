# QA Automation Labs - Cypress E2E Test Suite

End-to-end test automation framework for [shop.qaautomationlabs.com](https://shop.qaautomationlabs.com), an e-commerce platform. Built with Cypress using the Page Object Model pattern, with multi-format reporting and CI/CD integration.

## Live Reports

| Report | Link |
|--------|------|
| Allure Report | [chinonsoqa.github.io/qaautomationlabs](https://chinonsoqa.github.io/qaautomationlabs/) |
| CI Runs | [GitHub Actions](https://github.com/chinonsoqa/qaautomationlabs/actions) |

## Tech Stack

- **Test Framework:** Cypress 15
- **Language:** JavaScript
- **Pattern:** Page Object Model
- **Reporting:** Allure, Mochawesome, JUnit XML
- **CI/CD:** GitHub Actions (scheduled every 5 hours + on push)
- **Report Hosting:** GitHub Pages

## Project Structure

```
cypress/
  e2e/                  # Test specs
    login.cy.js         # Login validation (valid/invalid credentials)
    shopPage.cy.js      # Product browsing and adding to cart (Men's wear)
    kidsWearPage.cy.js  # Kids wear category and cart operations
    cartPage.cy.js      # Cart management (add, remove, update qty)
    checkoutPage.cy.js  # Checkout form validation and order submission
  pageObjects/          # Page Object classes
    loginPage.js
    shopPage.js
    kidsWearPage.js
    cartPage.js
    checkoutPage.js
  fixtures/             # Test data (JSON)
  support/              # Custom commands and global config
.github/workflows/
  ci.yml                # CI pipeline with reporting and notifications
```

## Test Coverage

| Module | Tests | Coverage |
|--------|-------|----------|
| Login | 6 | Valid/invalid credentials, empty field validation |
| Shop Page | 8 | Navigation, dropdowns, add to cart, negative tests |
| Kids Wear | 5 | Category navigation, add to cart |
| Cart | 5 | Item count, remove items, update quantities, checkout |
| Checkout | 15 | Billing form validation, required fields, edge cases, random data |

**Total: ~39 test cases** covering happy paths, negative scenarios, and edge cases.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/chinonsoqa/qaautomationlabs.git
cd qaautomationlabs
npm install
```

### Run Tests

```bash
# Open Cypress interactive runner
npx cypress open

# Run all tests headlessly
npx cypress run

# Run a specific spec
npx cypress run --spec cypress/e2e/checkoutPage.cy.js
```

### Generate Reports Locally

Allure report (requires Java):
```bash
npx allure serve allure-results
```

Mochawesome HTML report:
```bash
npx cypress run --reporter mochawesome
npx marge mochawesome-report/*.json
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on:

- Push to the `github-actions` branch
- Scheduled cron (every 5 hours)
- Manual trigger via workflow dispatch

### Pipeline Steps

1. Install dependencies and verify Cypress
2. Run all Cypress tests with multi-reporter output
3. Generate Mochawesome HTML and Allure reports
4. Upload artifacts (reports, screenshots, videos)
5. Deploy Allure report to GitHub Pages
6. Send email notifications with test summary

### Artifacts

Each CI run uploads:
- **test-reports** - JUnit XML + Mochawesome HTML (30-day retention)
- **allure-report** - Full Allure report (30-day retention)
- **cypress-screenshots** - Failure screenshots (14-day retention)
- **cypress-videos** - Test run recordings (14-day retention)

## Notifications

Email notifications are sent after each CI run to configured recipients, including:
- Test summary (total, passed, failed, skipped, duration)
- Direct link to the CI run
- Link to the live Allure report

Slack and Microsoft Teams integrations are pre-configured and ready to activate.

## License

ISC
