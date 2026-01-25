//const { defineConfig } = require("cypress");
import { defineConfig } from "cypress";
import { allureCypress } from "allure-cypress/reporter";
//const { allureCypress } = require("allure-cypress/reporter");
//import { allureCypress } from "allure-cypress/reporter";

module.exports = defineConfig({
  //watchForFileChanges:false, //This makes the test not to run automatically
 // defaultCommandTimeout: 60000, // Period it takes for a command to be executed (Implicite wait in selenium). If after the time elapses the command is not executed, the test fails.
  //pageLoadTimeout: 60000, // How long it takes for a page to load before the test fails
  //viewportWidth: 1280, // Set the width of the viewport for the tests
 // viewportHeight: 720, // Set the height of the viewport for the tests
  e2e: {
    experimentalPromptCommand: true, // To enable the experimental prompt commands feature
    setupNodeEvents(on, config) {
      // implement node event listeners here
       allureCypress(on, config, {
        resultsDir: "allure-results", // Optional: specify the results directory
      });
      return config;
    },
    specPattern:'cypress/e2e/**/*.cy.js',
    //retries: 1,
    env:{
      baseURL: "https://shop.qaautomationlabs.com/index.php"
    },
    video: true
    
    },

    projectId: "4usmfv" //Cypress Cloud Project ID
    

});
