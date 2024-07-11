## REVIEW

sc-review-lang-not-selected = ⵓⵔ ⵜⵙⵜⵉⵢⵎ ⴽⵔⴰ ⵏ ⵜⵓⵜⵍⴰⵢⵜ. ⵎⴽ ⵜⵓⴼⴰⵎ, ⴷⴷⵡⴰⵜ ⵖⵔ <profileLink>ⵉⴼⵔⵙ</profileLink> ⵏⵏⵓⵏ ⵃⵎⴰ ⴰⴷ ⵜⵙⵜⵢⵎ ⵜⵓⵜⵍⴰⵢⵉⵏ.
sc-review-title = ⵙⵙⵉⵔⵎ ⵜⵉⵡⵉⵏⴰⵙ
sc-review-loading = ⴰⵣⴷⴰⵎ ⵏ ⵜⵡⵉⵏⴰⵙ…
sc-review-select-language = ⵎⴽ ⵜⵓⴼⵉⴷ, ⵙⵜⵢ ⴽⵔⴰ ⵏ ⵜⵓⵜⵍⴰⵢⵜ ⵃⵎⴰ ⴰⴷ ⵜⵙⵙⵉⵔⵎⴷ ⵜⵉⵡⵉⵏⴰⵙ.
sc-review-no-sentences = ⵡⴰⵍⵓ ⵜⵉⵡⵉⵏⴰⵙ ⵉ ⵓⵙⵙⵉⵔⵎ. <addLink>ⵔⵏⵓ ⵓⴳⴳⴰⵔ ⵏ ⵜⵡⵉⵏⴰⵙ ⴷⵖⵉ!</addLink>
sc-review-form-prompt =
    .message = ⵓⵔ ⵜⵜⵢⴰⵣⴰⵏⵏⵜ ⵜⵡⵉⵏⴰⵙ ⵜⵜⵢⴰⵔⴰⵎⵏⵉⵏ, ⵜⵅⵙⴷ ⴰⴷ ⵜⵙⵎⴷⴷ?
sc-review-form-usage = ⵙⵓⵛⵛⴹⴰⵜ ⵖⵔ ⵓⴼⴰⵙⵉ ⵃⵎⴰ ⴰⴷ ⵜⵙⵙⴳⵍⵢⵎ ⵜⴰⵡⵉⵏⵙⵜ. ⵙⵓⵛⵛⴹⴰⵜ ⵖⵔ ⵓⵥⵍⵎⴰⴹ ⵃⵎⴰ ⴰⴷ ⵜⵜ ⵜⴰⴳⵢⵎ. ⵙⵓⵛⵛⴹⴰⵜ ⵖⵔ ⵓⴼⵍⵍⴰ ⵃⵎⴰ ⴰⴷ ⵜⵜ ⵜⵙⵙⵉⵏⴼⵎ. <strong>ⴰⴷ ⵓⵔ ⵜⴻⵜⵜⵓⵎ ⴰⴷ ⵜⴰⵣⵏⵎ ⴰⵙⵙⵉⵔⵎ ⵏⵏⵓⵏ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ⴰⵙⴰⴳⵎ: { $sentenceSource }
sc-review-form-button-reject = ⴰⴳⵢ
sc-review-form-button-skip = ⵙⵙⵉⵏⴼ
sc-review-form-button-approve = ⵙⵙⴳⵍⵢ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ⵢ
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ⵓ
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ⵏ
sc-review-form-keyboard-usage-custom = ⵜⵣⵎⵔⴷ ⴰⵡⴷ ⴰⴷ ⵜⵙⵙⵎⵔⵙⴷ ⵉⵙⵓⵏⴰⴼ ⵏ ⵓⵏⴰⵙⵉⵡ: { sc-review-form-button-approve-shortcut } ⵉ ⵙⵙⴳⵍⵢ, { sc-review-form-button-reject-shortcut } ⵉ ⴰⴳⵢ, { sc-review-form-button-skip-shortcut } ⵉ ⵙⵙⵉⵏⴼ
sc-review-form-button-submit =
    .submitText = ⵙⵎⴷ ⴰⵙⵙⵉⵔⵎ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ⵡⴰⵍⵓ ⵜⵉⵡⵉⵏⴰⵙ ⵜⵜⵢⴰⵔⴰⵎⵏⵉⵏ.
        [one] 1 ⵜⵡⵉⵏⵙⵜ ⵉⵜⵜⵢⴰⵔⴰⵎⵏ. ⵜⴰⵏⵎⵎⵉⵔⵜ!
       *[other] { $sentences } ⵜⵡⵉⵏⴰⵙ ⵜⵜⵢⴰⵔⴰⵎⵏⵉⵏ. ⵜⴰⵏⵎⵎⵉⵔⵜ!
    }
