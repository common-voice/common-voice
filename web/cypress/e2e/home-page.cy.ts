describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')

    cy.contains('Common Voice')
    cy.contains('Speak')
    cy.contains('Listen')
    cy.get('[data-testid=home]').should('exist')
  })
})
