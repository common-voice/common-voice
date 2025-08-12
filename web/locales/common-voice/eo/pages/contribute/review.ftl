## REVIEW

sc-review-title = Kontroli frazojn
sc-review-loading = Frazoj ŝargataj…
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fonto: { $sentenceSource }
sc-review-form-button-reject = Rifuzi
sc-review-form-button-skip = Preterlasi
sc-review-form-button-approve = Akcepti
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Vi ankaŭ povas uzi klavarajn mallongigojn: { sc-review-form-button-approve-shortcut } por akcepti, { sc-review-form-button-reject-shortcut } por rifuzi, { sc-review-form-button-skip-shortcut } por preterlasi
sc-review-form-button-submit =
    .submitText = Fini kontrolon
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Neniu frazo kontrolita.
        [one] 1 frazo kontrolita. Dankon!
       *[other] { $sentences } frazoj kontrolita. Dankon!
    }
sc-review-form-review-failure = Ne eblis konservi la kontrolon. Bonvolu reprovi poste.
sc-review-link = Kontroli

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kriterioj por kontrolo
sc-criteria-title = Kriterioj por kontrolo
sc-criteria-make-sure = Certiĝu, ke la frazo plenumas la jenajn kriteriojn:
sc-criteria-item-1 = La frazo devas esti ĝuste literumita.
sc-criteria-item-2 = La frazo devas esti gramatike ĝusta.
sc-criteria-item-3 = La frazo devas esti pronocebla.
sc-criteria-item-4 = Se la frazo plenumas la kriteriojn, alklaku la butonon &quot;Akcepti&quot; dekstre.
sc-criteria-item-5-2 = Se la frazo ne plenumas la suprajn kriteriojn, alklaku la butonon &quot;Rifuzi&quot; maldekstre. Se vi ne certas pri la frazo, vi ankaŭ povas pretersalti ĝin kaj daŭrigi kun la sekva frazo.
sc-criteria-item-6 = Se vi ne plu havas frazojn por kontroli, bonvolu helpi nin kolekti pliajn frazojn!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kontrolu <icon></icon> ĉu ĉi tiu frazo estas lingve ĝusta?
sc-review-rules-title = Ĉu la frazo plenumas la gvidliniojn?
sc-review-empty-state = Nuntempe ne estas kontrolendaj frazoj en ĉi tiu lingvo.
report-sc-different-language = Alia lingvo
report-sc-different-language-detail = Ĝi estas skribita en lingvo malsama ol tiu, kiun mi kontrolas.
sentences-fetch-error = Okazis eraro dum ŝargado de frazoj
review-error = Okazis eraro dum kontrolo de tiu ĉi frazo
review-error-rate-limit-exceeded = Vi laboras tro rapide. Bonvolu preni momenton por kontroli la frazon por certi, ke ĝi estas ĝusta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Ni faras kelkajn gravajn ŝanĝojn
# menu item
review-sentences = Kontroli frazojn
