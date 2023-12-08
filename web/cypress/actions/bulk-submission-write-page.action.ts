export const visitBulkSubmissionPage = () => {
  const testUserEmail = Cypress.env('testUserEmail')
  const testUserPassword = Cypress.env('testUserPassword')

  cy.login(testUserEmail, testUserPassword)
  cy.visit('/write')

  cy.get('[data-testid=bulk-option]').click()
  cy.contains('Upload public domain sentences')
}
