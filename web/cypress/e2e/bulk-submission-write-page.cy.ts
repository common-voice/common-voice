import { visitBulkSubmissionPage } from '../actions/bulk-submission-write-page.action'

// Retries are needed because the auth0 login flow is flaky
describe('The Write Page - Bulk Submission', () => {
  beforeEach(() => {
    visitBulkSubmissionPage()
  })

  it('uploads a file', { retries: { runMode: 3 } }, () => {
    // upload file
    cy.get('input[type=file]').attachFile('sample-bulk-submission.tsv')

    cy.get('[data-testid=public-domain-checkbox]').check()

    cy.get('[data-testid=submit-button]').click()

    cy.get('[data-testid=bulk-submission-success]').should('exist')
    cy.get('[data-testid=happy-mars]').should('exist')
    cy.contains('Thank you for contributing your bulk submission!')
  })

  it('accepts only .tsv files', { retries: { runMode: 3 } }, () => {
    // upload invalid json file
    cy.get('input[type=file]').attachFile('example.json')

    cy.contains('Try again by dragging your file here')
    cy.contains('Invalid file')
  })
})
