export const visitBulkSubmissionPage = () => {
  const testUserEmail = Cypress.env('test_user_email')
  const testUserPassword = Cypress.env('test_user_password')

  cy.login(testUserEmail, testUserPassword)
  cy.visit('/write')

  cy.get('[data-testid=bulk-option]').click()
  cy.contains('Upload public domain sentences')
}
