## REVIEW

sc-review-lang-not-selected = You have not selected any languages. Please go to your <profileLink>Profile</profileLink> to select languages.
sc-review-title = tsu natóow weí yóo x̱'atánk
sc-review-loading = Loading sentences…
sc-review-select-language = Please select a language to review sentences.
sc-review-no-sentences = Yeedát, tlél ḵustí yées yóo x̱'atánk yáa ḵaa yóo x̱'atángi yís. <addLink>Add more sentences now!</addLink>
sc-review-form-prompt =
    .message = Reviewed sentences not submitted, are sure?
sc-review-form-usage = Swipe right to approve the sentence. Swipe left to reject it. Swipe up to skip it. <strong>Do not forget to submit your review!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = yéi yadudziḵaayi át: { $sentenceSource }
sc-review-form-button-reject = Reject
sc-review-form-button-skip = ḵut nasg̱éex'
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
