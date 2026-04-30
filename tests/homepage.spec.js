const { test } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');

test('Verify homepage elements are visible', async ({ page }) => {
  const homePage = new HomePage(page);

  // Navigate to Careerflow.ai URL
  await homePage.goto();

  // Verify homepage elements are visible
  await homePage.verifyElementsVisible();
});