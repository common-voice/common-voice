// Retries are needed because login with Auth0 is flaky
describe('Login', { retries: { runMode: 3 } }, () => {
  it('logs in a user', () => {
    const testUserEmail = Cypress.env('test_user_email')
    const testUserPassword = Cypress.env('test_user_password')

    cy.login(testUserEmail, testUserPassword)
  })
})
