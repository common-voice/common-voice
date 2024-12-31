export const visitReviewPage = () => {
  const testUserEmail = Cypress.env('test_user_email')
  const testUserPassword = Cypress.env('test_user_password')

  cy.visit('/')

  cy.get('[data-testid=login-button]').click()

  cy.origin(
    Cypress.env('auth0_domain'),
    { args: { email: testUserEmail, password: testUserPassword } },
    ({ email, password }) => {
      cy.get('input[name=username]').type(email)

      cy.get('input[name=password]').type(`${password}`, {
        log: false,
      })

      cy.get('[data-action-button-primary=true]').click()
    }
  )

  cy.visit('/review')

  cy.get('[data-testid=review-page]', { timeout: 10000 }).should('be.visible')

  cy.contains('Check is this a linguistically correct sentence?')
}
