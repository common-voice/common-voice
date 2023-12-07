// @ts-check
/// <reference types="../global.d.ts" />

/**
 * Logs in a user with username and password
 */

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/')
  cy.get('[data-testid=login-button]').click()

  cy.origin(
    Cypress.env('auth0Domain'),
    { args: { email, password } },
    ({ email, password }) => {
      cy.get('input[name=username]').type(email)

      // {enter} causes the form to submit
      cy.get('input[name=password]').type(`${password}{enter}`, {
        log: false,
      })
    }
  )

  cy.get('[data-testid=user-menu]').should('exist')
})
