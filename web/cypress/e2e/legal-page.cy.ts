describe('Legal pages', () => {
  it('loads privacy page', () => {
    cy.visit('/')

    cy.get('[data-testid=privacy-link]').click()

    cy.get('[data-testid=privacy]').should('exist')
    cy.contains('Common Voice Privacy Notice')
    cy.contains('Effective August 15, 2019')
    cy.contains('Privacy')
    cy.contains('Demographic data')
    cy.contains('Account data')
    cy.contains('Newsletter')
    cy.contains('Voice Recordings')
    cy.contains('Text')
    cy.contains('Interaction data')
    cy.contains('Technical data')
  })

  it('loads terms page', () => {
    cy.visit('/')

    cy.get('[data-testid=terms-link]').click()

    cy.get('[data-testid=terms]').should('exist')
    cy.contains('Common Voice Legal Terms')
    cy.contains('Effective November 30, 2018')
    cy.contains('Eligibility')
    cy.contains('Your Contributions')
    cy.contains('Your Account')
    cy.contains('Communications')
    cy.contains('Disclaimers')
    cy.contains('Notices of Infringement')
    cy.contains('Updates')
    cy.contains('Termination')
    cy.contains('Governing Law')
  })
})
