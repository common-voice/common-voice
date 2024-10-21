## REVIEW

sc-review-lang-not-selected = Amo otikpejpenki se tlajtolkopa. Xikalaki kanin kijtoa <profileLink>Notech</profileLink> uan xikpejpena se tlajtolkopa.
sc-review-title = Xikmotili tlajtoli
sc-review-loading = Tikintlalijtokej...
sc-review-select-language = Xikonpejpena tlen tlajtolkopa tikmotilis.
sc-review-no-sentences = Amitlaj moneki tikmotilis. <addLink>¡Xikintlalili okseki!</addLink>
sc-review-form-prompt =
    .message = Amo otiktitlanili tlen otikmotili, ¿kuali ijkon?
sc-review-form-usage = Xikpacho ikmoyekma tla kuali, ik mopochma tla amo, ik tlakpak tla tikpanauis. <strong>¡Amo xikillkaua xiktitlani tlen yotikmotili!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kisa itech: { $sentenceSource }
sc-review-form-button-reject = Xipojpolo
sc-review-form-button-skip = Xikpanaui
sc-review-form-button-approve = Yikuali
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = K
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = A
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = Noijki uelis san tikpachos itech moteclado: { sc-review-form-button-approve-shortcut } tla Yikuali, { sc-review-form-button-reject-shortcut } tla Tikpojpolos, { sc-review-form-button-skip-shortcut } tla Tikpanauis
sc-review-form-button-submit =
    .submitText = Xitlami
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Amitlaj otikmotili.
        [one] 1 tlajtoli otikmotili. ¡Timitstlasojkamatiliaj!
       *[other] { $sentences } tlajtoli otikinmotili. ¡Timitstlasojkamatiliaj!
    }

## REVIEW CRITERIA

