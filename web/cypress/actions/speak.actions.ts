export const recordFiveClips = () => {
  const recordButton = cy.get('[data-testid=record-button]')

  recordButton.should('exist')

  // click to record
  recordButton.click()
  // wait 5 seconds
  cy.wait(5000)
  // click again to stop recording
  recordButton.click()

  cy.wait(2000)

  // click to record
  recordButton.click()
  // wait 5 seconds
  cy.wait(5000)
  // click again to stop recording
  recordButton.click()

  cy.wait(2000)

  // click to record
  recordButton.click()
  // wait 5 seconds
  cy.wait(5000)
  // click again to stop recording
  recordButton.click()

  cy.wait(2000)

  // click to record
  recordButton.click()
  // wait 5 seconds
  cy.wait(5000)
  // click again to stop recording
  recordButton.click()

  cy.wait(2000)

  // click to record
  recordButton.click()
  // wait 5 seconds
  cy.wait(5000)
  // click again to stop recording
  recordButton.click()
}
