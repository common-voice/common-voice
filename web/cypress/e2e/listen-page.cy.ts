describe('The Listen Page', () => {
  // TODO: create clips before running tests
  it('successfully loads', () => {
    cy.visit('/listen')

    cy.get('[data-testid=listen]').should('exist')
  })

  it('can listen to a clip', () => {
    cy.visit('/listen')

    const playButton = cy.get('[data-testid=play-button]').should('exist')
    playButton.click()
  })
})
