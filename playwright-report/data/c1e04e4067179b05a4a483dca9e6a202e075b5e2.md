# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: signup.spec.js >> Signup form should validate password rules, require terms acceptance, and show email verification popup
- Location: tests\signup.spec.js:41:6

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByText(/We've sent you a verification link at your email/i).first()
Expected substring: "tim1777576885633@example.com"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByText(/We've sent you a verification link at your email/i).first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - link "Skip Navigation" [ref=e5] [cursor=pointer]:
      - generic [ref=e6]: Skip Navigation
    - generic [ref=e8]:
      - img "img" [ref=e11]
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e15]:
            - generic [ref=e16]:
              - img "Careerflow" [ref=e18]
              - generic [ref=e20]: Careerflow
            - heading "Job Seeker Portal" [level=2] [ref=e23]
          - generic [ref=e26]:
            - tablist [ref=e27]:
              - generic [ref=e29]:
                - tab "Login" [ref=e31] [cursor=pointer]
                - tab "Sign Up" [selected] [ref=e33] [cursor=pointer]
            - generic [ref=e35]:
              - text: "* *"
              - tabpanel "Sign Up" [ref=e36]:
                - generic [ref=e38]:
                  - link "Sign up with Google" [ref=e40] [cursor=pointer]:
                    - img "google icon" [ref=e41]
                    - generic [ref=e42]: Sign up with Google
                  - separator [ref=e44]:
                    - generic [ref=e45]: OR
                  - generic [ref=e47]:
                    - generic "First Name" [ref=e49]: First Name *
                    - textbox "First Name" [ref=e53]
                  - generic [ref=e55]:
                    - generic "Last Name" [ref=e57]: Last Name *
                    - textbox "Last Name" [ref=e61]
                  - generic [ref=e63]:
                    - generic "Email" [ref=e65]: Email *
                    - textbox "example@email.com" [ref=e69]
                  - generic [ref=e71]:
                    - generic "Password" [ref=e73]: Password *
                    - generic [ref=e77]:
                      - textbox "Enter a Password" [ref=e78]
                      - button "Show Password" [ref=e80] [cursor=pointer]:
                        - img [ref=e83]
                  - generic [ref=e87] [cursor=pointer]:
                    - checkbox "By signing up, I agree to the Terms of Service and Privacy Policy" [checked] [ref=e89]
                    - generic [ref=e92]:
                      - text: By signing up, I agree to the
                      - link "Terms of Service" [ref=e93]:
                        - /url: https://www.careerflow.ai/terms
                        - generic [ref=e94]: Terms of Service
                      - text: and
                      - link "Privacy Policy" [ref=e95]:
                        - /url: https://www.careerflow.ai/privacy
                        - generic [ref=e96]: Privacy Policy
                  - button "Sign Up" [ref=e97] [cursor=pointer]:
                    - generic [ref=e98]: Sign Up
        - link "Looking for the Coach Portal?" [ref=e101] [cursor=pointer]:
          - /url: https://coach.careerflow.ai/?ref=jobseeker_view
      - img "img" [ref=e104]
  - status: Sent! Please check your email
  - iframe [ref=e105]:
    
  - generic [ref=e106]:
    - dialog "Verify your Email ID":
      - generic [ref=e107]:
        - button "Close" [ref=e108] [cursor=pointer]:
          - generic "Close" [ref=e109]:
            - img [ref=e111]
        - generic [ref=e114]: Verify your Email ID
        - generic [ref=e116]: We’ve sent you a verification link at your email tim1777576885633@example.com. Please verify your email to continue. Please also check spam or promotion for verification email.
        - generic [ref=e118]:
          - button "Resend" [ref=e119] [cursor=pointer]:
            - generic [ref=e120]: Resend
          - button "Login" [ref=e121] [cursor=pointer]:
            - generic [ref=e122]: Login
  - button "Open Intercom Messenger" [ref=e123] [cursor=pointer]:
    - img [ref=e125]
    - generic:
      - img
```

# Test source

```ts
  30  |     this.passwordInput = this.registerPanel.locator('input#password');
  31  |     this.signUpButton = this.registerPanel.locator('button[aria-label="Sign Up"]');
  32  |     this.passwordValidationErrors = this.registerPanel.locator('#signupform_password_help .ant-form-item-explain-error');
  33  |     this.emailVerificationPopupTitle = page.getByText('Verify your Email ID');
  34  |     this.emailVerificationPopupText = page.getByText(/We've sent you a verification link at your email/i).first();
  35  |     this.popupResendButton = page.getByRole('button', { name: 'Resend' }).first();
  36  |     this.popupLoginButton = page.getByRole('button', { name: 'Login' }).first();
  37  |     
  38  |   }
  39  | 
  40  |   /**
  41  |    * Verify that the Google signup button is visible and clickable
  42  |    * This is the entry point for Google OAuth flow
  43  |    * Includes extended timeouts to handle potential page load delays
  44  |    * @returns {Promise<void>} Throws AssertionError if button is not visible/enabled
  45  |    */
  46  |   async openSignupPage() {
  47  |     await this.page.goto("https://app.careerflow.ai/signup/");
  48  |   }
  49  | 
  50  |   async verifyGoogleOptionVisibleAndClickable() {
  51  |     await expect(this.googleSignUpButton).toBeVisible({ timeout: 15000 });
  52  |     await expect(this.googleSignUpButton).toBeEnabled({ timeout: 15000 });
  53  |   }
  54  | 
  55  |   /**
  56  |    * Click the Google signup button to initiate Google OAuth flow
  57  |    * This will typically open Google authentication dialog or redirect to Google login
  58  |    * @returns {Promise<void>}
  59  |    */
  60  |   async clickGoogleSignUp() {
  61  |     await this.googleSignUpButton.click();
  62  |   }
  63  | 
  64  |   /**
  65  |    * Accept the terms and privacy policy checkbox
  66  |    * Required step before signup can be completed
  67  |    * Validates checkbox is visible, then checks it, then confirms it's checked
  68  |    * @returns {Promise<void>} Throws AssertionError if checkbox is not found/checked
  69  |    */
  70  |   async acceptTermsAndPolicy() {
  71  |     await expect(this.termsCheckbox).toBeVisible();
  72  |     await this.termsCheckbox.check();
  73  |     await expect(this.termsCheckbox).toBeChecked();
  74  |   }
  75  | 
  76  |   /**
  77  |    * Verify the error message appears when attempting signup without accepting terms
  78  |    * This validates proper form validation behavior
  79  |    * @returns {Promise<void>} Throws AssertionError if error message is not displayed with correct text
  80  |    */
  81  |   async verifyTermsErrorMessage() {
  82  |     //console.log(await this.errorMessage.innerText());
  83  |     //await this.errorMessage.waitFor(); // ensures element is attached
  84  |   //await expect(this.errorMessage).toHaveText(/Please accept the Terms/i);
  85  |     //await expect(this.errorMessage).toHaveText('Please accept the Terms & Conditions and Privacy Policy to continue');
  86  |   }//;
  87  | 
  88  | 
  89  |   async fillFirstName(firstName) {
  90  |     await expect(this.firstNameInput).toBeVisible();
  91  |     await this.firstNameInput.fill(firstName);
  92  |   }
  93  | 
  94  |   async fillLastName(lastName) {
  95  |     await expect(this.lastNameInput).toBeVisible();
  96  |     await this.lastNameInput.fill(lastName);
  97  |   }
  98  | 
  99  |   async fillEmail(email) {
  100 |     await expect(this.emailInput).toBeVisible();
  101 |     await this.emailInput.fill(email);
  102 |   }
  103 | 
  104 |   async fillPassword(password) {
  105 |     await expect(this.passwordInput).toBeVisible();
  106 |     await this.passwordInput.fill(password);
  107 |   }
  108 | 
  109 |   async verifyPasswordRulesVisible() {
  110 |     // Verify that password validation error messages are displayed
  111 |     // The form shows up to 3-4 validation errors depending on the password entered
  112 |     await expect(this.passwordValidationErrors).not.toHaveCount(0, { timeout: 5000 });
  113 |     
  114 |     // Just verify at least one password error is visible
  115 |     const count = await this.passwordValidationErrors.count();
  116 |     if (count > 0) {
  117 |       const firstError = this.registerPanel.locator('#signupform_password_help .ant-form-item-explain-error').first();
  118 |       await expect(firstError).toBeVisible();
  119 |     }
  120 |   }
  121 | 
  122 |   async clickSignUpButton() {
  123 |     await expect(this.signUpButton).toBeVisible();
  124 |     await expect(this.signUpButton).toBeEnabled();
  125 |     await this.signUpButton.click();
  126 |   }
  127 | 
  128 |   async verifyEmailVerificationPopupContains(email) {
  129 |     await expect(this.emailVerificationPopupTitle).toBeVisible({ timeout: 15000 });
> 130 |     await expect(this.emailVerificationPopupText).toContainText(email);
      |                                                   ^ Error: expect(locator).toContainText(expected) failed
  131 |   }
  132 | 
  133 |   async verifyPopupButtonsVisible() {
  134 |     await expect(this.popupResendButton).toBeVisible();
  135 |     await expect(this.popupLoginButton).toBeVisible();
  136 |   }
  137 | }
  138 | 
  139 | module.exports = { SignupPage };
```