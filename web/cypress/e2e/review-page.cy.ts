import { visitReviewPage } from '../actions/review-page.action'

describe('The Review Page', () => {
  beforeEach(() => {
    visitReviewPage()
  })

  it('votes yes', () => {
    cy.get('[data-testid=active-review-card]')
      .invoke('text')
      .then(text1 => {
        cy.get('[data-testid=yes-button]').click()

        cy.get('.notification-pill').contains('Yes')

        cy.get('[data-testid=active-review-card]')
          .invoke('text')
          .should(text2 => {
            // after voting the text should be different
            expect(text1).not.eq(text2)
          })
      })
  })

  it('votes no', () => {
    cy.get('[data-testid=active-review-card]')
      .invoke('text')
      .then(text1 => {
        cy.get('[data-testid=no-button]').click()

        cy.get('.notification-pill').contains('No')

        cy.get('[data-testid=active-review-card]')
          .invoke('text')
          .should(text2 => {
            // after voting the text should be different
            expect(text1).not.eq(text2)
          })
      })
  })

  it('skips', () => {
    cy.get('[data-testid=active-review-card]')
      .invoke('text')
      .then(text1 => {
        cy.get('[data-testid=skip-button]').click()

        cy.get('.notification-pill').contains('Skip')

        cy.get('[data-testid=active-review-card]')
          .invoke('text')
          .should(text2 => {
            // after skipping the text should be different
            expect(text1).not.eq(text2)
          })
      })
  })
})
