## REVIEW

sc-review-lang-not-selected = Nevybrali ste žiadne jazyky. Ak chcete vybrať jazyky, prejdite na svoj <profileLink>Profil</profileLink>.
sc-review-title = Kontrola viet
sc-review-loading = Načítavajú sa vety…
sc-review-select-language = Vyberte jazyk na kontrolu viet.
sc-review-no-sentences = Žiadne vety na kontrolu. <addLink>Pridajte teraz ďalšie vety!</addLink>
sc-review-form-prompt =
    .message = Skontrolované vety neboli odoslané, ste si istý?
sc-review-form-usage = Potiahnutím doprava vetu schválite. Potiahnutím doľava ho odmietnete. Potiahnutím nahor ho preskočíte. <strong>Nezabudnite odoslať svoju kontrolu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Zdroj: { $sentenceSource }
sc-review-form-button-reject = Odmietnuť
sc-review-form-button-skip = Preskočiť
sc-review-form-button-approve = Schváliť
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Môžete použiť aj klávesové skratky: { sc-review-form-button-approve-shortcut } na schválenie, { sc-review-form-button-reject-shortcut } na odmietnutie, { sc-review-form-button-skip-shortcut } na preskočenie
sc-review-form-button-submit =
    .submitText = Dokončiť kontrolu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Neboli skontrolované žiadne vety.
        [one] Bola skontrolovaná 1 veta. Ďakujeme.
        [few] Boli skontrolované { $sentences } vety. Ďakujeme.
       *[other] Bolo skontrolovaných { $sentences } viet. Ďakujeme.
    }
sc-review-form-review-failure = Kontrolu sa nepodarilo uložiť. Skúste neskôr prosím.
sc-review-link = Kontrola

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kritériá kontroly
sc-criteria-title = Kritériá kontroly
sc-criteria-make-sure = Uistite sa, že veta spĺňa nasledujúce kritériá:
sc-criteria-item-1 = Veta musí byť napísaná správne.
sc-criteria-item-2 = Veta musí byť gramaticky správna.
sc-criteria-item-3 = Veta musí byť vysloviteľná.
sc-criteria-item-4 = Ak veta spĺňa kritériá, kliknite na tlačidlo &quot;Schváliť&quot; tlačidlo na pravej strane.
sc-criteria-item-5-2 = Ak veta nespĺňa vyššie uvedené kritériá, kliknite na tlačidlo &quot;Odmietnuť&quot; tlačidlo vľavo. Ak si vetou nie ste istí, môžete ju tiež preskočiť a prejsť na ďalšiu.
sc-criteria-item-6 = Ak vám dochádzajú vety na kontrolu, pomôžte nám zhromaždiť viac viet!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Skontrolujte <icon></icon> či je toto jazykovo správna veta.
sc-review-rules-title = Spĺňa veta pravidlá?
sc-review-empty-state = Momentálne nie sú v tomto jazyku žiadne vety dostupné na kontrolu.
report-sc-different-language = Iný jazyk
report-sc-different-language-detail = Je napísaná v inom jazyku, než aký kontrolujem.
sentences-fetch-error = Pri načítavaní viet sa vyskytla chyba
review-error = Pri kontrole tejto vety sa vyskytla chyba
review-error-rate-limit-exceeded = Idete príliš rýchlo. Venujte chvíľu kontrole vety, aby ste sa uistili, že je správna.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Robíme veľké zmeny
sc-redirect-page-subtitle-1 = Nástroj na zber viet sa presúva na základnú platformu Common Voice. Teraz môžete v Common Voice <writeURL>napísať</writeURL> vetu alebo <reviewURL>kontrolovať</reviewURL> vety iných prispievateľov.
sc-redirect-page-subtitle-2 = Pýtajte sa nás na <matrixLink>Matrixe</matrixLink>, <discourseLink>Discourse</discourseLink> alebo <emailLink>e‑mailom</emailLink>.
