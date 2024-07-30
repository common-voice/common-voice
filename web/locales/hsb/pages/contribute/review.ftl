## REVIEW

sc-review-lang-not-selected = Njejsće rěče wubrał. Prošu přeńdźće k swojemu <profileLink>profilej</profileLink>, zo byšće rěče wubrał.
sc-review-title = Sady přepruwować
sc-review-loading = Sady so začituja…
sc-review-select-language = Prošu wubjerće rěč, zo byšće sady přepruwował.
sc-review-no-sentences = Žane sady za přepruwowanje. <addLink>Přidajće nětko dalše sady!</addLink>
sc-review-form-prompt =
    .message = Přepruwowane sady hišće zapodate njejsu, něwěrno?
sc-review-form-usage = Šmórńće naprawo, zo byšće sadu schwalił. Šmórńće nalěwo, zo byšće ju wotpokazał. Šmórńće horje, zo byšće ju přeskočił. <strong>Njezabywajće, swoje pohódnoćenje zapodać!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Žórło: { $sentenceSource }
sc-review-form-button-reject = Wotpokazać
sc-review-form-button-skip = Přeskočić
sc-review-form-button-approve = Schwalić
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = h
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = W
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Móžeće tež tastowe skrótšenki wužiwać: { sc-review-form-button-approve-shortcut }, zo byšće schwalił, { sc-review-form-button-reject-shortcut }, zo byšće wotpokazał, { sc-review-form-button-skip-shortcut }, zo byšće přeskočił
sc-review-form-button-submit =
    .submitText = Pohódnoćenje dokónčić
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Žane sady přepruwowane.
        [one] { $sentences } sada je so přepruwowała. Wulki dźak!
        [two] { $sentences } sadźe stej so přepruwowałoj. Wulki dźak!
        [few] { $sentences } sady su so přepruwowali. Wulki dźak!
       *[other] { $sentences } sadow je so přepruwowało. Wulki dźak!
    }
sc-review-form-review-failure = Pohódnoćenje njeda so składować. Prošu spytajće pozdźišo hišće raz.
sc-review-link = Pohódnoćić

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Přepruwowanske kriterije
sc-criteria-title = Přepruwowanske kriterije
sc-criteria-make-sure = Zawěsćće, zo sady slědowacym kriterijam wotpowěduja:
sc-criteria-item-1 = Sada dyrbi prawje napisana być.
sc-criteria-item-2 = Sada dyrbi gramatisce korektna być.
sc-criteria-item-3 = Sada dyrbi wurjekujomna być.
sc-criteria-item-4 = Jeli sada kriterijam wotpowěduje, klikńće na tłóčatko „Schwalić“.
sc-criteria-item-5-2 = Jeli sada kriterijam horjeka njewotpowěduje, klikńće na tłóčatko „Wotpokazać“. Jeli sej wo sadźe wěsty njejsće, móžeće tež ju přeskočić a k přichodnej přeńć.
sc-criteria-item-6 = Jeli wam sady wuńdu, pomhajće nam dalše sady zběrać.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Přepruwujće <icon></icon>, hač to je linguistisce korektna sada.
sc-review-rules-title = Wotpowěduje sada směrnicam?
sc-review-empty-state = Tuchwilu sady za přepruwowanje w tutej rěči njejsu.
report-sc-different-language = Druha rěč
report-sc-different-language-detail = Je w druhej rěči napisana hač přepruwuju.
sentences-fetch-error = Při wotwołowanju tuteje sady je zmylk nastał
review-error = Při přepruwowanju tuteje sady je zmylk nastał
review-error-rate-limit-exceeded = Sće přespěšny. Bjerće sej wokomik časa, zo byšće prawosć sady přepruwował.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Přewjedźemy někotre změny
sc-redirect-page-subtitle-1 = Hromadźak sadow na hłownu platformu Common Voice přećehnje.Móžeće nětko na Common Voice sadu <writeURL>pisać</writeURL> abo jednotliwe sady <reviewURL>přepruwować</reviewURL>.
sc-redirect-page-subtitle-2 = Stajće nam prašenja na <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> abo z <emailLink>e-mejlu</emailLink>.
