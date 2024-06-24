## REVIEW

sc-review-lang-not-selected = Jius naasat atlasejs nivīnu volūdu. Lyudzu, ejit iz sovu <profileLink>profilu</profileLink>, lai izalaseitu volūdys.
sc-review-title = Teikumu puorbaude
sc-review-loading = Nūteik teikumu īluode...
sc-review-select-language = Lyudzu, izavielejit volūdu, lai puorbaudeitu teikumus.
sc-review-no-sentences = Nav teikumu, kū puorbaudeit. <addLink>Davīnojit teikumus!</addLink>
sc-review-form-prompt =
    .message = Puorsavārtī teikumi nav īsnāgti, voi asat drūss?
sc-review-form-usage = Veļcit pa labi, lai apstyprynuotu teikumu. Veļcit pa kreisi, lai tū atmastu. Veļcit iz augšu, lai tū izlaistu. <strong>Naaizmierstit īsnēgt sova dorba rezultatu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Olūts: { $sentenceSource }
sc-review-form-button-reject = Nūraideit
sc-review-form-button-skip = Izlaist
sc-review-form-button-approve = Apstyprynuot
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Varit ari lītuot eisynuojumtausteņus: { sc-review-form-button-approve-shortcut }, lai apstyprynuotu, { sc-review-form-button-reject-shortcut }, lai nūraideitu, { sc-review-form-button-skip-shortcut }, lai izlaistu
sc-review-form-button-submit =
    .submitText = Pabeigt puorsavieršonu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Puorbaudeiti { $sentences } teikumi
        [zero] Puorbaudeiti { $sentences } teikumi
        [one] Puorbaudeiti { $sentences } teikumi
       *[other] Puorbaudeiti { $sentences } teikumi
    }
sc-review-form-review-failure = Puorbaudis rezultatu navarēja saglobuot. Lyudzu, paraugit vēļreiz vāluok.
sc-review-link = Puorbaudit

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Puorbaudeišonys kritereji
sc-criteria-title = Puorbaudeišonys kritereji
sc-criteria-make-sure = Puorsalīcynojit, voi teikums atbiļst itaidim kriterejim:
sc-criteria-item-1 = Teikumam juobyut pareizi uzraksteitam, vuordūs navar byut drukys klaidu.
sc-criteria-item-2 = Teikumam juobyut gramatiski pareizam.
sc-criteria-item-3 = Teikumam juobyut izrunojamam.
sc-criteria-item-4 = Ka teikums atbylst vysim kriterejim, klykstynojit iz pūgys &quot;Apstyprynuot&quot;.
sc-criteria-item-5-2 = Ka teikums naatbylst pyrma nūsauktajim kriterejim, klykstynojit iz pūgys "Nūraideit". Ka naasat puorlīcynuots par teikumu, varit tū ari izlaist i puorīt iz nuokušū.
sc-criteria-item-6 = Ka vysi teikumi jau ir puorbaudeiti, lyudzu, paleidzit mums savuokt jaunus teikumus!

sc-review-rules-title = Voi teikums atbylst vodlinejom?
sc-review-empty-state = Itūšaļt itamā volūdā nav teikumu, kū puorbaudeit.
report-sc-different-language = Napareiza volūda
report-sc-different-language-detail = Tys ir uzraksteits volūdā, kas atsaškir nu tuos, kū itūšaļt puorbaudu.
sentences-fetch-error = Īluodejūt teikumus, nūtykuse klaida
review-error = Puorsaverūt teikumu, nūtykuse klaida
review-error-rate-limit-exceeded = Jius struodojit par daudz uotri. Lyudzu, iz šaļti puorsalīcynojit, ka teikumi ir pareizi.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Mes veicam puors lelys izmainis
sc-redirect-page-subtitle-1 = Teikumu apkūpuošonys reiks puorīt iz Common Voice platformu. Tagad varit <writeURL>dalikt</writeURL> i<reviewURL>puorbaudeit</reviewURL> teikumus Common Voice sistemā.
sc-redirect-page-subtitle-2 = Aizdūdit mums vaicuojumus <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> voi rokstūt <emailLink>e-postu</emailLink>.
