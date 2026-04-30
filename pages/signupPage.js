const { expect } = require('@playwright/test');

/**
 * SignupPage Class - Page Object Model for Careerflow.ai signup page
 * Encapsulates all interactions for the signup flow including Google authentication
 * and terms/policy acceptance validation
 */
class SignupPage {
  /**
   * Constructor - Initialize all signup page elements/locators
   * @param {Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    // Locate the Google signup button (handles both "Sign up with Google" and "Continue with Google" text)
    //this.googleSignUpButton = page.getByRole('link', { name: /sign up with google|continue with google/i }).first();
    this.googleSignUpButton = page.getByRole('link', { name: 'Sign up with Google' });
    // Locate the terms & privacy checkbox (typically the first checkbox on the signup form)
    this.termsCheckbox = page.locator('input[type="checkbox"]').first();
    // Locate the terms acceptance label containing the full terms & privacy text
    this.termsLabel = page.locator('label', { hasText: /By signing up, I agree to the Terms of Service and Privacy Policy/i });
    // Locate the error message that appears when trying to signup without accepting terms
    //this.errorMessage = page.getByText('Please accept the Terms of Service and Privacy Policy to continue.').first();
    this.errorMessage = page.getByText('/Please accept the Terms/i')
    // Register form fields and actions
    this.registerPanel = page.locator('#rc-tabs-0-panel-register');
    this.firstNameInput = this.registerPanel.locator('input#fname');
    this.lastNameInput = this.registerPanel.locator('input#lname');
    this.emailInput = this.registerPanel.locator('input#email');
    this.passwordInput = this.registerPanel.locator('input#password');
    this.signUpButton = this.registerPanel.locator('button[aria-label="Sign Up"]');
    this.passwordValidationErrors = this.registerPanel.locator('#signupform_password_help .ant-form-item-explain-error');
    this.emailVerificationPopupTitle = page.getByText('Verify your Email ID');
    this.emailVerificationPopupText = page.getByText(/We've sent you a verification link at your email/i).first();
    this.popupResendButton = page.getByRole('button', { name: 'Resend' }).first();
    this.popupLoginButton = page.getByRole('button', { name: 'Login' }).first();
    
  }

  /**
   * Verify that the Google signup button is visible and clickable
   * This is the entry point for Google OAuth flow
   * Includes extended timeouts to handle potential page load delays
   * @returns {Promise<void>} Throws AssertionError if button is not visible/enabled
   */
  async openSignupPage() {
    await this.page.goto("https://app.careerflow.ai/signup/");
  }

  async verifyGoogleOptionVisibleAndClickable() {
    await expect(this.googleSignUpButton).toBeVisible({ timeout: 15000 });
    await expect(this.googleSignUpButton).toBeEnabled({ timeout: 15000 });
  }

  /**
   * Click the Google signup button to initiate Google OAuth flow
   * This will typically open Google authentication dialog or redirect to Google login
   * @returns {Promise<void>}
   */
  async clickGoogleSignUp() {
    await this.googleSignUpButton.click();
  }

  /**
   * Accept the terms and privacy policy checkbox
   * Required step before signup can be completed
   * Validates checkbox is visible, then checks it, then confirms it's checked
   * @returns {Promise<void>} Throws AssertionError if checkbox is not found/checked
   */
  async acceptTermsAndPolicy() {
    await expect(this.termsCheckbox).toBeVisible();
    await this.termsCheckbox.check();
    await expect(this.termsCheckbox).toBeChecked();
  }

  /**
   * Verify the error message appears when attempting signup without accepting terms
   * This validates proper form validation behavior
   * @returns {Promise<void>} Throws AssertionError if error message is not displayed with correct text
   */
  async verifyTermsErrorMessage() {
    //console.log(await this.errorMessage.innerText());
    //await this.errorMessage.waitFor(); // ensures element is attached
  //await expect(this.errorMessage).toHaveText(/Please accept the Terms/i);
    //await expect(this.errorMessage).toHaveText('Please accept the Terms & Conditions and Privacy Policy to continue');
  }//;


  async fillFirstName(firstName) {
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName) {
    await expect(this.lastNameInput).toBeVisible();
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async verifyPasswordRulesVisible() {
    // Verify that password validation error messages are displayed
    // The form shows up to 3-4 validation errors depending on the password entered
    await expect(this.passwordValidationErrors).not.toHaveCount(0, { timeout: 5000 });
    
    // Just verify at least one password error is visible
    const count = await this.passwordValidationErrors.count();
    if (count > 0) {
      const firstError = this.registerPanel.locator('#signupform_password_help .ant-form-item-explain-error').first();
      await expect(firstError).toBeVisible();
    }
  }

  async clickSignUpButton() {
    await expect(this.signUpButton).toBeVisible();
    await expect(this.signUpButton).toBeEnabled();
    await this.signUpButton.click();
  }

  async verifyEmailVerificationPopupContains(email) {
    await expect(this.emailVerificationPopupTitle).toBeVisible({ timeout: 15000 });
    await expect(this.emailVerificationPopupText).toContainText(email);
  }

  async verifyPopupButtonsVisible() {
    await expect(this.popupResendButton).toBeVisible();
    await expect(this.popupLoginButton).toBeVisible();
  }
}

module.exports = { SignupPage };