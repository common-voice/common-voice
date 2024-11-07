## REVIEW

sc-review-lang-not-selected = You have not selected any languages. Please go to your <profileLink>Profile</profileLink> to select languages.
sc-review-title = Vakyache Niyall (Review)
sc-review-loading = Vakio load zata…
sc-review-select-language = Bhas select kor vakio-cher niyall korpak.
sc-review-no-sentences = Niyall korpak anik vakio asona. <addLink>Anik vakio tumi ata ghalat!</addLink>
sc-review-form-prompt =
    .message = Reviewed sentences not submitted, are sure?
sc-review-form-usage = Vakyo mon'zur korpak davo vatten "swipe" kor. Bhair marpak uzvea vatten "swipe" kor. Soddpak voir swipe kor. <strong>Submit korpak visru naka!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Source: { $sentenceSource }
sc-review-form-button-reject = Bhair mar
sc-review-form-button-skip = Sodd
sc-review-form-button-approve = Monzur
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = H
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Tuven Keyboard Shortcut-ui vaporpak zata: { sc-review-form-button-approve-shortcut } Mon'zur korpak, { sc-review-form-button-reject-shortcut } Bhair marpak, { sc-review-form-button-skip-shortcut } soddpak
sc-review-form-button-submit =
    .submitText = Finish Review
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Koinchech vakio review zavunk na.
        [one] 1 vakia review zale.
       *[other] { $sentences } vakio review zale. Dev borem korum!
    }
sc-review-form-review-failure = Review could not be saved. Please try again later.
sc-review-link = Niyall

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Review/Niyall Korpache Nem
sc-criteria-title = Review Korpache Nem
sc-criteria-make-sure = Lakshant dovor ki vakio sokoll dille nem mantat:
sc-criteria-item-1 = The sentence must be spelled correctly.
sc-criteria-item-2 = The sentence must be grammatically correct.
sc-criteria-item-3 = The sentence must be speakable.
sc-criteria-item-4 = Vakio nem mantat, zalyar right-saidin &quot;Monzur&quot; button click kor.
sc-criteria-item-5-2 = Vakio voir dille nem mannun ghena zalyar, left-saidin &quot;Bhair mar&quot; button click kor. If you are unsure about the sentence, tuven ti vakia Soddun divche ani dusrem vakio-cher niyall korchem.
sc-criteria-item-6 = If you run out of sentences to review, anik vakio niyall korpak amchi moddot kor!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Check kor<icon></icon> ho vakia konknnin sarko asa?
sc-review-rules-title = Ho sentence guideline manun gheta?
sc-review-empty-state = There are currently no sentences to review in this language.
report-sc-different-language = Dusrech Bhas
report-sc-different-language-detail = It is written in a language different than what I’m reviewing.
sentences-fetch-error = An error occurred fetching sentences
review-error = An error occurred reviewing this sentence
review-error-rate-limit-exceeded = Tu chod fast voita. Anik ek second ghe sentence correct asa zalyar poloi.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = We're making some big changes
sc-redirect-page-subtitle-1 = The Sentence Collector is moving to the core Common Voice platform. You can now <writeURL>write</writeURL> a sentence or <reviewURL>review</reviewURL> single sentence submissions on Common Voice.
sc-redirect-page-subtitle-2 = Ask us questions on <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.