sc-review-form-review-failure = ⵓⵔ ⵏⵣⵎⵉⵔ ⴰⴷ ⵏⵃⴹⵓ ⴰⵙⵙⵉⵔⵎ. ⵎⴽ ⵜⵓⴼⴰⵎ, ⴰⵔⵎⴰⵜ ⴷⴰⵖ ⴽⵓⴷⵏⵏⴰ.
sc-review-link = ⵙⵙⵉⵔⵎ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ ⵉⵙⴱⴷⴰⴷⵏ ⵏ ⵓⵙⵙⵉⵔⵎ
sc-criteria-title = ⵉⵙⴱⴷⴰⴷⵏ ⵏ ⵓⵙⵙⵉⵔⵎ
sc-criteria-make-sure = ⵃⵇⵇⴰ ⵎⴰⵙ ⴷ ⵜⵎⵙⴰⵙⴰ ⵜⵡⵉⵏⵙⵜ ⴷ ⵉⵙⴱⴷⴰⴷⵏ ⵓⴹⴼⵉⵕⵏ:
sc-criteria-item-1 = ⵉⵇⵇⴰⵏ ⴷ ⴰⴷ ⵢⴰⵖⴷ ⵓⵙⵏⵎⴰⵔⵔⴰ ⵏ ⵜⵡⵉⵏⵙⵜ.
sc-criteria-item-2 = ⵉⵇⵇⴰⵏ ⴷ ⴰⴷ ⵜⴰⵖⴷ ⵜⵊⵕⵕⵓⵎⵜ ⵏ ⵜⵡⵉⵏⵙⵜ.
sc-criteria-item-3 = ⵉⵇⵇⴰⵏ ⴷ ⴰⴷ ⵜⵖⴰⵢ ⵜⵡⵉⵏⵙⵜ ⴰⴷ ⵜⴻⵜⵜⵓⵏⵏⴰ.
sc-criteria-item-4 = ⵎⴽ ⴷ ⵜⵎⵙⴰⵙⴰ ⵜⵡⵉⵏⵙⵜ ⴷ ⵉⵙⴱⴷⴰⴷⵏ, ⴽⵍⵉⴽⵉ ⵅⴼ ⵓⴱⵔⴰ &quot;ⵙⵙⴳⵍⵢ&quot; ⴳ ⵓⴼⴰⵙⵉ.
sc-criteria-item-5-2 = ⵎⴽ ⴷ ⵓⵔ ⵜⵎⵙⴰⵙⴰ ⵜⵡⵉⵏⵙⵜ ⴷ ⵉⵙⴱⴷⴰⴷⵏ ⵏⵏⵉⴳ ⴷⴰ, ⴽⵍⵉⴽⵉ ⵅⴼ ⵓⴱⵔⴰ &quot;ⴰⴳⵢ&quot; ⴳ ⵓⵥⵍⵎⴰⴹ. ⵎⴽ ⵓⵔ ⵜⵃⵇⵇⴰⴷ ⴳ ⵜⵡⵉⵏⵙⵜ, ⵜⵖⵉⵢⴷ ⴰⵡⴷ ⴰⴷ ⵜⵜ ⵜⵙⵙⵉⵏⴼⴷ, ⵜⵎⵎⵓⵜⵜⵉⴷ ⵖⵔ ⵜⵓⴹⴼⵉⵕⵜ.
sc-criteria-item-6 = ⵎⴽ ⴰⵡⵏ ⵙⵎⴰⵔⵏⵜ ⵜⵡⵉⵏⴰⵙ ⵎ'ⴰⴷ ⵜⵙⵙⵉⵔⵉⵎⵎ, ⵎⴽ ⵜⵓⴼⴰⵎ, ⴰⵡⵙⴰⵜ ⴰⵏⵖ ⴰⴷ ⵏⴳⵔⵓ ⵓⴳⴳⴰⵔ ⵏ ⵜⵡⵉⵏⴰⵙ!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ⵛⴰⴱⴱⴰ <icon></icon> ⵉⵙ ⵜⵓⵖⴷ ⵜⵡⵉⵏⵙⵜ ⴰ ⵙ ⵓⵎⵙⵏⵉⵍⵙ?
sc-review-rules-title = ⵉⵙ ⴷ ⵜⵎⵙⴰⵙⴰ ⵜⵡⵉⵏⵙⵜ ⴰⴽⴷ ⵜⴰⵔⴰⵜⵉⵏ?
sc-review-empty-state = ⵓⵔ ⵜⵍⵍⵉ ⵙ ⵓⵎⵉⵔⴰⵏ ⵓⵍⴰ ⴽⵔⴰ ⵏ ⵜⵡⵉⵏⵙⵜ ⵉ ⵓⵙⵙⵉⵔⵎ ⵙ ⵜⵓⵜⵍⴰⵢⵜ ⴰ.
report-sc-different-language = ⵜⵓⵜⵍⴰⵢⵜ ⵉⵎⵣⴰⵔⴰⵢⵏ
report-sc-different-language-detail = ⵜⴻⵜⵜⵢⴰⵔⴰ ⵙ ⵢⴰⵜ ⵜⵓⵜⵍⴰⵢⵜ ⵉⵎⵣⴰⵔⴰⵢⵏ ⵅⴼ ⵜⴰⴷⴰ ⵙⵙⵉⵔⵉⵎⵖ.
sentences-fetch-error = ⵜⵊⵕⴰ ⵢⴰⵜ ⵜⵣⴳⵍⵜ ⴽⵓⴷⵏⵏⴰ ⴷ ⵏⵜⵜⴰⵡⵢ ⵜⵉⵡⵉⵏⴰⵙ
review-error = ⵜⵊⵕⴰ ⵢⴰⵜ ⵜⵣⴳⵍⵜ ⴳ ⵓⵙⵙⵉⵔⵎ ⵏ ⵜⵡⵉⵏⵙⵜ ⴰ
review-error-rate-limit-exceeded = ⵍⴰ ⵜⴻⵜⵜⴷⴷⵓⴷ ⵙ ⴽⵉⴳⴰⵏ ⵏ ⵜⴰⵣⵣⵍⴰ. ⵎⴽ ⵜⵓⴼⵉⴷ ⴰⵎⵥ ⵢⴰⵜ ⵜⵉⵣⵉ ⵃⵎⴰ ⴰⴷ ⵜⵙⵙⵉⵔⵎⴷ ⵜⵓⵙⵙⵉⴼⵜ ⵃⵎⴰ ⴰⴷ ⵜⵃⵇⵇⴰⴷ ⵉⵙ ⵜⵓⵖⴷ.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ⵍⴰ ⵏⵙⴽⴰⵔ ⴽⵔⴰ ⵏ ⵉⵙⵏⴼⵍⵏ ⵉⵎⵇⵇⵔⴰⵏⵏ
sc-redirect-page-subtitle-1 = ⵔⴰⴷ ⵉⵎⵎⵓⵜⵜⵢ ⵙⴰⵏⵜⵏⵙ ⴽⵓⵍⵉⴽⵜⵓⵔ ⵖⵔ ⵜⵙⵉⵍⴰ ⵜⴰⴷⵙⵍⴰⵏⵜ ⵏ ⴽⴰⵎⵏⴼⵓⵢⵙ. ⵜⵣⵎⵔⴷ ⴷⵖⵉ <writeURL>ⴰⴷ ⵜⴰⵔⴰⴷ</writeURL> ⴽⵔⴰ ⵏ ⵜⵡⵉⵏⵙⵜ ⵏⵉⵖ <reviewURL>ⴰⴷ ⵜⵙⵙⵉⵔⵎⴷ</reviewURL> ⴰⵣⴰⵏⵏ ⵏ ⵜⵡⵉⵏⵙⵜ ⵜⴰⴼⵔⴷⵉⵜ ⴳ ⴽⴰⵎⵏⴼⵓⵢⵙ.
sc-redirect-page-subtitle-2 = ⵙⵇⵙⴰ ⴰⵏⵖ ⵉⵙⵇⵙⵉⵜⵏ ⴳ <matrixLink>ⵎⵉⵜⵔⵉⴽⵙ</matrixLink>, <discourseLink>ⴷⵉⵙⴽⵓⵔⵙ</discourseLink> ⵏⵉⵖ <emailLink>ⵉⵎⴰⵢⵍ</emailLink>.
