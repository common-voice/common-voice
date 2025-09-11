## REVIEW

sc-review-lang-not-selected = Izbrali niste še nobenega jezika. Izberite jezike v svojem <profileLink>profilu</profileLink>.
sc-review-title = Pregled stavkov
sc-review-loading = Nalaganje stavkov …
sc-review-select-language = Izberite jezik za pregledovanje stavkov.
sc-review-no-sentences = Ni stavkov, ki bi jih bilo treba pregledati. <addLink>Dodajte nove stavke!</addLink>
sc-review-form-prompt =
    .message = Pregledani stavki niso bili oddani – ali ste prepričani?
sc-review-form-usage = Podrsajte desno, da stavek odobrite. Podrsajte levo, da ga zavrnete. Podrsajte navzgor, da ga preskočite. <strong>Pregleda ne pozabite poslati!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Vir: { $sentenceSource }
sc-review-form-button-reject = Zavrni
sc-review-form-button-skip = Preskoči
sc-review-form-button-approve = Odobri
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = D
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Uporabite lahko tudi bližnjice na tipkovnici: { sc-review-form-button-approve-shortcut } za odobritev, { sc-review-form-button-reject-shortcut } za zavrnitev, { sc-review-form-button-skip-shortcut } za preskočitev
sc-review-form-button-submit =
    .submitText = Končaj pregledovanje
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ni pregledanih stavkov.
        [one] 1 stavek pregledan. Hvala!
        [two] { $sentences } stavka pregledana. Hvala!
        [few] { $sentences } stavki pregledani. Hvala!
       *[other] { $sentences } stavkov pregledanih. Hvala!
    }
sc-review-form-review-failure = Pregleda ni bilo mogoče shraniti. Poskusite znova pozneje.
sc-review-link = Pregled

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Merila za pregled
sc-criteria-title = Merila za pregled
sc-criteria-make-sure = Prepričajte se, da stavek izpolnjuje naslednja merila:
sc-criteria-item-1 = Stavek mora biti pravilno črkovan.
sc-criteria-item-2 = Stavek mora biti slovnično pravilen.
sc-criteria-item-3 = Stavek mora biti izgovorljiv.
sc-criteria-item-4 = Če stavek ustreza merilom, kliknite gumb &quot;Odobri&quot; na desni strani.
sc-criteria-item-6 = Če vam zmanjka stavkov za pregled, nam pomagajte zbrati nove!
sc-review-rules-title = Ali se stavek sklada s smernicami?
sc-review-empty-state = V tem jeziku trenutno ni stavkov za pregled.
report-sc-different-language = Drug jezik
report-sc-different-language-detail = Napisan je v drugem jeziku, kot ga pregledujem.
sentences-fetch-error = Pri pridobivanju stavkov je prišlo do napake
review-error = Pri pregledovanju tega stavka je prišlo do napake
review-error-rate-limit-exceeded = Prehitri ste. Vzemite si trenutek za pregled stavka in se prepričate, da je pravilen.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Uvajamo nekaj velikih sprememb
sc-redirect-page-subtitle-2 = Vprašanja nam lahko zastavite na <matrixLink>Matrixu</matrixLink>, <discourseLink>Discoursu</discourseLink> ali po <emailLink>e-pošti</emailLink>.
# menu item
review-sentences = Pregled stavkov
