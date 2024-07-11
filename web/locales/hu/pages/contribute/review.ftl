## REVIEW

sc-review-lang-not-selected = Nem választott ki egyetlen nyelvet sem. A nyelvek kiválasztásához ugorjon a <profileLink>profiljához</profileLink>.
sc-review-title = Mondatok ellenőrzése
sc-review-loading = Mondatok betöltése…
sc-review-select-language = Válasszon nyelvet a mondatok ellenőrzéséhez.
sc-review-no-sentences = Nincsenek ellenőrizendő mondatok. <addLink>Adjon hozzá további mondatokat.</addLink>
sc-review-form-prompt =
    .message = Az ellenőrzött mondatokat nem küldte be, biztos benne?
sc-review-form-usage = Csúsztassa jobbra a mondat jóváhagyásához. Csúsztassa balra az elutasításhoz. Csúsztassa felfelé az átugráshoz. <strong>Ne felejtse el elküldeni az ellenőrzés eredményét.</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Forrás: { $sentenceSource }
sc-review-form-button-reject = Elutasítás
sc-review-form-button-skip = Kihagyás
sc-review-form-button-approve = Jóváhagyás
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = I
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = K
sc-review-form-keyboard-usage-custom = Billentyűparancsokat is használhat: { sc-review-form-button-approve-shortcut } a jóváhagyáshoz, { sc-review-form-button-reject-shortcut } az elutasításhoz, { sc-review-form-button-skip-shortcut } a kihagyáshoz
sc-review-form-button-submit =
    .submitText = Ellenőrzés befejezése
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Egyetlen mondat sem lett ellenőrizve.
        [one] 1 mondat ellenőrizve. Köszönjük!
       *[other] { $sentences } mondat ellenőrizve. Köszönjük!
    }
sc-review-form-review-failure = Az ellenőrzés mentése nem sikerült. Próbálja újra később.
sc-review-link = Ellenőrzés

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Ellenőrzési szempontok
sc-criteria-title = Ellenőrzési szempontok
sc-criteria-make-sure = Győződjön meg arról, hogy a mondat megfelel a következő kritériumoknak:
sc-criteria-item-1 = A mondatok helyesen vannak leírva.
sc-criteria-item-2 = A mondatok nyelvtanilag helyesek.
sc-criteria-item-3 = A mondatok kimondhatók.
sc-criteria-item-4 = Ha a mondat megfelel a feltételeknek, kattintson a „Jóváhagyás” gombra a jobb oldalon.
sc-criteria-item-5-2 = Ha a mondat nem felel meg a fenti feltételeknek, kattintson a bal oldali „Elutasítás” gombra. Ha nem biztos a mondatban, akkor ki is hagyhatja, és továbbléphet a következőre.
sc-criteria-item-6 = Ha elfogynak az ellenőrizhető mondatok, akkor segítsen további mondatok összegyűjtésében.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ellenőrizze <icon></icon>, hogy ez egy nyelvileg helyes mondat-e?
sc-review-rules-title = A mondat megfelel az irányelveknek?
sc-review-empty-state = Jelenleg nincsenek ellenőrizendő mondatok ezen a nyelven.
report-sc-different-language = Más nyelv
report-sc-different-language-detail = Ez más nyelven íródott, mint amit ellenőrzök.
sentences-fetch-error = Hiba történt a mondatok lekérése során
review-error = Hiba történt a mondat ellenőrzése során
review-error-rate-limit-exceeded = Túl gyorsan halad. Szánjon rá egy kis időt a mondat helyességének ellenőrzésére.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Néhány nagy változtatást vezetünk be
sc-redirect-page-subtitle-1 = A mondatgyűjtő átköltözik a központi Common Voice platformra. Mostantól a Common Voice-on <writeURL>írhat</writeURL> mondatokat vagy <reviewURL>ellenőrizheti</reviewURL> az egymondatos beküldéseket.
sc-redirect-page-subtitle-2 = Kérdezzen a <matrixLink>Matrixon</matrixLink>, a <discourseLink>Discourse-on</discourseLink> vagy <emailLink>e-mailben</emailLink>.
