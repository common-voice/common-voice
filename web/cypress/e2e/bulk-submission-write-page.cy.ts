require('dotenv').config({ path: '.env-local-docker' })

describe('The Write Page - Bulk Submission', () => {
  it('loads', () => {
    // TODO: can we store these values securely??
    cy.login('tolurotimi+40@hotmail.com', '5Qeng6f4irdzTn9')

    cy.visit('/write')
  })
})
