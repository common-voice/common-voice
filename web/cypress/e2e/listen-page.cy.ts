import { listenToFiveClips } from '../actions/listen.action'

describe('The Listen Page', () => {
  it('successfully loads', () => {
    cy.visit('/listen')

    cy.get('[data-testid=listen]').should('exist')
  })

  it('can listen to a clip', () => {
    cy.visit('/listen')

    const playButton = cy.get('[data-testid=play-button]')

    playButton.should('exist')

    // assert video is paused
    cy.get('audio').should('have.prop', 'paused', true)

    playButton.click()

    // assert video is playing
    cy.get('audio').should('have.prop', 'paused', false)
  })

  it('votes yes', () => {
    cy.visit('/listen')

    const yesButton = cy.get('[data-testid=vote-yes-button]')

    // assert yes and no buttons should be disabled before listening to a clip
    yesButton.should('be.disabled')

    const playButton = cy.get('[data-testid=play-button]')

    playButton.click()

    cy.wait(3000)

    // vote yes
    yesButton.click()

    cy.get('[data-testid=instruction]').should(
      'have.text',
      "Great work! Listen again when you're ready"
    )
  })

  it('votes no', () => {
    cy.visit('/listen')

    const playButton = cy.get('[data-testid=play-button]')
    const noButton = cy.get('[data-testid=vote-no-button]')

    // play the next clip
    playButton.click()

    // vote no
    noButton.click()

    cy.get('[data-testid=instruction]').should(
      'have.text',
      "Great work! Listen again when you're ready"
    )
  })

  it('skips a clip', () => {
    cy.visit('/listen')

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

  it('listens to 5 clips', () => {
    cy.visit('/listen')

    listenToFiveClips()

    const successPage = cy.get('[data-testid=contribution-success]')
    successPage.should('exist')

    const contributeMoreButton = cy.get('[data-testid=contribute-more-button]')

    contributeMoreButton.click()

    // expect card to be visible
    cy.get('[data-testid=card-1]').should('exist')
  })
})
