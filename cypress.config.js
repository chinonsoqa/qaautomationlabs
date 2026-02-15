const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
  e2e: {
    experimentalPromptCommand: true,
    setupNodeEvents(on, config) {
      allureCypress(on, {
        resultsDir: "allure-results",
      });
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
    env: {
      baseURL: "https://shop.qaautomationlabs.com/index.php"
    },
    video: true
  },
  projectId: "4usmfv"
});
