const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const testData = require('../test-data/loginTestData.json');

/**
 * Login Test Suite
 * Tests various login scenarios including valid login and invalid login attempts
 * Uses parameterized test data to validate login form behavior
 */

test.describe('Careerflow Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
  });

  /**
   * Test Case 1: Valid Login - Existing User
   * Username: rsuraj2524@gmail.com
   * Password: Test@123
   * Expected: Successful login and redirect to dashboard
   */
  test('TC-1: Valid Login - Should login successfully with valid credentials', async ({ page }) => {
    const testCase = testData[0]; // Valid login test case
    
    console.log(`Testing: ${testCase.testCase}`);
    console.log(`Username: ${testCase.username}`);
    
    // Step 1: Enter valid username and password
    await loginPage.performLogin(testCase.username, testCase.password);
    
    // Step 2: Verify successful login
    await loginPage.verifyLoginSuccess();
    
    console.log('✓ Login successful - redirected to dashboard');
  });

  /**
   * Test Case 2: Invalid Login - Wrong Password
   * Username: mayank@123.com
   * Password: test533
   * Expected: Error popup appears with invalid credentials message
   */
  test('TC-2: Invalid Login - Wrong Password should show error popup', async ({ page }) => {
    const testCase = testData[1]; // Invalid login - wrong password
    
    console.log(`Testing: ${testCase.testCase}`);
    console.log(`Username: ${testCase.username}`);
    
    // Step 1: Attempt login with wrong password
    await loginPage.performLogin(testCase.username, testCase.password);
    
    // Step 2: Verify error popup appears
    const errorMessage = await loginPage.verifyErrorPopupAppears();
    expect(errorMessage).toBeTruthy();
    
    console.log(`✓ Error popup appeared: ${errorMessage}`);
    console.log(`✓ Should show error: ${testCase.shouldShowErrorPopup}`);
  });

  /**
   * Test Case 3: Invalid Login - Non-existent User
   * Username: nonexistent_user@example.com
   * Password: SecurePass@123
   * Expected: Error popup appears with user not found or invalid credentials message
   */
  test('TC-3: Invalid Login - Non-existent user should show error popup', async ({ page }) => {
    const testCase = testData[2]; // Invalid login - non-existent user
    
    console.log(`Testing: ${testCase.testCase}`);
    console.log(`Username: ${testCase.username}`);
    
    // Step 1: Attempt login with non-existent user
    await loginPage.performLogin(testCase.username, testCase.password);
    
    // Step 2: Verify error popup appears
    const errorMessage = await loginPage.verifyErrorPopupAppears();
    expect(errorMessage).toBeTruthy();
    
    console.log(`✓ Error popup appeared: ${errorMessage}`);
    console.log(`✓ Should show error: ${testCase.shouldShowErrorPopup}`);
  });

  /**
   * Test Case 4: Invalid Login - Empty/Invalid Password Format
   * Username: testuser@careerflow.ai
   * Password: 123
   * Expected: Error popup appears with invalid credentials or password validation message
   */
  test('TC-4: Invalid Login - Invalid password format should show error popup', async ({ page }) => {
    const testCase = testData[3]; // Invalid login - invalid password format
    
    console.log(`Testing: ${testCase.testCase}`);
    console.log(`Username: ${testCase.username}`);
    
    // Step 1: Attempt login with invalid password
    await loginPage.performLogin(testCase.username, testCase.password);
    
    // Step 2: Verify error popup appears
    const errorMessage = await loginPage.verifyErrorPopupAppears();
    expect(errorMessage).toBeTruthy();
    
    console.log(`✓ Error popup appeared: ${errorMessage}`);
    console.log(`✓ Should show error: ${testCase.shouldShowErrorPopup}`);
  });

  /**
   * Parameterized Test: All test cases
   * Runs all test data scenarios dynamically
   */
  test.describe('Parameterized Login Tests', () => {
    testData.forEach((testCase, index) => {
      test(`TC-P${index + 1}: ${testCase.testCase}`, async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.openLoginPage();

        console.log(`\n--- Running Test Case ${index + 1} ---`);
        console.log(`Test: ${testCase.testCase}`);
        console.log(`Username: ${testCase.username}`);
        console.log(`Is Valid: ${testCase.isValid}`);

        // Perform login
        await loginPage.performLogin(testCase.username, testCase.password);

        if (testCase.isValid) {
          // For valid credentials, verify successful login
          console.log('Verifying successful login...');
          await loginPage.verifyLoginSuccess();
          console.log('✓ Login successful - User redirected to dashboard');
        } else {
          // For invalid credentials, verify error popup
          console.log('Verifying error popup...');
          expect(testCase.shouldShowErrorPopup).toBe(true);
          
          const errorMessage = await loginPage.verifyErrorPopupAppears();
          expect(errorMessage).toBeTruthy();
          
          console.log(`✓ Error popup appeared with message: ${errorMessage}`);
          console.log(`✓ Expected pattern: ${testCase.expectedErrorMessage}`);
        }
      });
    });
  });
});
