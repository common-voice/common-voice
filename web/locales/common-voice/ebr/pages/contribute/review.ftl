## REVIEW

sc-review-lang-not-selected = ɔ́n ne san ńcân brɛ a. Tɛmɛ ɔ́n ká <profileLink>hromɛn, hɔ́n phɔ́ bhwe</profileLink>ebhá chɛ́ hɔ́n sán ńcân.
sc-review-title = ɔ́n wɛsɛ́ ábhwetɔ́
sc-review-loading = ábhwetɔ́ osí nmɛ́n
sc-review-select-language = Tɛmɛ ɔ́n sán ńcân bɛn lóó ɔ́n wɛsɛ́ ábhwetɔ́
sc-review-no-sentences = á lé pɛ ábhwetɔ́ obhá wɛsɛ. Ɔ́n gɛ <addLink> ká ábhwetɔ́ nne thúbhɔ</addLink>.
sc-review-form-prompt =
    .message = Ole thu ńcân o wɛsɛ a, wú ɔ́n énɛn ɔ́n tɛ́ ló hɛ́nmɛn ?
sc-review-form-usage = ɔ́n tɛ́ khɔ́ ályénmɔn njɛ ochɛ́ sé olrɛ ábhwetɔ́. ɔ́n tɛ́ khɔ́ ámlánkhu njɛ ochɛ́ sé o phán ló ha. ɔ́n tɛ́ khɔ́ áthómɛn ochɛ́ sé olé cu granman. <strong>Júmán ɔ́n sáji li-ɔn, ló thú ékɛ olé lyalí hɔ́n!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = áchán-si: { $sentenceSource }
sc-review-form-button-reject = phán ha
sc-review-form-button-skip = hɛ́n khú hromɛn
sc-review-form-button-approve = dɛ́n do
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = ɔ́n gɛ khɔ́ gán-gán donɛ́n yí ó sɛn phɔ : { sc-review-form-button-approve-shortcut } lrɛ ábhwetɔ́, { sc-review-form-button-reject-shortcut } phán ha, { sc-review-form-button-skip-shortcut } hɛ́n khú hromɛn
sc-review-form-button-submit =
    .submitText = áwɛ́sɛ́ phúmɛn
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] á lé pɛ ábhwetɔ́ o wɛsɛ.
        [one] ábhwetɔ́ bɛn o wɛsɛ. Nansi !
       *[other] ábhwetɔ́ o wɛsɛ. Nansi !
    }
sc-review-form-review-failure = ábhwetɔ́ o wɛsɛ le gɛ tre nmwá-nmwá a. ɔ́n cu bre npi.
sc-review-link = áyí pɔ́pɔ́ wú

## REVIEW CRITERIA

sc-criteria-modal = ⓘ ábidí yí pɔ́pɔ́ wú
sc-criteria-title = ábidí yí pɔ́pɔ́ wú
sc-criteria-make-sure = ɔ́n wú nmwá-nmwá khɛ́n ábhwetɔ́ ekhɔ́ ábidí a bha hɛ́nmɛn ebhá :
sc-criteria-item-1 = á yɔn sâ lée olrɛ ábhwetɔ́ nmwá-nmwá.
sc-criteria-item-2 = á yɔn sâ lée olrɛ ábhwetɔ́ nmwá-nmwá.
sc-criteria-item-3 = á yɔn sâ lée olú ábhwetɔ́ nmwá-nmwá.
sc-criteria-item-4 = Kasé ábhwetɔ́ ekhɔ́ ábidí hromɛn, ɔ́n sɛ́n gán-gán donɛ́n yí a tre ályémɔn njɛ.
sc-criteria-item-5-2 = Kasé ábhwetɔ́ le khɔ́ ábidí a bha hɛn hromɛn-ɔn, ɔ́n sɛ́n gán-gán donɛ́n yí "phán ha" a tre ámlákhu njɛ. Kasé Kasé á le khwá hɔ́n hɛ́nmɛn lé, ɔ́n gɛ yɔ́ ká ló hɛ́nmɛn.
sc-criteria-item-6 = Kasé á lé cu pɛ ábhwetɔ́ ɔ́n ma wɛsɛ, tɛmɛ ɔ́n dɔnmán lo nmɔ́n lo gɛ ábhwetɔ́ bhɔ́ tho !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ɔ́n wɛsɛ wú <icon></icon> kasé ábhwetɔ́ tɛ cɛ́ɛ́ ńhwán-kán-mɛn
sc-review-rules-title = Wú ábhwetɔ́ lê ábidí ɔ́nmɔn li brɛn ?
sc-review-empty-state = áká nɛɛn, á lé pɛ ábhwetɔ́ obhá wɛsɛ ńcân lókɔn hromɛn.
report-sc-different-language = ńcân nankhɛ
report-sc-different-language-detail = ábhwetɔ́ khɛ́n mɛn cu mɛn kán-ɔn, ńcân nankhɛ hromɛn nɔn o khɔ lrɛ o.
sentences-fetch-error = Nkhrɛ bɛn wa ka ábhwetɔ́ khɛ́n o saji lrɛ hromɛn
review-error = Nkhrɛ bɛn wa ka ábhwetɔ́ khɛ́n o saji wɛsɛ hromɛn
review-error-rate-limit-exceeded = ɔ́n etɛ́ yí gbraa ban-ban. Tɛmɛ ɔ́n kwá phɔ́ lé ɔ́n cu kán ábhwetɔ́ lótɛɛ ɔ́n wɛsɛ wú khɛ́n á yɔn.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Lo éjrɛn yí nkhónkhó
sc-redirect-page-subtitle-1 = áyí écu ábhwetɔ́ yí tré sa lo gán-gán donɛ́n hromɛn yí ó che Common Voice. Cí nankhɛ ɔ́n gɛ  <writeURL>nrɛ</writeURL> ábhwetɔ́ bɛn<reviewURL>wɛsɛ</reviewURL> ábhwetɔ́ ndɔnndɔn Common Voice hromɛn.
sc-redirect-page-subtitle-2 = ɔ́n bhi lo bhwe okhɔ́<matrixLink>Matrix phɔ</matrixLink>, <discourseLink>Discourse phɔ</discourseLink> léka <emailLink>e-mail phɔ</emailLink>.
