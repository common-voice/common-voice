describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:9000')

    cy.contains('Common Voice')
    cy.contains('Speak')
    cy.contains('Listen')
  })
})
