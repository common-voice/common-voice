## REVIEW

sc-review-lang-not-selected = Þú hefur ekki valið nein tungumál. Farðu í <profileLink>notkunarsniðið</profileLink> þitt til að velja tungumál.
sc-review-title = Yfirfara setningar
sc-review-loading = Hleð inn setningum...
sc-review-select-language = Veldu tungumál til að yfirfara setningar á.
sc-review-no-sentences = Engar setningar til að yfirfara. <addLink>Bættu við fleiri setningum núna!</addLink>
sc-review-form-prompt =
    .message = Yfirfarnar setningar ekki sendar, ertu viss?
sc-review-form-usage = Strjúktu til hægri til að samþykkja setninguna. Strjúktu til vinstri til að hafna henni. Strjúktu upp til að sleppa henni. <strong>Ekki gleyma að senda inn yfirferðina þína!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Heimild: { $sentenceSource }
sc-review-form-button-reject = Hafna
sc-review-form-button-skip = Sleppa
sc-review-form-button-approve = Samþykkja
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Þú getur líka notað flýtilykla: { sc-review-form-button-approve-shortcut } til að samþykkja, { sc-review-form-button-reject-shortcut } til að hafna, { sc-review-form-button-skip-shortcut } til að sleppa
sc-review-form-button-submit =
    .submitText = Ljúka yfirferð
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Engar setningar yfirfarnar.
        [one] 1 setning yfirfarin. Þakka þér fyrir!
       *[other] { $setningar } setningar yfirfarnar. Þakka þér fyrir!
    }
sc-review-form-review-failure = Ekki tókst að vista yfirferðina. Reyndu aftur síðar.
sc-review-link = Yfirfara

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Viðmið yfirferðar
sc-criteria-title = Viðmið yfirferðar
sc-criteria-make-sure = Gakktu úr skugga um að setningin uppfylli eftirfarandi skilyrði:
sc-criteria-item-1 = Setningin verður að vera rétt stafsett.
sc-criteria-item-2 = Setningin verður að vera málfræðilega rétt.
sc-criteria-item-3 = Setningin verður að vera lesanleg.
sc-criteria-item-4 = Ef setningin uppfyllir skilyrðin, skaltu smella á &quot;Samþykkja&quot;-hnappinn hér til hægri.
sc-criteria-item-5-2 = Ef setningin uppfyllir ekki ofangreind skilyrði skaltu smella á &quot;Hafna&quot; hnappinn hér til vinstri. Ef þú ert ekki viss um setninguna geturðu líka sleppt henni og farið yfir í þá næstu.
sc-criteria-item-6 = Ef þú lýkur við að skoða allar tiltækar setningar, þá geturðu hjálpað okkur að safna fleiri setningum!
report-sc-different-language = Annað tungumál
report-sc-different-language-detail = Það er ritað á öðru tungumáli en ég er að yfirfara.
sentences-fetch-error = Villa kom upp við að sækja setningar
