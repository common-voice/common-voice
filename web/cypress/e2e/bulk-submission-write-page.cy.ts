import { visitBulkSubmissionPage } from '../actions/bulk-submission-write-page.action'

describe('The Write Page - Bulk Submission', () => {
  it('loads bulk submission page', () => {
    visitBulkSubmissionPage()
  })

  it('uploads a file', () => {
    visitBulkSubmissionPage()

    // upload file
    cy.get('input[type=file]').attachFile('sample-bulk-submission.tsv')

    cy.get('[data-testid=public-domain-checkbox]').check()

    cy.get('[data-testid=submit-button]').click()

    cy.get('[data-testid=bulk-submission-success]').should('exist')
    cy.get('[data-testid=happy-mars]').should('exist')
    cy.contains('Thank you for contributing your bulk submission!')
  })

  it('accepts only .tsv files', () => {
    visitBulkSubmissionPage()

    // upload invalid json file
    cy.get('input[type=file]').attachFile('example.json')

    cy.contains('Try again by dragging your file here')
    cy.contains('Invalid file')
  })
})
