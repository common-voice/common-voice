export const submitSingleSubmissionForm = () => {
  cy.get('[data-testid=public-domain-checkbox]').check()
  cy.get('[data-testid=single-submission-form]').submit()
}

export const typeSingleSubmission = ({
  sentence,
  shouldTypeCitation,
  shouldSelectDomain,
}: {
  sentence: string
  shouldTypeCitation?: boolean
  shouldSelectDomain?: boolean
}) => {
  cy.get('[data-testid=sentence-textarea]').type(sentence)

  if (shouldSelectDomain) {
    cy.get('[data-testid=sentence-domain-select]').click()
    // Select "General" as domain
    cy.get('[data-testid=general]').click()
  }

  if (shouldTypeCitation) {
    cy.get('[data-testid=citation-input]').type('self-citation')
  }
}
