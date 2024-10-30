## REVIEW

sc-review-lang-not-selected = iyeta peji kitu'imu itana na'wesari na,wamia. Pawé simika ne'neme <profileLink>waa perfirechi</profileLink>  pa'ke tu'tay piripi o we'ka nawesari na'iwamia.
sc-review-title = revisandomia puka oracioni
sc-review-loading = umatoteniame  oracioni puka programachi
sc-review-select-language = Usá pii nawesary nenémichó oracioné
sc-review-no-sentences = kite waasi o'rasioni  púka ne'neniame. <addLink> na'peniame e'peché o'rasioni</addLink>
sc-review-form-prompt =
    .message = Ka'i ito'chena pu'ka ne'netiame, ¿pichi'wá chani'mú?
sc-review-form-usage =
    Ri'siitate wa'a a'jámina pu'ka yorapame. Ri'siitate waa jo'wena'mina puka kinakika.  Ri'siitate wa'a o'wepoté puka u'matoteka. <strong>
    ka'te na'tekepa puka itochemia amo ne'neria</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Akana machijipakamu{ $sentenceSource }
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
    .submitText = 15. Ka'juka pu'ka re'wisaroaka
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] piripioi o'rásioni eewisaroatiame
        [one]
            Piripi o'rásioni rewisaroatiame  
            ¡che'riwema!
       *[other]
            { $sentences } o'rásioni revi'saroatiame
            
            ¡cheriwe'ma!
    }
sc-review-form-review-failure = Kí katewere amo yoariá. Enchí yoamitiá ejebá
sc-review-link = Neneniame

## REVIEW CRITERIA

sc-criteria-modal = Yo'raniame puka revisaroaniame
sc-criteria-title = Yo'raniame puka revisaroaniame
sc-criteria-item-2 = Pu'u orasioni  enimápu kawé yo'oraka yo'ratiame kawé'tiame
sc-criteria-item-3 = Iji na'wesari eni'mapu túka machitaniame
sc-review-rules-title = ¿u'u orasioni kum'piaroania púka apo yo'rá?
report-sc-different-language = Pirechi naewasari
report-sc-different-language-detail = Vaatía illoterepú pirechy idioma kí no'o neneachí
sentences-fetch-error = Inture piripi weka tiame waa iyaniachi orasioni
review-error = inture piri'pi wekatiame wa'a re'wisaroaniachi i'ká orasióni
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Mochiwite'me yora'ka weruma Ka'weintapaká
