export const submitSingleSubmissionForm = () => {
  cy.get('[data-testid=public-domain-checkbox]').check()
  cy.get('[data-testid=single-submission-form]').submit()
}

type SingleSubmissionParams = {
  sentence: string
  shouldTypeCitation?: boolean
  shouldSelectDomain?: boolean
  shouldSelectVariant?: boolean
}

export const typeSingleSubmission = ({
  sentence,
  shouldTypeCitation,
  shouldSelectDomain,
  shouldSelectVariant,
}: SingleSubmissionParams) => {
  cy.get('[data-testid=sentence-textarea]').type(sentence)

  if (shouldSelectDomain) {
    cy.get('[data-testid=multiple-combobox-dropdown]').click()
    // Select "General" as domain
    cy.get('[data-testid=general]').click()
  }

  if (shouldSelectVariant) {
    cy.get('[data-testid=select-toggle-btn]').click()
    // select second element in dropdown
    cy.get('[data-testid=select-items-list] > li').eq(1).click()
  }

  if (shouldTypeCitation) {
    cy.get('[data-testid=citation-input]').type('self-citation')
  }
}
