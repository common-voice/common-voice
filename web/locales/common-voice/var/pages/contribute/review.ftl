## REVIEW

sc-review-lang-not-selected = Iyéta pehí kitu'ímo ihtána nawésari naiwámia. Kawé simiká ne'néme <profileLink>wa'á perfireči</profileLink>  pa'ké tu'taí pirípi o we'ká nawésari na'iwámia.
sc-review-title = Rewisaróamia pu'ká orasióni
sc-review-loading = Umátoteniame orasióni pu'ká programáči
sc-review-select-language = Usá pirípi nawésari nenémičó orasióne
sc-review-no-sentences = Kite waási orasióni  pu'ká neneniame. <addLink> Napéniame epečé orasióni</addLink>
sc-review-form-prompt =
    .message = Ka'i itóčena pu'ká nenétiame, ¿pičíwa čanimú?
sc-review-form-usage =
    Risiítate wa'á ahámina pu'ká yorapáme. Risiítate wa'á howenámina pu'ká kinákika.  Risiítate wa'á owépote pu´ká umatotéka. <strong>
    kate natékepa pu'ká itóčemia amó nenéria</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Akaná mačihípakamu{ $sentenceSource }
sc-review-form-button-reject = Kinakitiáme
sc-review-form-button-skip = Umátote aampá
sc-review-form-button-approve = Yoráme
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = Kawé usaróamamu kitepéruma tačičániame pu'ká: { sc-review-form-button-approve-shortcut }yoráme,{ sc-review-form-button-reject-shortcut } kinakimiá, i { sc-review-form-button-skip-shortcut }  ninímia
sc-review-form-button-submit =
    .submitText = Kahuka pu'ká rewisaróaka
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] pirípiói orasióni rewisaróatiame
        [one]
            Pirípi orasióni rewisaróatiame  
            ¡Čeriwéma!
       *[other]
            { $sentences } orasióni rewisaróatiame
            ¡Čeriwéma!
    }
sc-review-form-review-failure = Kíkátewere amó yoária. Enčí yoamítia ehépa
sc-review-link = Neneniáme

## REVIEW CRITERIA

sc-criteria-modal = Yoraniáme pu'ká rewisaróaniame
sc-criteria-title = Yoraniáme pu'ká rewisaróaniame
sc-criteria-make-sure = Yomá orasióni itométe kumpiaróamia yomá aháma si'miyáme yoráka:
sc-criteria-item-1 = Ihí nawésari enimápu kawé yotétiame kawétiame
sc-criteria-item-2 = Puú orasióni  enimápu kawé yoráka yorátiame kawétiame
sc-criteria-item-3 = Ihí nawésari enimáputuka mačitániame
sc-criteria-item-4 = E'he ika o'rásioni kumpiorani pu'ká yo'rá , wa'a &quot; yo'rapame &quot; wa'a a'hamina
sc-criteria-item-5-2 = E'hee ika o'rásioni ka'i kumpiaroaso pu'ká yo'rá, ta'čina &quot; kina'kiwame &quot;, wa'a ho'wenamina e'hee kina'neria ka'wé.  Kaweni'ni i u'mató wa'a pirenači
sc-criteria-item-6 = ki'tio epečé wa'asi  o'rasioni pu'ká i'tapiti, ¡ I no'kui wa'a u'ka e'pečé orasioni!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Tu'niame<icon></icon>i'hi u'hu piripi o'rásioni na'yawoaniame ka'wé
sc-review-rules-title = ¿u'u orasioni kum'piaroania pu'ká apo yo'rá?
sc-review-empty-state = E'peo pi'čiwači ki'te ne'neniame pu'ká re'wisaroatiame e'pe ika na'wesariči
report-sc-different-language = Pireči naewasari
report-sc-different-language-detail = Baatía iyoterepú pirečí idioma kí no'o neneačí
sentences-fetch-error = Inture piripi weka tiame waa iyaniači orasioni
review-error = Inture piri'pi wekatiame wa'a re'wisaroaniači i'ká orasióni
review-error-rate-limit-exceeded = U'matoka i'weta siminamu. Sipu ku'itapi pu'ka re'wisaroamia o'rásioni,  ka'wenanereka yo'raka ka'wetiame
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Močiwite'me yora'ka werumá Ka'weintapaká
sc-redirect-page-subtitle-1 = Iče'pači wa'a o'inia no'kani wa'a o'ineaniači oičaka wa'a Common Voice. E'peo kawe <writeURL>yótemamu</writeURL> piripi o'rásioni.<reviewURL> Re'wisaroa </reviewURL>i'točetiame pu'ká o'rásioni pi'neri wa'a Common Voice
sc-redirect-page-subtitle-2 = Támo i'natuke <matrixLink>matrix</matrixLink><discourseLink>na'iwaniame</discourseLink> o <emailLink>emairiči</emailLink>
# menu item
review-sentences = Revisandomia pu'ká orasioni
