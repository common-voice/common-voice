## REVIEW

sc-review-lang-not-selected = Ou pa chwazi piés lang. Souplé ale asou <profileLink>Pwofil</profileLink> ou a pou chwazi lang ou.
sc-review-title = Revize Fraz la
sc-review-loading = chajement se  fraz la…
sc-review-select-language = Souplé chwazi an lang pou revize  sé fraz la.
sc-review-no-sentences = Pa ni fraz pou revize. <addLink>Ajoute plis fraz aprézan!</addLink>
sc-review-form-prompt =
    .message = Fraz revize yo pa soumèt, èske ou sèten?
sc-review-form-usage = Glise adwat pou apwouve fraz la. Glise agoch ​​pou rejte li. Glise anlè pou sote li. <strong>Pa bliye soumèt revizyon lan!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Sous: { $sentenceSource }
sc-review-form-button-reject = Rejite
sc-review-form-button-skip = Sote
sc-review-form-button-approve = Apwouve
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom =
    Ou kapab itilize tout rakoursi klavye w: { sc-review-form-button-approve-shortcut } pou Apwouve, { sc-review-form-button-reject-shortcut } pou Rejite, { sc-review-form-button-skip-shortcut } pou Sote
    
    REVIZYON KOMANTÈ AN GWOUP
sc-review-form-button-submit =
    .submitText = Fini Revizyon an
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Pani piés  fraz revize
        [one] 1 fraz revize. Mèsi!
       *[other] { $sentences } fraz revize. Mèsi!
    }
sc-review-form-review-failure = Nou pa te kapab sove revizyon an. Souplé eseye ankò plita.
sc-review-link = Revizyon

## REVIEW CRITERIA

sc-criteria-modal = Kritè Revizyon yo
sc-criteria-title = Kritè Revizyon yo
sc-criteria-make-sure = Asire w ke fraz la satisfè kritè ta yo:
sc-criteria-item-1 = Fòk ou byen ekri fraz la.
sc-criteria-item-2 = Fraz la dwet kòrèk gramatikalman
sc-criteria-item-3 = Fraz la dwet ni bagay moun ka di.
sc-criteria-item-4 = Si fraz la satisfè kritè  a yo, klike asou bouton "Apwouve" ki asou bò dwat la.
sc-criteria-item-5-2 = Si fraz la pa satisfè kritè ki anwo a, klike asou bouton "Rejte" ki sou bò gòch la. Si ou pa sèten sé fraz la, ou ka sote  tout epi ale adan pwochen an.
sc-criteria-item-6 = Si ou pa ni fraz ankò pou revize, souplé ede nou kolekte plis fraz!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Vérifié <icon></icon> si fraz sa a kòrèk lengwistikman?
sc-review-rules-title = Èske fraz la konfòm épi direktiv yo?
sc-review-empty-state = Pa ni piés fraz pou revize adan lang ta la .
report-sc-different-language = Lang diferan
report-sc-different-language-detail = Y ekri adan an lang diferan de sa mwen ka revize a.
sentences-fetch-error = Yon erè rive pandan y  récupérasyon  fraz yo
review-error = Yon erè rive pandan revizyon fraz ta la.
review-error-rate-limit-exceeded = Ou ka ale twò vit. Souplé pran an ti moman pou revize fraz la pou asire kow y kòrèk.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Nou  kay procédé a de  gwo chanjman.
sc-redirect-page-subtitle-1 = Kolektè Fraz la pou deplase asou platfòm prensipal Common Voice la. Atcholman a ou kapab <writeURL>ekri</writeURL> an fraz oubyen <reviewURL>revize</reviewURL> soumèt fraz endividyèl sou Common Voice.
sc-redirect-page-subtitle-2 = Poze nou kesyon asou <matrixLink>Matrix</matrixLink>, <discourseLink>
# menu item
review-sentences = Revize Fraz yo
