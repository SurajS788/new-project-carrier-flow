const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const { SignupPage } = require('../pages/signupPage');

/**
 * Test: Google OAuth Signup Flow with Terms Acceptance
 * 
 * This test validates the complete signup flow:
 * 1. Navigates from homepage and initiates signup
 * 2. Verifies error message appears when attempting Google signup without accepting terms
 * 3. Accepts terms and retries Google signup
 * 4. Verifies successful redirect to Google authentication page
 */
test.only('Signup with Google should require terms acceptance and open Google auth', async ({ page }) => {
  const homePage = new HomePage(page);
  const signupPage = new SignupPage(page);

  // Step 1: Navigate to Careerflow.ai/singup page
  await signupPage.opensingupPage();
  
  
  // Step 5: Verify Google signup button is visible and clickable
  await signupPage.verifyGoogleOptionVisibleAndClickable();

  // Step 6: Attempt to click Google signup without accepting terms
  // This should trigger an error message
  await signupPage.clickGoogleSignUp();
  
  // Step 7: Verify error message appears (validation that terms are required)
  await signupPage.verifyTermsErrorMessage();

  // Step 8: Accept the terms and privacy policy checkbox
  await signupPage.acceptTermsAndPolicy();

  // Step 9: Get the list of current browser pages before clicking Google signup
  // This helps us detect when a new tab/window opens for Google authentication
  const originalPages = signupBrowserPage.context().pages();
  
  // Step 10: Click Google signup button again (now with terms accepted)
  await signupPage.clickGoogleSignUp();

});

test('Signup form should validate password rules, require terms acceptance, and show email verification popup', async ({ page }) => {
 
  const signupPage = new SignupPage(page);
  // Step 1: Navigate to Careerflow.ai/singup page
  await signupPage.opensingupPage();
 
  const signupEmail = `tim${Date.now()}@example.com`;

  await signupPage.fillFirstName('tim');
  await signupPage.fillLastName('david');
  await signupPage.fillEmail(signupEmail);

  // Enter password and verify the validation rule messages appear
  await signupPage.fillPassword('Test');
  await signupPage.verifyPasswordRulesVisible();

  // Complete a valid password and try to signup without accepting terms
  await signupPage.fillPassword('Test@123');
  await signupPage.clickSignUpButton();
  await signupPage.verifyTermsErrorMessage();

  await signupPage.acceptTermsAndPolicy();
  await signupPage.clickSignUpButton();

  await signupPage.verifyEmailVerificationPopupContains(signupEmail);
  await signupPage.verifyPopupButtonsVisible();
});
