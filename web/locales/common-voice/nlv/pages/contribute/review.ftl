## REVIEW

sc-review-lang-not-selected = Mach otikpejpenki se tlajtolkopa. Xikalaki kanin kijtoa <profileLink>Notech</profileLink> uan xikpejpena se tlajtolkopa.
sc-review-title = Xikmotili tlajtoli
sc-review-loading = Titlatlalijtokej...
sc-review-select-language = Xikonpejpena tlenon tlajtolkopa tikmotilis.
sc-review-no-sentences = Machitlaj onka tlen tikmotilis. <addLink>¡Xikintlalili okseki!</addLink>
sc-review-form-prompt =
    .message = Mach otiktitlanki tlen otikmotili, ¿kox kuali ijkon?
sc-review-form-usage = Xikpacho ikmoyekma tla kuali, ik mopochma tla mach, ik tlakpak tla tikpanauis. <strong>¡Mach xikilkaua xiktitlani tlen yotikmotili!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kajki itech: { $sentenceSource }
sc-review-form-button-reject = Xipojpolo
sc-review-form-button-skip = Xikpanaui
sc-review-form-button-approve = Yonpa
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = T
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = Noijki uelis san tikpachos itech moteclado: { sc-review-form-button-approve-shortcut } tla Yikuali, { sc-review-form-button-reject-shortcut } tla Tikpojpolos, { sc-review-form-button-skip-shortcut } tla Tikpanauis
sc-review-form-button-submit =
    .submitText = Xitlami
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Machitlaj tlajkuiloli yotikmotili.
        [one] { $sentences } tlajkuiloli yotikmotili. ¡Timitstlasojkamatiliaj!
       *[other] { $sentences } tlajkuiloli yotikinmotili. ¡Timitstlasojkamatiliaj!
    }
sc-review-form-review-failure = Itlaj omochi. Mach omokak. Teotlatki oksepa xikyeko.
sc-review-link = Xikmotili

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Tlen uan ken tikmotilis
sc-criteria-title = Tlen uan ken tikmotilis
sc-criteria-make-sure = Xikmotili tlajkuiloli mayeto ijki:
sc-criteria-item-1 = Tlajkuiloli moneki kuali okijkuilojkej.
sc-criteria-item-2 = Tlajkuiloli moneki yetos kuali, mach san ken nesi.
sc-criteria-item-3 = Tlajkuiloli monekis mach oui se kitenkixtis.
sc-criteria-item-4 = Tla tlajkuiloli kajki ken moneki, xikpacho kanin kijtoa &quot;Yikuali&quot; moyekma.
sc-criteria-item-5-2 = Tla tlajkuiloli mach kajki ken moneki, xikpacho &quot;Xikpojpolo&quot; mopochma. Tla mach tikmati kox kuali noso amo, uelis xikpanaui uan xikita okse.
sc-criteria-item-6 = Tla mach ok onka tlajkuiloli tlen tikmotilis, techpaleui. ¡Xikinmijkuilo okseki!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Xikmotili, <icon></icon>¿okijkuilojkej ken moneki?
sc-review-rules-title = ¿Okijkuilokej ken yotikijtojkaj moneki?
sc-review-empty-state = Axkantsin mach onka tlajkuiloli tlen tikmotilis ika nin tlajtolkopa.
report-sc-different-language = Nin okse tlajtolkopa.
report-sc-different-language-detail = Tlen okijkuilokej mach poui itech tlajtolkopa tlen nikmotilijtok.
sentences-fetch-error = Itlaj omochi. Mach uelis tiktlaliliskej tlajkuiloli.
review-error = Itlaj omochi. Mach uelis tikyektlaliliskej tlajkuiloli.
review-error-rate-limit-exceeded = Nesi semi totoka otikchi. Ximochia uan kuali xikmotili kox kuali noso mach.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tikinpatilijtokej miak tlamantli.
sc-redirect-page-subtitle-1 = Tlajkuilolnechikoli axkan kajki itech Common Voice. Axkan uelis<writeURL>tikijkuilos</writeURL>se tlamantli noso<reviewURL>tikmotilis</reviewURL> sejse tlajkuiloli non yokintlalilikej itech Common Voice.
sc-redirect-page-subtitle-2 = Techtlajtlani seki itech <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> noso <emailLink>email</emailLink>.
# menu item
review-sentences = Xikmotili tlajtoli
