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
sc-criteria-item-4 = Iká orasióni kumpiórani pu'ká yo'rá wa'á &quot; yorapáme &quot; wa'á ahámina
sc-criteria-item-5-2 = Iká orasióni ka'á kumpiaroáso pu'ká yo'rá, tačína &quot; kinakiwáme &quot;, wa'a ho'wenámina, kinanéria kawé.  Ninímamu umatotemia wa'á pirenači
sc-criteria-item-6 = Kitió epečé waási  orasióni pu'ká itapití, ¡ I nokúi wa'a uká epečé orasióni!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Tuniamé<icon></icon>ihí u'hú pirípi orasióni nayawoániame kawé
sc-review-rules-title = ¿Puú orasióni kum'piaróania pu'ká ahpó yorá?
sc-review-empty-state = Ehpéo pi'čiwáči ki'té ne'néniame pu'ká re'wisaróatiame ehpé iká nawésariči
report-sc-different-language = Piréči nawésari
report-sc-different-language-detail = Waátia iyoterepú piréčí nawésari kí no'ó nenéačí
sentences-fetch-error = Intúre pirípi wekatiáme wa'á re'ewisaróamia iyaniači orasioni
review-error = Intúre pirípi wekatiáme wa'á re'wisaroanči i'ká orasióni
review-error-rate-limit-exceeded = Umátoka iwéta siminámu. Sipu kuítapi pu'ká re'wisaróamia orasióni,  kawánanereka yoráka kawétiame
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Močiwitéme yoráka werumá kaweintapáka
sc-redirect-page-subtitle-1 = Sentence Collector ičépači wa'a o'ínia no'kaní wa'á o'inéaniači oíčaka wa'á Common Voice. Ehpéo kawé <writeURL>yotémamu</writeURL> pirípi orasióni.<reviewURL> Re'wisaroa </reviewURL>i'tóčetiame pu'ká orasióni pinéri wa'á Common Voice
sc-redirect-page-subtitle-2 = Tamó i'natúke <matrixLink>matrix</matrixLink><discourseLink>na'iwániame</discourseLink> o <emailLink>emairíči</emailLink>
# menu item
review-sentences = Re'wisaróamia pu'ká orasióni
