## REVIEW

sc-review-title = Vàlida i frasi
sc-review-loading = Staju carricannu i frasi…
sc-review-select-language = Pi favuri scegghi na lingua pi validari i frasi.
sc-review-no-sentences = Nuḍḍa frasi di validari. <addLink>Agghiunci autri frasi ora!</addLink>
sc-review-form-prompt =
    .message = I frasi chi validasti nun foru mannati, sì sicuru?
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Funti: { $sentenceSource }
sc-review-form-button-reject = Rifiuta
sc-review-form-button-skip = Sauta
sc-review-form-button-approve = Appruva
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = A
sc-review-form-keyboard-usage-custom = Poi usari macari l'accurzi dâ tastiera: { sc-review-form-button-approve-shortcut } pi Appruvari, { sc-review-form-button-reject-shortcut } pi Rifiutari, { sc-review-form-button-skip-shortcut } pi Sautari
sc-review-form-button-submit =
    .submitText = Accabba a Validazzioni
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nun validasti nuḍḍa frasi.
        [one] Validasti na frasi. Grazzi!
       *[other] Validasti { $sentences } frasi. Grazzi!
    }
sc-review-form-review-failure = Nun potti sarbari a validazzioni. Pi favuri prova arrè cchiù tardu.
sc-review-link = Vàlida

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Règuli di Validazzioni
sc-criteria-title = Règuli di validazzioni
sc-criteria-make-sure = Cuntrolla chi a frasi sicuta sti règuli:
sc-criteria-item-1 = A frasi àv'a èssiri scritta bona.
sc-criteria-item-2 = A frasi àv'a èssiri curretta nnâ grammàtica.
sc-criteria-item-3 = A frasi àv'a èssiri liggìbbili.
sc-criteria-item-4 = Si a frasi sicuta sti règuli, ammacca u buttuni &quot;Appruva&quot; a dritta.
sc-criteria-item-5-2 = Si a frasi nun sicuta sti règuli, ammacca u buttuni &quot;Rifiuta&quot; a manca. Si nun sì sicuru ncapu a sta frasi, poi macari sautalla e jiri a chiḍḍa appressu.
sc-criteria-item-6 = Si finisti i frasi di validari, ajùtani a ricògghiri novi frasi!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Cuntrolla <icon></icon> è na frasi curretta dû puntu di vista linguìsticu?
sc-review-rules-title = Sta frasi sicuta i dirittivi?
sc-review-empty-state = Accamora nun cci sunnu frasi di validari nna sta lingua.
report-sc-different-language = Lingua diversa
report-sc-different-language-detail = È scritta nta na lingua diversa di chiḍḍa chi staju validannu.
sentences-fetch-error = Mmattìu n'erruri ricupirannu i frasi
