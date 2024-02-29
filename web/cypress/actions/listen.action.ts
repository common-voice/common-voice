export const listenToFiveClips = () => {
  const playButton = cy.get('[data-testid=play-button]')

  const yesButton = cy.get('[data-testid=vote-yes-button]')
  const noButton = cy.get('[data-testid=vote-no-button]')

  playButton.click()
  noButton.click()

  playButton.click()
  // wait for recording to finish before voting yes
  cy.wait(3000)
  yesButton.click()

  playButton.click()
  noButton.click()

  playButton.click()
  // wait for recording to finish before voting yes
  cy.wait(3000)
  yesButton.click()

  playButton.click()
  // wait for recording to finish before voting yes
  cy.wait(3000)
  yesButton.click()
}
