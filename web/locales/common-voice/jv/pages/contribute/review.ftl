## REVIEW

sc-review-lang-not-selected = Sampeyan durung milih basa. Mangga menyang <profileLink>Profile</profileLink> sampeyan kanggo milih basa.
sc-review-title = nyemak ukara
sc-review-loading = buka ukara
sc-review-select-language = Mangga pilih basa kanggo mriksa ukara.
sc-review-no-sentences = Ora ana ukara kanggo direviu <addLink>Tambah ukara liyane saiki!</addLink>
sc-review-form-prompt =
    .message = Ukara sing direviudurung dikirim, yakin?
sc-review-form-usage = Gesek nengen kanggo nyetujoni ukara kasebut. Gesek ngiwa kanggo nolak. Gesek munggah kanggo nglewati. <strong>Aja lali ngirim reviu sampeyan!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Sumber: { $sentenceSource }
sc-review-form-button-reject = Tolak
sc-review-form-button-skip = Liwati
sc-review-form-button-approve = nyetujoni
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Sampeyan uga bisa nggunakake Pintasan Keyboard: { sc-review-form-button-approve-shortcut } kanggo Nyetujoni, { sc-review-form-button-reject-shortcut } kanggo Nolak, { sc-review-form-button-skip-shortcut } kanggo Nglewati
sc-review-form-button-submit =
    .submitText = Rampungake Reviu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ora ono ukara sing diteliti.
       *[other] { $sentences } ukara wis ditliti. Matur nuwun!
    }
sc-review-form-review-failure = Review ora bisa disimpen. Mangga coba maneh mengko.
sc-review-link = Review

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kriteria Review
sc-criteria-title = Kriteria Review
sc-criteria-make-sure = Priksa manawa ukara kasebut memenuhi kritéria ing ngisor iki:
sc-criteria-item-1 = Ukara kasebut kudu dieja kanthi bener.
sc-criteria-item-2 = Ukara kasebut kudu bener sacara tata basa.
sc-criteria-item-3 = Ukara kasebut kudu bisa diucapake.
sc-criteria-item-4 = Yen ukara kasebut memenuhi kriteria, klik tombol &quot;Setuju&quot; ing sisih tengen.
sc-criteria-item-5-2 = Yen ukara kasebut ora memenuhi ndukur e kriteria, klik tombol &quot;Tolak&quot; ing sisih kiwa. Menawi sampeyan ora yakin kaliyan ukara kasebut, sampeyan uga bisa nglewati lan pindhah ing ukara sabanjure.
sc-criteria-item-6 = Yen ukaramu wis entek kanggo dideleng, tulungi kita ngumpulake ukara liyane!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Priksa <icon></icon> apa iki ukara sing bener sacara linguistik?
sc-review-rules-title = Apa ukara kasebut wis memenuhi pedoman?
sc-review-empty-state = Saiki durung ana ukara sing bisa direviu nganggo basa iki.
report-sc-different-language = Beda basa
report-sc-different-language-detail = Iki ditulis nganggo basa sing beda karo sing tak reviu
sentences-fetch-error = Ana kesalahan nalika njupuk ukara
review-error = Ana kesalahan nalika mriksa ukara iki
review-error-rate-limit-exceeded = Sampeyan kecepeten. Mangga sedhela kanggo mriksa ukara kasebut kanggo mesthekake yen wis bener.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Kita lagi nggawe sawetara owah-owahan gedhe
sc-redirect-page-subtitle-1 = Pengumpul Ukara lagi pindhah menyang platform inti Common Voice. Saiki sampeyan bisa <writeURL>nulis</writeURL> ukara utawa <reviewURL>review</reviewURL> pengiriman ukara tunggal ing Common Voice.
sc-redirect-page-subtitle-2 = Takon marang kita pitakonan ing <matrixLink>Matrix</matrixLink>, <discourseLink>DiscourseLink</discourseLink> utawa <emailLink>email</emailLink>.
# menu item
review-sentences = Reviu Ukara
