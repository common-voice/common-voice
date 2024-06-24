## REVIEW

sc-review-lang-not-selected = Nemáte vybrán žádný jazyk. Přejděte na svůj <profileLink>profil</profileLink> a jazyky nastavte.
sc-review-title = Ověřování vět
sc-review-loading = Načítání vět…
sc-review-select-language = Vyberte jazyk pro kontrolu vět.
sc-review-no-sentences = Nic dalšího k ověření. <addLink>Přidat další věty!</addLink>
sc-review-form-prompt =
    .message = Ověřené věty nebyly odeslány. Vážně pokračovat?
sc-review-form-usage = Potažením doprava větu schválíte. Potažením doleva ji odmítnete. Potažením nahoru ji přeskočíte. <strong>Nezapomeňte hodnocení odeslat!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Zdroj: { $sentenceSource }
sc-review-form-button-reject = Zamítnout
sc-review-form-button-skip = Přeskočit
sc-review-form-button-approve = Schválit
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Můžete také použít klávesové zkratky: { sc-review-form-button-approve-shortcut } pro schválení, { sc-review-form-button-reject-shortcut } pro zamítnutí, { sc-review-form-button-skip-shortcut } pro přeskočení
sc-review-form-button-submit =
    .submitText = Dokončit ověření
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Žádná ověřená věta.
        [one] 1 ověřená věta. Děkujeme!
        [few] Ověřeny { $sentences } věty. Děkujeme!
        [many] Ověřeno { $sentences } vět. Děkujeme!
       *[other] Ověřeno { $sentences } vět. Děkujeme!
    }
sc-review-form-review-failure = Ověření se nepodařilo uložit. Zkuste to prosím později.
sc-review-link = Ověření

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Ověřovací kritéria
sc-criteria-title = Ověřovací kritéria
sc-criteria-make-sure = Ověřte, zda věta splňuje následující kritéria:
sc-criteria-item-1 = Věta musí být napsána správně.
sc-criteria-item-2 = Věta musí být gramaticky správná.
sc-criteria-item-3 = Věta musí být vyslovitelná.
sc-criteria-item-4 = Pokud věta splňuje kritéria, klepněte vpravo na tlačítko &quot;Schválit&quot;.
sc-criteria-item-5-2 = Pokud věta nesplňuje výše uvedená kritéria, klepněte vlevo na tlačítko „Zamítnout“;. Pokud si větou nejste jisti, můžete ji také přeskočit a přejít na další.
sc-criteria-item-6 = Pokud vám dojdou věty k ověření, pomozte nám shromáždit další věty!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Zkontrolujte <icon></icon>, že je tato věta jazykově správně.
sc-review-rules-title = Odpovídá věta doporučením?
sc-review-empty-state = Tento jazyk nyní nemá k ověření žádné věty.
report-sc-different-language = Další jazyk
report-sc-different-language-detail = Je napsána v jiném jazyce, než jaký ověřuji.
sentences-fetch-error = Při načítání vět došlo k chybě
review-error = Při ověřování věty došlo k chybě
review-error-rate-limit-exceeded = Jedete příliš rychle. Věnujte prosím chvíli kontrole věty, abyste se ujistili, že je správná.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Probíhají rozsáhlé úpravy
sc-redirect-page-subtitle-1 = Aplikace Sentence Collector přechází na základní platformu Common Voice. Nyní můžete přímo na Common Voice jednotlivé věty <writeURL>psát</writeURL> nebo <reviewURL>ověřit</reviewURL>.
sc-redirect-page-subtitle-2 = Ptejte se na <matrixLink>Matrixu</matrixLink>, <discourseLink>Discourse</discourseLink> nebo <emailLink>e-mailem</emailLink>.

