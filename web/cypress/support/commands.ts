// @ts-check
/// <reference types="../global.d.ts" />

import 'cypress-file-upload'

/**
 * Logs in a user with username and password
 */

// Currently this test is a bit flaky on Chrome
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(`auth0-${email}`, () => {
    cy.visit('/')
    cy.get('[data-testid=login-button]').click()

    cy.origin(
      Cypress.env('auth0_domain'),
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
})
