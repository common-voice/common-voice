import { recordFiveClips } from '../actions/speak.actions'

describe('The Speak Page', () => {
  it('successfully loads', () => {
    cy.visit('/speak')

    cy.get('[data-testid=speak]').should('exist')
  })

  it('can record a clip', () => {
    cy.visit('/speak')

    const recordButton = cy.get('[data-testid=record-button]')

    recordButton.should('exist')

    // click to record
    recordButton.click()

    // wait 5 seconds
    cy.wait(5000)

    // click again to stop recording
    recordButton.click()

    cy.get('[data-testid=instruction]').should(
      'have.text',
      'Great! Record your next clip'
    )
  })

  it('skips a clip', () => {
    cy.visit('/speak')

    const skipButton = cy.get('[data-testid=skip-button]')

    cy.get('[data-testid=card-1]')
      .invoke('text')
      .then(text1 => {
        skipButton.click()

        cy.get('[data-testid=card-1]')
          .invoke('text')
          .should(text2 => {
            // when skipped the contents of the card should be different
            expect(text1).not.eq(text2)
          })
      })
  })

  // This test fails on Firefox because it does not allow mic access for e2e tests
  // Also we need the retries because the authentication flow with auth0 is flaky
  it('submits (authenticated user)', { retries: { runMode: 3 } }, () => {
    const testUserEmail = Cypress.env('test_user_email')
    const testUserPassword = Cypress.env('test_user_password')

    cy.login(testUserEmail, testUserPassword)

    cy.visit('/speak')

    // should be able to see a card with a new sentence to record
    cy.get('[data-testid=card-1]')
      .invoke('text')
      .then(text1 => {
        recordFiveClips()

        cy.get('[data-testid=checkbox]').check()
        cy.get('[data-testid=speak-submit-form]').submit()

        cy.get('[data-testid=card-1]')
          .invoke('text')
          .should(text2 => {
            // the contents of the cards should be different
            expect(text1).not.eq(text2)
          })
      })
  })

  it('submits (unauthenticated user)', () => {
    cy.visit('/speak')

    // should be able to see a card with a new sentence to record
    cy.get('[data-testid=card-1]')
      .invoke('text')
      .then(text1 => {
        recordFiveClips()

        cy.get('[data-testid=checkbox]').check()
        cy.get('[data-testid=speak-submit-form]').submit()

        // first CTA should be visible
        cy.get('[data-testid=first-submission-cta]').should('exist')

        cy.get('[data-testid=continue-speaking-button]').click()

        // submit 5 clips again
        recordFiveClips()
        cy.get('[data-testid=speak-submit-form]').submit()

        // second CTA and Mars :) should be visible
        cy.get('[data-testid=second-submission-cta]').should('exist')
        cy.get('[data-testid=happy-mars]').should('exist')

        cy.get('[data-testid=continue-speaking-button]').click()

        cy.get('[data-testid=card-1]')
          .invoke('text')
          .should(text2 => {
            // the contents of the cards should be different
            expect(text1).not.eq(text2)
          })
      })
  })
})
