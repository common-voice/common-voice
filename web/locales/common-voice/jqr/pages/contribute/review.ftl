## REVIEW

sc-review-lang-not-selected = You have not selected any languages. Please go to your <profileLink>Profile</profileLink> to select languages.
sc-review-title = Revisar Oraciones
sc-review-loading = Cargando oraciones...
sc-review-select-language = Elige un idioma para revisar oraciones
sc-review-no-sentences = No hay oraciones para revisar. <addLink>Añadir más oraciones ahora!</addLink>
sc-review-form-prompt =
    .message = Oraciones revisadas no enviadas, ¿está seguro?
sc-review-form-usage = Swipe right to approve the sentence. Swipe left to reject it. Swipe up to skip it. <strong>Do not forget to submit your review!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Source: { $sentenceSource }
sc-review-form-button-reject = Janiwsaña
sc-review-form-button-skip = Jark'aña
sc-review-form-button-approve = Jaysaña
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = J
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = You can also use Keyboard Shortcuts: { sc-review-form-button-approve-shortcut } to Approve, { sc-review-form-button-reject-shortcut } to Reject, { sc-review-form-button-skip-shortcut } to Skip
sc-review-form-button-submit =
    .submitText = Terminar Revisión
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No sentences reviewed.
        [one] 1 sentence reviewed. Thank you!
       *[other] { $sentences } sentences reviewed. Thank you!
    }
sc-review-form-review-failure = La revisión puede perderse. Por favor intente después
sc-review-link = Uñakipaña

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Review Criteria
sc-criteria-title = Review Criteria
sc-criteria-make-sure = Asegurar que la oración sigue los siguientes criterios:
sc-criteria-item-1 = La oración debe ser escrita correctamente.
sc-criteria-item-2 = La oración debe ser gramaticamente correcta.
sc-criteria-item-3 = La oración debe ser narrable
sc-criteria-item-4 = If the sentence meets the criteria, click the &quot;Approve&quot; button on the right.
sc-criteria-item-5-2 = If the sentence does not meet the above criteria, click the &quot;Reject&quot; button on the left. If you are unsure about the sentence, you may also skip it and move on to the next one.
sc-criteria-item-6 = Si ya no tienes oraciones para revisar, por favor ayudanos a conseguir más!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Check <icon></icon> is this a linguistically correct sentence?
sc-review-rules-title = Does the sentence meet the guidelines?
sc-review-empty-state = Ahora no hay oraciones para revisar en este idioma.
report-sc-different-language = Yaqha aru
report-sc-different-language-detail = Ukajj nayajj uñakiptʼaskta ukat sipansa yaqha arun qillqatawa
sentences-fetch-error = An error occurred fetching sentences
review-error = An error occurred reviewing this sentence
review-error-rate-limit-exceeded = You're going too fast. Please take a moment to review the sentence to make sure it's correct.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = We're making some big changes
sc-redirect-page-subtitle-1 = The Sentence Collector is moving to the core Common Voice platform. You can now <writeURL>write</writeURL> a sentence or <reviewURL>review</reviewURL> single sentence submissions on Common Voice.
sc-redirect-page-subtitle-2 = Ask us questions on <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.
# menu item
review-sentences = Revisar Oraciones
