export const theInternetCredentials = {
  valid: { username: 'tomsmith', password: 'SuperSecretPassword!' },
  invalidUsername: { username: 'wronguser', password: 'SuperSecretPassword!' },
  invalidPassword: { username: 'tomsmith', password: 'wrongpassword' },
};

export const saucedemoUsers = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performanceGlitch: { username: 'performance_glitch_user', password: 'secret_sauce' },
  error: { username: 'error_user', password: 'secret_sauce' },
  visual: { username: 'visual_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
};

// Real catalog prices, verified against standard_user - used to detect BUG-EX2-007
// (visual_user displays incorrect prices for every product).
export const realProductPrices: Record<string, number> = {
  'Sauce Labs Backpack': 29.99,
  'Sauce Labs Bike Light': 9.99,
  'Sauce Labs Bolt T-Shirt': 15.99,
  'Sauce Labs Fleece Jacket': 49.99,
  'Sauce Labs Onesie': 7.99,
  'Test.allTheThings() T-Shirt (Red)': 15.99,
};

export const validCheckoutInfo = {
  firstName: 'Alfred',
  lastName: 'Polanco',
  postalCode: '10001',
};
