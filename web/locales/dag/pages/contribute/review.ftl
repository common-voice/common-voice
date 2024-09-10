## REVIEW

sc-review-lang-not-selected = A bi piigi bali shɛli. Dimsuɣulo, chami a <profileLink>Profile</profileLink>ni n-ti piigi balli.
sc-review-title = Labi lihi yɛltɔɣa
sc-review-loading = N-voori yɛltɔɣa.....
sc-review-select-language = Dim suɣulo ka pii balli n-labi lihi yɛltɔɣa.
sc-review-no-sentences = Yɛltɔɣa kani ni a labi lihi. <addLink>Pahimi yɛltɔɣa pumpɔŋɔ!</addLink>
sc-review-form-prompt =
    .message = A ni labi yuli yɛltɔɣ' shɛŋa bi zaŋ ti, a dihi tabili?
sc-review-form-usage = Parisi kpa nudirigu polo n-saɣi ti yɛltɔɣili maa. Parisi labi nuzaa polo n-zaɣisi li. Parisi kpa zuɣusaa polo n-kpahi yaɣi li. <strong> Miri ka a tam a labi lihi maa labisi ti!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Di ni yi shɛli: { $sentenceSource }
sc-review-form-button-reject = Zaɣisima
sc-review-form-button-skip = Kpahi yaɣi
sc-review-form-button-approve = Saɣi ti
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = A ni tooi zaŋ kɔmpiita sojihi n tum tuma: { sc-review-form-button-approve-shortcut } n-saɣi ti, { sc-review-form-button-reject-shortcut } n-zaɣisi, { sc-review-form-button-skip-shortcut } n-kpahi yaɣi
sc-review-form-button-submit =
    .submitText = Naami labi vihi
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] yɛltɔɣa n-labi lihi. [yini] yɛltɔɣ' gaŋa n-labi lihi.
        [one] 1 Ti paɣiya!
       *[other] *[din pahi] { $sentences } yɛltɔɣa din labi lihi. Ti paɣiya!
    }
sc-review-form-review-failure = Labi lihi maa bi tooi seevi. Dim suɣulo ka labi buɣisi saha shɛli.
sc-review-link = Labi lihi

## REVIEW CRITERIA

sc-criteria-modal = ⓘLabi lihi Soya
sc-criteria-title = Labi lihi Soya
sc-criteria-make-sure = Dihi n-tabili ni yɛltɔɣili maa saɣi n-doli soya ŋɔ:
sc-criteria-item-1 = Yɛltɔɣili maa bachinima simdi ka di yiɣisi dede.
sc-criteria-item-2 = Yɛltɔɣili maa girama/biɛhigu be dede.
sc-criteria-item-3 = Yɛltɔɣili maa simdi ka di ni tooi yɛli.
sc-criteria-item-4 = Yɛltɔɣili maa yi saɣi ti soya maa, nyin dihimi &quot maa; Saɣi n-ti &quot; garili din be nudirigu polo maa.
sc-criteria-item-5-2 = Yɛltɔɣili maa yi bi doli so' shɛŋa ŋan be zuɣusaa ŋɔ, nyin dihimi &quot;Zaɣisima&quot; garili din be nuzaa polo maa. A yi bi dihi n-tabili ni yɛltɔɣili maa, a ni tooi kpahi yaɣi li n-chaŋ din paya.
sc-criteria-item-6 = Yɛltɔɣa yi lahi kani ni a labi lihi, nyin dimi suɣulo ka sɔŋ ti ka ti laɣisi yɛltɔɣa pam m-pahi.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Yulima <icon></icon>yɛltɔɣili ŋɔ maa sabiya viɛnyɛla?
sc-review-rules-title = Yɛltɔɣili maa doli soya maa?
sc-review-empty-state = Yɛltɔɣa lahi kani ni a labi lihi balli ŋɔ maa ni.
report-sc-different-language = Bal' shɛli dabam
report-sc-different-language-detail = Di sabimi ni bal' shɛli din pa n ni labiri lihiri bal' shɛli maa.
sentences-fetch-error = Muɣisigu kamina yɛltɔɣa maa voobu ni
review-error = Muɣisigu kamina yɛltɔɣili ŋɔ labi lihi ni
review-error-rate-limit-exceeded = A chani yɔm pam. Dimi suɣulo ka di saha biɛla n-lihi yɛltɔɣili maa n-nyaa di be dede.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Taɣiri kara ka ti niŋdi maa
sc-redirect-page-subtitle-1 = Din deeri yɛltɔɣa maa pa chanila Common Voice puuni. A pa ni tooi <writeURL>sabi</writeURL> yɛltɔɣili bee <reviewURL>labi lihi</reviewURL>yɛltɔɣ' gaŋa zaŋ niŋ Common Voice puuni.
sc-redirect-page-subtitle-2 = Bɔhimi ti bɔhisi  <matrixLink>Matirikisi</matrixLink>, <discourseLink>Lahibali</discourseLink> bee <emailLink>iimeeli</emailLink>.
