const { expect } = require('@playwright/test');

/**
 * LoginPage Class - Page Object Model for Careerflow.ai login page
 * Encapsulates all interactions for the login flow including
 * form submission, error validation, and redirect verification
 */
class LoginPage {
  /**
   * Constructor - Initialize all login page elements/locators
   * @param {Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    
    // Login form locators - using specific attribute selectors for reliability
    this.usernameInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button:has-text("Login")');
    
    // Error message locators - Ant Design uses aria-describedby to link errors to fields
    this.emailErrorDiv = page.locator('#email-error');
    this.passwordErrorDiv = page.locator('#password-error');
    
    // Generic error/message containers (Ant Design patterns)
    this.errorAlert = page.locator('[role="alert"]');
    this.antMessage = page.locator('.ant-message');
    
    // Success indicators
    this.dashboardHeading = page.getByRole('heading', { name: /dashboard|welcome|home/i });
  }

  /**
   * Navigate to the login page
   * @returns {Promise<void>}
   */
  async openLoginPage() {
    await this.page.goto('https://app.careerflow.ai/login', { waitUntil: 'domcontentloaded' });
    // Wait for login form to be visible
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
  }

  /**
   * Enter username/email into the login form
   * @param {string} username - The email/username to enter
   * @returns {Promise<void>}
   */
  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password into the login form
   * @param {string} password - The password to enter
   * @returns {Promise<void>}
   */
  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button to submit the form
   * @returns {Promise<void>}
   */
  async clickLoginButton() {
    await this.loginButton.click();
  }

  /**
   * Perform a complete login attempt with username and password
   * @param {string} username - The email/username
   * @param {string} password - The password
   * @returns {Promise<void>}
   */
  async performLogin(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Verify that an error message appears after failed login
   * Checks field-level error divs first, then generic error containers
   * @returns {Promise<string>} The error message text
   */
  async verifyErrorPopupAppears() {
    // Try to find error in the email or password error divs (most likely)
    try {
      // Check email error div first
      const emailErrorVisible = await this.emailErrorDiv.isVisible({ timeout: 5000 }).catch(() => false);
      if (emailErrorVisible) {
        const errorText = await this.emailErrorDiv.textContent();
        return errorText.trim();
      }
    } catch (e) {
      // Continue to next check
    }

    try {
      // Check password error div
      const passwordErrorVisible = await this.passwordErrorDiv.isVisible({ timeout: 5000 }).catch(() => false);
      if (passwordErrorVisible) {
        const errorText = await this.passwordErrorDiv.textContent();
        return errorText.trim();
      }
    } catch (e) {
      // Continue to next check
    }

    try {
      // Check Ant Design message container (modal/toast messages)
      await expect(this.antMessage).toBeVisible({ timeout: 10000 });
      const errorText = await this.antMessage.textContent();
      return errorText.trim();
    } catch (e) {
      // Continue to next check
    }

    try {
      // Check generic alert role
      await expect(this.errorAlert).toBeVisible({ timeout: 10000 });
      const errorText = await this.errorAlert.textContent();
      return errorText.trim();
    } catch (e) {
      // No error found
      throw new Error('No error message found after login attempt');
    }
  }

  /**
   * Verify that the error message contains expected text (supports regex)
   * @param {string|RegExp} expectedText - The text or pattern to search for
   * @returns {Promise<void>}
   */
  async verifyErrorMessageContains(expectedText) {
    const errorMessage = await this.verifyErrorPopupAppears();
    const regex = new RegExp(expectedText, 'i');
    if (!regex.test(errorMessage)) {
      throw new Error(`Error message "${errorMessage}" does not contain "${expectedText}"`);
    }
  }

  /**
   * Verify successful login by checking for dashboard redirect
   * @returns {Promise<void>}
   */
  async verifyLoginSuccess() {
    // Wait for redirect away from login page
    await this.page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 15000 });
  }

  /**
   * Check if login was successful by verifying URL change
   * @returns {Promise<boolean>} True if URL changed away from login, false otherwise
   */
  async isLoginSuccessful() {
    try {
      const currentUrl = this.page.url();
      return !currentUrl.includes('/login');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the current error message text
   * @returns {Promise<string>} The error message or empty string if not found
   */
  async getErrorMessage() {
    try {
      return await this.verifyErrorPopupAppears();
    } catch (error) {
      return '';
    }
  }

  /**
   * Clear login form inputs
   * @returns {Promise<void>}
   */
  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}

module.exports = { LoginPage };
