## REVIEW

sc-review-lang-not-selected = Iyeta pehi kitu'imu itana na'wesari na wamia. Pawé simika ne'neme <profileLink>waa perfireči</profileLink>  pa'ke tu'tay piripi o we'ka nawesari na'iwamia.
sc-review-title = Rebisandomia pu'ká orasioni
sc-review-loading = Umatoteniame orasioni pu'ká programači
sc-review-select-language = Usá pii nawesari nenémičó orasioné
sc-review-no-sentences = Kite waasi o'rasioni  pu'ká ne'neniame. <addLink> Na'peniame epečé o'rasioni</addLink>
sc-review-form-prompt =
    .message = Ka'i ito'čena pu'ká ne'netiame, ¿piči'wá čani'mú?
sc-review-form-usage =
    Ri'siitate wa'a a'jámina pu'ká yorapame. Ri'siitate wa'a jo'wena'mina pu'ká kinakika.  Ri'siitate wa'a o'wepoté puka u'matoteka. <strong>
    ka'te na'tekepa pu'ká itočemia amo ne'neria</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Akana mačijipakamu{ $sentenceSource }
sc-review-form-button-reject = Ki'nakitiamé
sc-review-form-button-skip = Umatote aampa
sc-review-form-button-approve = Yorame
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = Ka'awe usaroamamu kiteperuma tachuchaniame; puka{ sc-review-form-button-approve-shortcut }yorame ; { sc-review-form-button-reject-shortcut } kinakimia i{ sc-review-form-button-skip-shortcut }  ni'nia
sc-review-form-button-submit =
    .submitText = Ka'juka pu'ká re'wisaroaka
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] piripioi o'rásioni reewisaroatiame
        [one]
            Piripi o'rásioni rewisaroatiame  
            ¡čeriwe'ma!
       *[other]
            { $sentences } o'rásioni revi'saroatiame
            ¡čeriwe'ma!
    }
sc-review-form-review-failure = Kíkatewere amo yoariá. Enčí yoamitiá ehebá
sc-review-link = Neneniame

## REVIEW CRITERIA

sc-criteria-modal = Yo'raniame pu'ká revisaroaniame
sc-criteria-title = Yo'raniame pu'ká revisaroaniame
sc-criteria-make-sure = Yoma o'rasioni itomete kumpiaroamia yo'má a'hama si'miyame yo'raka:
sc-criteria-item-1 = I'hi na'wesari e'nimapu kawé yo'tetiame ka'wetiame
sc-criteria-item-2 = Pu'u orasioni  enimápu kawé yo'oraka yo'ratiame kawé'tiame
sc-criteria-item-3 = Ihi na'wesari eni'mapu túka mačitaniame
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
