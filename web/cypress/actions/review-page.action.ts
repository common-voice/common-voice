// TODO: fix login
export const visitReviewPage = () => {
  const testUserEmail = Cypress.env('test_user_email')
  const testUserPassword = Cypress.env('test_user_password')

  cy.visit('/review')

  cy.origin(
    Cypress.env('auth0_domain'),
    { args: { email: testUserEmail, password: testUserPassword } },
    ({ email, password }) => {
      cy.get('input[name=username]').type(email)

      // {enter} causes the form to submit
      cy.get('input[name=password]').type(`${password}{enter}`, {
        log: false,
      })
    }
  )

  cy.get('[data-testid=review-page]', { timeout: 10000 }).should('be.visible')

  cy.contains('Check is this a linguistically correct sentence?')
}
