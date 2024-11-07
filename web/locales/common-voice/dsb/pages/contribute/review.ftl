## REVIEW

sc-review-lang-not-selected = Njejsćo wubrał rěcy. Pšosym pśejźćo k swójomu <profileLink>profiloju</profileLink>, aby rěcy wubrał.
sc-review-title = Sady pśeglědaś
sc-review-loading = Sady se zacytuju…
sc-review-select-language = Pšosym wubjeŕśo rěc, aby sady pśeglědował.
sc-review-no-sentences = Žedne sady za pśeglědowanje. <addLink>Pśidajśo něnto dalšne sady!</addLink>
sc-review-form-prompt =
    .message = Pśeglědane sady hyšći njejsu zapódane, nic ga?
sc-review-form-usage = Šmarniśo napšawo, aby sadu pśizwólił. Šmarniśo nalěwo, aby ju wótpokazał. Šmarniśo górjej, aby ju pśeskócył. <strong>Njezabywajśo, swóje pógódnośenje zapódaś!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Žrědło: { $sentenceSource }
sc-review-form-button-reject = Wótpokazaś
sc-review-form-button-skip = Pśeskócyś
sc-review-form-button-approve = Pśizwóliś
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = P
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = W
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Móžośo teke tastowe skrotconki wužywaś: { sc-review-form-button-approve-shortcut }, abo pśizwólił, { sc-review-form-button-reject-shortcut }, aby wótpokazał, { sc-review-form-button-skip-shortcut }, aby pśeskócył
sc-review-form-button-submit =
    .submitText = Pógódnośenje dokóńcyś
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Žedne sady pśeglědane.
        [one] { $sentences } sada jo se pśeglědała. Wjeliki źěk!
        [two] { $sentences } saźe stej se pśeglědałej. Wjeliki źěk!
        [few] { $sentences } sady su se pśeglědali. Wjeliki źěk!
       *[other] { $sentences } sadow jo se pśeglědało. Wjeliki źěk!
    }
sc-review-form-review-failure = Pógódnośenje njedajo se składowaś. Pšosym wopytajśo pózdźej hyšći raz.
sc-review-link = Pógódnośiś

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Pśeglědowańske kriterije
sc-criteria-title = Pśeglědowańske kriterije
sc-criteria-make-sure = Zawěsććo, až sady slědujucym kriterijam wótpowěduju:
sc-criteria-item-1 = Sada musy pšawje napisana byś.
sc-criteria-item-2 = Sada musy gramatiski korektna byś.
sc-criteria-item-3 = Sada musy wugranjajobna byś.
sc-criteria-item-4 = Jolic sada kriterijam wótpowědujo, klikniśo na tłocašk „Pśizwóliś“.
sc-criteria-item-5-2 = Jolic sada kriterijam górjejce njewótpowědujo, klikniśo na tłocašk „Wótpokazaś“. Joli se wó saźe wěsty njejsćo, móžośo teke ju pśeskócyś a k pśiducej pśejś.
sc-criteria-item-6 = Jolic wam sady wujdu, pomagajśo nam dalšne sady zběraś.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pśekontrolěrujśo <icon></icon>, lěc to jo linguistiski korektna sada.
sc-review-rules-title = Wótpowědujo sada směrnicam?
sc-review-empty-state = Njedajo tuchylu sady za pśekontrolěrowanje w toś tej rěcy.
report-sc-different-language = Druga rěc
report-sc-different-language-detail = Jo w drugej rěcy napisana ako pśeglědujom.
sentences-fetch-error = Pśi wótwołowanju sadow jo zmólka nastała
review-error = Pśi pśekontrolěrowanju toś teje sady jo zmólka nastała
review-error-rate-limit-exceeded = Sćo pśemalsny. Bjeŕśo se wokognuśe casa, aby pšawosć sady pśeglědował.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Pśewjeźomy někotare změny
sc-redirect-page-subtitle-1 = Zgromaźowak sadow na głownu platformu Common Voice pśeśěgnjo. Móžośo něnto na Common Voice sadu <writeURL>pisaś</writeURL> abo jadnotliwe sady <reviewURL>pśeglědowaś</reviewURL>.
sc-redirect-page-subtitle-2 = Stajśo nam pšašanja na <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> abo z <emailLink>e-mailu</emailLink>.
