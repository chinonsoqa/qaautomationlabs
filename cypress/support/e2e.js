// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import "allure-cypress";

//Suppress uncaught exceptions in Cypress
//If this error is not critical to your test (e.g., you're not testing the carousel), you can tell Cypress to ignore it:
//Place this in your cypress/support/e2e.js or directly in your test file before the describe() block.
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for debugging
  console.log('Uncaught exception:', err.message);
  
  // Ignore script errors from cross-origin scripts
  if (err.message.includes('Script error')) {
    return false;
  }
  
  // Ignore specific known errors
  if (err.message.includes('owlCarousel is not a function')) {
    return false;
  }
  
  // Return true to let other errors fail the test
  return true;
});