## REVIEW

sc-review-lang-not-selected = Kuena musungule muaku nansha umue. Buela mu <profileLink>muaba</profileLink> weba ne usungule miakulu.
sc-review-title = Tangulula miaku
sc-review-loading = Dibueja dia biambilu…
sc-review-select-language = Bueja muakulu bua kutangila biambilu.
sc-review-no-sentences = Kakuena muaku nansha umue wa kutangulula to. Udi mua <addLink>kukumbaja miaku mukuabu</addLink>.
sc-review-form-prompt =
    .message = Miaku mitangulula kayena miya to, udi muakutungunuka ?
sc-review-form-usage = Yaku ku diabalume bua kujadika muaku. Yaku ku diabakaji bua kubenga. Banda muulu bua kubenga. <strong>Kupu moyo bua kutuma bipeta bia muenenu weba !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Mushimi :{ $sentenceSource }
sc-review-form-button-reject = Dibenga
sc-review-form-button-skip = Pita
sc-review-form-button-approve = Jadika
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Udi muakuenzela kabidi jila ya tshikoso ne clavier : { sc-review-form-button-approve-shortcut }bua kujadika, { sc-review-form-button-reject-shortcut }kubenga,{ sc-review-form-button-skip-shortcut } anyi kupita
sc-review-form-button-submit =
    .submitText = Jikija ditangulula
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Tshiambilu nansha tshimue katshiena tshitangulula.
        [1] Tshiambilu tshimue tshitangulula. Tuasakidila !
        [one] Tshiambilu tshimue tshitangulula. Tuasakidila !
       *[other] Biambilu bitangulula. Tuasakidila !
    }
sc-review-form-review-failure = Ditangulula kadiena diya kujadikibua to. Udi mua kuteta tshiakabidi.
sc-review-link = Ditangulula

## REVIEW CRITERIA

sc-criteria-modal = Mikenji ya ditangulula
sc-criteria-title = Mikenji ya ditangulula
sc-criteria-make-sure = Tuishibua bua se miaku idi ne mikenji eyi :
sc-criteria-item-1 = Tshiambilu tshidi ne tshikuila tshifunda bimpe.
sc-criteria-item-2 = Tshiambilu tshidi ne tshikuila ne fundilu muimpe.
sc-criteria-item-3 = Tshiambilu tshidi tshiakuikala tshifunda mushindu wa kutshibala.
sc-criteria-item-4 = Pikala tshiambilu tshidi tshiandamuna ku mikenji, tuaku pa « jadika » ku diabalume
sc-criteria-item-5-2 = Pikala tshiambilu tshidi tshiandamuna ku mikenji idi ilonda eyi tuaku pa « dibenga » ku diabakaji. Piwikala ne mpata udi mua kupita ne kuya ku tshitupa tshikuabu.
sc-criteria-item-6 = Piwikala kuena ne biambilu bia ku tangulula, tuambuluisha mua kupeta biambilu !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Tangulula<icon></icon> buase tshiambilu tshifunda bilondeshela muakulu
sc-review-rules-title = Tshiambilu tshifanangane ne mikenji anyi ?
sc-review-empty-state = Kakuena tshiabilu tshia kutangulula mu muakulu ewu.
report-sc-different-language = Muakulu mukuabu
report-sc-different-language-detail = Tshiambilu tshifunda mu muakulu mushilangane ne biindi imbala.
sentences-fetch-error = Tshilema tshimueneka tshikondo tshia kuangata biambilu
review-error = Tshilema tshimueneka tshikondo tshia kutangulula biambilu
review-error-rate-limit-exceeded = Udi uya lukasa lukasa. Shala ne lutulu bua kubalula tshiambila ne utuishibue ne tshidi tshimpe.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tudi tupita ku mashitulula mimpe
sc-redirect-page-subtitle-1 = Muakatshi wa biambilu udi wenzela common voice.  Udi <writeURL>muakutuadija</writeURL> kufunda tshimbilu anyi ku <reviewURL>tangulula</reviewURL> kupitshila ku Common Voice.
sc-redirect-page-subtitle-2 = Tuela nkonko kupitshila ku <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ou <emailLink> e-mail </emailLink>.
# menu item
review-sentences = Tangulula biambilu
