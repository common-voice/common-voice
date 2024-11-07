## REVIEW

sc-review-lang-not-selected = You have not selected any languages. Please go to your <profileLink>Profile</profileLink> to select languages.
sc-review-title = Review Sentences
sc-review-loading = Loading sentences…
sc-review-select-language = Please select a language to review sentences.
sc-review-no-sentences = No sentences to review. <addLink>Add more sentences now!</addLink>
sc-review-form-prompt =
    .message = Reviewed sentences not submitted, are sure?
sc-review-form-usage = Swipe right to approve the sentence. Swipe left to reject it. Swipe up to skip it. <strong>Do not forget to submit your review!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Source: { $sentenceSource }
sc-review-form-button-reject = Reject
sc-review-form-button-skip = Skip
sc-review-form-button-approve = Approve
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = You can also use Keyboard Shortcuts: { sc-review-form-button-approve-shortcut } to Approve, { sc-review-form-button-reject-shortcut } to Reject, { sc-review-form-button-skip-shortcut } to Skip
sc-review-form-button-submit =
    .submitText = Finish Review
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No sentences reviewed.
        [one] 1 sentence reviewed. Thank you!
       *[other] { $sentences } sentences reviewed. Thank you!
    }
sc-review-form-review-failure = Review could not be saved. Please try again later.
sc-review-link = Review

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Review Criteria
sc-criteria-title = Review Criteria
sc-criteria-make-sure = Make sure the sentence meets the following criteria:
sc-criteria-item-1 = The sentence must be spelled correctly.
sc-criteria-item-2 = The sentence must be grammatically correct.
sc-criteria-item-3 = The sentence must be speakable.
sc-criteria-item-4 = If the sentence meets the criteria, click the &quot;Approve&quot; button on the right.
sc-criteria-item-5-2 = If the sentence does not meet the above criteria, click the &quot;Reject&quot; button on the left. If you are unsure about the sentence, you may also skip it and move on to the next one.
sc-criteria-item-6 = If you run out of sentences to review, please help us collect more sentences!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Check <icon></icon> is this a linguistically correct sentence?
sc-review-rules-title = Does the sentence meet the guidelines?
sc-review-empty-state = There are currently no sentences to review in this language.
report-sc-different-language = Different language
report-sc-different-language-detail = It is written in a language different than what I’m reviewing.
sentences-fetch-error = An error occurred fetching sentences
review-error = An error occurred reviewing this sentence
review-error-rate-limit-exceeded = You're going too fast. Please take a moment to review the sentence to make sure it's correct.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = We're making some big changes
sc-redirect-page-subtitle-1 = The Sentence Collector is moving to the core Common Voice platform. You can now <writeURL>write</writeURL> a sentence or <reviewURL>review</reviewURL> single sentence submissions on Common Voice.
sc-redirect-page-subtitle-2 = Ask us questions on <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.

# menu item
review-sentences = Review Sentences
