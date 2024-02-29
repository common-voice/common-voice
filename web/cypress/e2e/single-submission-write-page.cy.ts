import { fakerEN as faker, fakerRU } from '@faker-js/faker'

import {
  submitSingleSubmissionForm,
  typeSingleSubmission,
} from '../actions/single-submission-write-page.action'

const SENTENCE_LENGTH = 10

describe('The Write Page - Single Submission', () => {
  it('successfully loads', () => {
    cy.visit('/write')

    cy.get('[data-testid=write-page]').should('be.visible')
    cy.contains('Add a public domain sentence')

    // submission toggle is hidden because user is not logged in
    cy.get('[data-testid=sc-toggle]').should('not.exist')
  })

  it('adds a sentence', () => {
    cy.visit('/write')

    const randomSentence = faker.lorem.sentence(SENTENCE_LENGTH)

    // Type in the sentence and citation fields
    typeSingleSubmission({
      sentence: randomSentence,
      shouldTypeCitation: true,
    })

    submitSingleSubmissionForm()

    // assert text area is empty after adding a sentence
    cy.get('[data-testid=sentence-textarea]').should('have.value', '')

    cy.get('.notification-pill').contains('1 sentence collected')
  })

  it('adds a sentence with domain', () => {
    cy.visit('/write')

    const randomSentence = faker.lorem.sentence(SENTENCE_LENGTH)

    // Type in the sentence and citation fields and add a sentence domain
    typeSingleSubmission({
      sentence: randomSentence,
      shouldTypeCitation: true,
      shouldSelectDomain: true,
    })

    submitSingleSubmissionForm()

    // assert text area is empty after adding a sentence
    cy.get('[data-testid=sentence-textarea]').should('have.value', '')

    cy.get('.notification-pill').contains('1 sentence collected')
  })

  it('requires citation to add a sentence', () => {
    cy.visit('/write')

    const randomSentence = faker.lorem.sentence(SENTENCE_LENGTH)

    // Type in the sentence and citation fields
    typeSingleSubmission({
      sentence: randomSentence,
    })

    submitSingleSubmissionForm()

    // assert error message is visible
    cy.contains('Please fill out this field')

    // assert citation input has a red border
    cy.get('[data-testid=citation-input]').should(
      'have.css',
      'border-color',
      'rgb(255, 79, 94)'
    )

    // assert that the no citation rule shows the alert icon
    cy.get('[data-testid=error-no-citation]').should(
      'have.css',
      'list-style-image'
    )
  })

  it('prevents adding a sentence if it is too long', () => {
    cy.visit('/write')

    // sentences should be fewer than 15 words
    const longSentence = faker.lorem.sentence(20)

    // Type in the sentence and citation fields
    typeSingleSubmission({
      sentence: longSentence,
      shouldTypeCitation: true,
    })

    submitSingleSubmissionForm()

    cy.get('.notification-pill').contains('Error adding sentence')

    // assert that the too long rule shows the alert icon
    cy.get('[data-testid=error-too-long]').should(
      'have.css',
      'list-style-image'
    )
  })

  it('prevents adding a sentence with numbers', () => {
    cy.visit('/write')

    const alphanumericSentence = `${faker.lorem.sentence(
      10
    )} ${faker.number.int()}`

    typeSingleSubmission({
      sentence: alphanumericSentence,
      shouldTypeCitation: true,
    })

    submitSingleSubmissionForm()

    cy.get('.notification-pill').contains('Error adding sentence')

    cy.get('[data-testid=error-no-numbers-no-symbols]').should(
      'have.css',
      'list-style-image'
    )
  })

  it('prevents adding a sentence with special characters', () => {
    cy.visit('/write')

    const sentenceWithSpecialCharacters = `${faker.lorem.sentence(10)} %$#*`

    typeSingleSubmission({
      sentence: sentenceWithSpecialCharacters,
      shouldTypeCitation: true,
    })

    submitSingleSubmissionForm()

    cy.get('.notification-pill').contains('Error adding sentence')

    cy.get('[data-testid=error-no-numbers-no-symbols]').should(
      'have.css',
      'list-style-image'
    )
  })

  // We do validation for this rule for some languages e.g. Russian
  it('prevents adding a sentence with foreign script', () => {
    cy.visit('/ru/write')

    // foreign script respective to Russian
    const sentenceWithForeignScript = `${fakerRU.lorem.sentence(10)} abc`

    typeSingleSubmission({
      sentence: sentenceWithForeignScript,
      shouldTypeCitation: true,
    })

    submitSingleSubmissionForm()

    // Russian for error adding a sentence
    cy.get('.notification-pill').contains('Ошибка добавления предложения')

    cy.get('[data-testid=error-no-foreign-script]').should(
      'have.css',
      'list-style-image'
    )
  })
})
