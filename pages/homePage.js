const { expect } = require('@playwright/test');

/**
 * HomePage Class - Page Object Model for Careerflow.ai homepage
 * Encapsulates all interactions and locators for the homepage
 */
class HomePage {
  /**
   * Constructor - Initialize all page elements/locators
   * @param {Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    // Locate the Careerflow.ai logo text element
    this.logo = page.locator('text=Careerflow.ai');
    // Locate the "Sign up" link (primary signup button)
    this.signUpButton = page.getByRole('link', { name: 'Sign up' }).first();
    // Locate the "Sign up FOR FREE" call-to-action button
    this.signUpFreeButton = page.getByRole('link', { name: 'Sign up FOR FREE' }).first();
    // Locate the "Log In" link
    this.loginButton = page.getByRole('link', { name: 'Log In' });
  }

  /**
   * Navigate to the Careerflow.ai homepage
   * @returns {Promise<void>}
   */
  async goto() {
    await this.page.goto('https://careerflow.ai');
  }

  /**
   * Click the "Sign up FOR FREE" button to initiate signup flow
   * This button is typically the main CTA on the homepage
   * @returns {Promise<Page>} Returns the current page object for chaining
   */
  async clickSignUp() {
    await this.signUpFreeButton.click();
    return this.page;
  }

  /**
   * Wait for the page to reach networkidle state
   * Ensures all network activity has completed before proceeding
   * @returns {Promise<void>}
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify that all key homepage elements are visible
   * This validates successful page load and proper rendering
   * Checks: Logo, Sign up button, Sign up CTA, and Log In button
   * @returns {Promise<void>} Throws AssertionError if any element is not visible
   */
  async verifyElementsVisible() {
    await expect(this.logo).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
    await expect(this.signUpFreeButton).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}

module.exports = { HomePage };