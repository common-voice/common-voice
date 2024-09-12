## REVIEW

sc-review-lang-not-selected = a suɓay ɗenŋal gom. Naatu der <profileLink> ko yaalanima </profileLink> gam suɓugo ɗelle goɗɗe
sc-review-title = daaritaago konŋi
sc-review-loading = wattirgo konŋi...
sc-review-select-language = suɓu ɗenŋal gam darira konŋi
sc-review-no-sentences = konŋol daaritinteekol wala. Ɓeedu <addLink> konŋi goɗɗi <addLink>.
sc-review-form-prompt =
    .message = konŋi daaritaɗi liddaaka, a jokkam naa?
sc-review-form-usage = taatin far wecce nyaamo go nootoɗa konŋol ŋol. taatin far wecce nanon go saloɗa. taatin far dow gam accitingo. <strong> ta yeggitin liddugo golle maytitaaki ! </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = wunduwol : { $sentenceSource }
sc-review-form-button-reject = salaago
sc-review-form-button-skip = yawtugo
sc-review-form-button-approve = notaago
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = a wawan gollira tigge taytago : { sc-review-form-button-approve-shortcut } gam jaɓugo, { sc-review-form-button-reject-shortcut } gam salaago, { sc-review-form-button-skip-shortcut } gam yawtugo
sc-review-form-button-submit =
    .submitText = daaritaɗe henyi
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] konŋol baa gootol daaritaaka.
        [one] konŋol daaritaakol. Yetti !  *
       *[other] konŋol daaritaakol. Yetti !
    }
sc-review-form-review-failure = daaritaaɗe waway nanŋineego. Waɗita ɓawoni.
sc-review-link = maytitaaɗe

## REVIEW CRITERIA

sc-criteria-modal = sariyaaji maytitaago
sc-criteria-title = sariyaaji maytitaago
sc-criteria-make-sure = laaɓinee no konŋol e tokki sariyaaji :
sc-criteria-item-1 = konŋol haani winne no haaniri
sc-criteria-item-2 = sey konŋol ŋol  e ɗoytani sariyaji binni
sc-criteria-item-3 = sey konŋol ŋol e bato
sc-criteria-item-4 = to konŋol et tokki sariyaji, ɗeɗɗu tiggere « notaago »  wecco nyaamo
sc-criteria-item-5-2 = to konŋol tokka sariyaaji limtaaɗi dowdowre, ɗeɗɗu tiggere salaago far nanon. To aa seka boo, accu konŋol ŋol dem yawta to kol yeeso.
sc-criteria-item-6 = to a wala konŋi daaritinteeɗi, wallu men heɓugo konŋi
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = daaritaago <icon></icon> naa konŋol e fonniti dow sariya binni
sc-review-rules-title = konŋol ŋol e yaada e ƴanɗe mum ?
sc-review-empty-state = konŋol gom wala daaritinteŋol jonta  der ɗenŋal gal.
report-sc-different-language = ɗenŋal gom
report-sc-different-language-detail = ɗenŋal ŋam janŋan mi bane konŋol ŋol winnira.
sentences-fetch-error = farakere gom wari de men jaɓitoto  konŋi
review-error = farakere gom waɗaama de men daaritoto konŋol
review-error-rate-limit-exceeded = aa yaha lallaw. Ettu wakkati seɗɗam gam limitaago konŋol dem paama naa e kol forti.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = em waɗi wattirki gasuki
sc-redirect-page-subtitle-1 = kawritol konŋi e sottinaa far plateforme Common Voice. Jooni om wawan <writeURL>  winnugo <writeURL> konŋol naa bo <writeURL> daaritaago <writeURL> konŋi illa Common Voice.
sc-redirect-page-subtitle-2 = ƴamu ƴamɗe  ma dow  <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> na bo <emailLink> e e-mail</emailLink>.
