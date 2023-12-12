export const submitSingleSubmissionForm = () => {
  cy.get('[data-testid=public-domain-checkbox]').check()
  cy.get('[data-testid=single-submission-form]').submit()
}

export const typeSingleSubmission = ({
  sentence,
  shouldTypeCitation,
}: {
  sentence: string
  shouldTypeCitation?: boolean
}) => {
  cy.get('[data-testid=sentence-textarea]').type(sentence)

  if (shouldTypeCitation) {
    cy.get('[data-testid=citation-input]').type('self-citation')
  }
}
