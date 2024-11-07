## REVIEW

sc-review-lang-not-selected =
    Jo hawwe gjin talen selektearre. Gean nei jo
    <profileLink>Profyl</profileLink> om talen te selektearjen.
sc-review-title = Sinnen beoardiele
sc-review-loading = Sinnen lade…
sc-review-select-language = Selektearje in taal om sinnen te beoardielen.
sc-review-no-sentences =
    Gjin sinnen om te beoardielen.
    <addLink>Foegje no mear sinnen ta!</addLink>
sc-review-form-prompt =
    .message = Beoardiele sinnen net yntsjinne, binne jo wis?
sc-review-form-usage =
    Fei nei rjochts om de sin goed te karren. Fei nei links om dizze ôf te wizen.
    Fei omheech om dizze oer te slaan. <strong>Ferjit net jo beoardieling yn te tsjinjen!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Boarne: { $sentenceSource }
sc-review-form-button-reject = Ofwize
sc-review-form-button-skip = Oerslaan
sc-review-form-button-approve = Goedkarre
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = J
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = Jo kinne ek fluchtoetsen brûke: { sc-review-form-button-approve-shortcut } om goed te karren, { sc-review-form-button-reject-shortcut } om ôf te karren, { sc-review-form-button-skip-shortcut } om oer te slaan
sc-review-form-button-submit =
    .submitText = Beoardieling foltôgje
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Gjin sinnen beoardiele.
        [one] Ien sin beoardiele. Tank!
       *[other] { $sentences } sinnen beoardiele. Tige tank!
    }
sc-review-form-review-failure = Beoardieling kin net bewarre wurde. Probearje it letter nochris.
sc-review-link = Beoardiele

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Beoardielingskritearia
sc-criteria-title = Beoardielingskritearia
sc-criteria-make-sure = Soargje derfoar dat de sin oan de folgjende kritearia foldocht:
sc-criteria-item-1 = De sin moat goed stavere wêze.
sc-criteria-item-2 = De sin moat grammatikaal korrekt wêze.
sc-criteria-item-3 = De sin moat út te sprekken wêze.
sc-criteria-item-4 = As de sin oan de kritearia foldocht, klik dan op de knop &quot;Goedkarre&quot; oan de rjochterkant.
sc-criteria-item-5-2 =
    As de sin net oan de boppesteande kritearia foldocht, klik dan op de knop ‘Ofwize’ oan de linkerkant.
    As jo net wis binne fan de sin, kinne jo dizze ek oerslaan en trochgean nei de folgjende.
sc-criteria-item-6 = As jo gjin sinnen mear hawwe om te beoardielen, help ús dan om mear sinnen te sammeljen!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kontrolearje <icon></icon> of dit in taalkundich korrekte sin is?
sc-review-rules-title = Foldocht de sin oan de rjochtlinen?
sc-review-empty-state = Der binne op it stuit gjin sinnen om te beoardielen yn dizze taal.
report-sc-different-language = Oare taal
report-sc-different-language-detail = It is skreaun yn in oare taal dan hokker ik oan it beoardielen bin.
sentences-fetch-error = Der is in flater bard by it opheljen fan sinnen
review-error = Der is in flater bard by it beoardielen fan dizze sin
review-error-rate-limit-exceeded = Jo geane te hurd. Nim efkes de tiid om de sin te besjen om der wis fan te wêzen dat dizze korrekt is.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Wy fiere inkelde grutte feroaringen troch
sc-redirect-page-subtitle-1 = De Sentence Collector ferhuzet nei de kearn fan it Common Voice-platfoarm. Jo kinne no in sin <writeURL>skriuwe</writeURL> of ynstjoeringen fan losse sinnen <reviewURL>beoardiele</reviewURL> op Common Voice.
sc-redirect-page-subtitle-2 = Stel ús fragen op <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> of fia in <emailLink>e-mailberjocht</emailLink>.
