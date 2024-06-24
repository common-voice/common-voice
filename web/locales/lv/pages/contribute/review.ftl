## REVIEW

sc-review-lang-not-selected = Jūs neesat atlasījis nevienu valodu. Lūdzu, dodieties uz savu <profileLink>profilu</profileLink>, lai izvēlētos valodas.
sc-review-title = Teikumu pārbaude
sc-review-loading = Notiek teikumu ielāde…
sc-review-select-language = Lūdzu, izvēlieties valodu, lai pārbaudītu teikumus.
sc-review-no-sentences = Nav teikumu, ko pārbaudīt. <addLink>Pievienojiet teikumus!</addLink>
sc-review-form-prompt =
    .message = Pārskatītie teikumi nav iesniegti, vai esat pārliecināts?
sc-review-form-usage = Velciet pa labi, lai apstiprinātu teikumu. Velciet pa kreisi, lai to noraidītu. Velciet uz augšu, lai to izlaistu. <strong>Neaizmirstiet iesniegt sava darba rezultātu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Avots: { $sentenceSource }
sc-review-form-button-reject = Noraidīt
sc-review-form-button-skip = Izlaist
sc-review-form-button-approve = Apstiprināt
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Varat arī izmantot īsinājumtaustiņus: { sc-review-form-button-approve-shortcut }, lai apstiprinātu, { sc-review-form-button-reject-shortcut }, lai noraidītu, { sc-review-form-button-skip-shortcut }, lai izlaistu
sc-review-form-button-submit =
    .submitText = Pabeigt pārskatīšanu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Neviens teikums nav pārbaudīts
        [zero] Pārbaudīts { $sentences } teikums
        [one] Pārbaudīti { $sentences } teikumi
       *[other] Pārbaudīti { $sentences } teikumi
    }
sc-review-form-review-failure = Pārbaudes rezultātu nevarēja saglabāt. Lūdzu, pamēģiniet vēlreiz vēlāk.
sc-review-link = Pārbaudiet

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Pārbaudīšanas kritēriji
sc-criteria-title = Pārbaudīšanas kritēriji
sc-criteria-make-sure = Pārliecinieties, vai teikums atbilst šādiem kritērijiem:
sc-criteria-item-1 = Teikumam jābūt uzrakstītam pareizi, bez drukas kļūdām.
sc-criteria-item-2 = Teikumam jābūt gramatiski pareizam.
sc-criteria-item-3 = Teikumam jābūt izrunājamam.
sc-criteria-item-4 = Ja teikums atbilst visiem kritērijiem, noklikšķiniet uz pogas &quot;Apstiprināt&quot;.
sc-criteria-item-5-2 = Ja teikums neatbilst iepriekš minētajiem kritērijiem, noklikšķiniet uz &quot;Noraidīt&quot; pogas kreisajā pusē. Ja neesat pārliecināts par teikumu, varat to arī izlaist un pāriet uz nākamo.
sc-criteria-item-6 = Ja visi teikumi jau ir pārbaudīti, lūdzu, palīdziet mums savākt jaunus teikumus!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pārbaudiet <icon></icon> vai šis teikums ir pareizs?
sc-review-rules-title = Vai teikums atbilst vadlīnijām?
sc-review-empty-state = Pašlaik šajā valodā nav teikumu, ko pārbaudīt.
report-sc-different-language = Nepareiza valoda
report-sc-different-language-detail = Tas ir uzrakstīts valodā, kas atšķiras no tās, ko šobrīd pārbaudu.
sentences-fetch-error = Ielādējot teikumus notikusi kļūda
review-error = Pārskatot teikumu, notikusi kļūda
review-error-rate-limit-exceeded = Jūs strādājat pārāk ātri. Lūdzu veltiet mirkli, lai pārliecinātos, ka teikumi ir pareizi.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Mēs veicam dažas lielas izmaiņas
sc-redirect-page-subtitle-1 = Teikumu apkopošanas rīks pāriet uz Common Voice platformu. Tagad varat <writeURL>pievienot</writeURL> un <reviewURL>pārbaudīt</reviewURL> teikumus Common Voice sistēmā.
sc-redirect-page-subtitle-2 = Uzdodiet mums jautājumus <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> vai rakstot <emailLink>e-pastu</emailLink>.

