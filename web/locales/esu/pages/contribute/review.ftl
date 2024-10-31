## REVIEW

sc-review-lang-not-selected = Cucukliqsaituten qaneryaramek. <profileLink>Profile</profileLink>-arpenun cucukliryugngauten qaneryaramek.
sc-review-title = Review-arluki Igausngalriit
sc-review-loading = Pugniarartut igausngalriit…
sc-review-select-language = Cucuklirluten qaneryaramek review-aryugngaluten igausngalrianek.
sc-review-no-sentences = Igausngalriartairutuq. <addLink>Cali igausngalrialiluten!</addLink>
sc-review-form-prompt =
    .message = Igausngalriit submit-aqsaitut, anqainaryugtuten-qaa?
sc-review-form-usage = Swipe-arluten tallirpilirnermun assiqan. Swipe-arluten iqsulirnermun assiilkan. Swipe-arluten quletmun skip-aryukuvgu. <strong>Review-an nalluyagutevkenaku!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Naken: { $sentenceSource }
sc-review-form-button-reject = Assiituq
sc-review-form-button-skip = Skip-arluku
sc-review-form-button-approve = Assirtuq
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Keyboard Shortcut-anek-llu aturyugngauten: { sc-review-form-button-approve-shortcut } Assiquni, { sc-review-form-button-reject-shortcut } Assiilkuni, { sc-review-form-button-skip-shortcut } Skip-aryukuvgu
sc-review-form-button-submit =
    .submitText = Review-aq Taqluku
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Review-aqsaituten igausngalrianek.
        [one] 1 igausngalriamek review-allruuten. Quyana!
       *[other] { $sentences } igausngalrianek review-allruuten. Quyana!
    }
sc-review-form-review-failure = Review-an save-asciigatuq. Waniku naspaakina.
sc-review-link = Review-aq

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Review-am Pisqutii
sc-criteria-title = Review-am Pisqutii
sc-criteria-make-sure = Ukut pisqutet maligtaquvkarluki igausngalriit:
sc-criteria-item-1 = Spelling-aara assirarkauguq.
sc-criteria-item-2 = Grammar-aara assirarkauguq.
sc-criteria-item-3 = Igausngalria aperyugngararkauguq.
sc-criteria-item-4 = Igausngalriim maligtaqukaki pisqutet, neggluku &quot;Assirtuq&quot; button-aaq tallirpilirnermi.
sc-criteria-item-5-2 = Igausngalriim maligtaqunrilkaki pisqutet, neggluku &quot;Assiituq&quot; button-aaq iqsulirnermi. Nallukuvet igausngalriim assirtacia, skip-aryugngaan, allamek-llu review-arluten.
sc-criteria-item-6 = Igausngalriartairuskan, ikayurluta quyurtellerkamteńek allanek igausngalrianek!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Review-arluku <icon></icon>, uum-qaa igausngalriim aperyaraa assirtuq?
sc-review-rules-title = Uum-qaa igausngalriim maligtaqui pisqutet?
sc-review-empty-state = Igausngalriartairutuq wani qaneryarami.
report-sc-different-language = Allamek qaneryaramek
report-sc-different-language-detail = Allamek qaneryaramek igausngauq.
sentences-fetch-error = Pugesciigatellruuq igausngalrianek aqvatellrani
review-error = Alartellruuq igausngalrianek review-allrani
review-error-rate-limit-exceeded = Cukassiyaagtuten. Uitaqaqaa, una-qaa igausngalria assirtuq?
