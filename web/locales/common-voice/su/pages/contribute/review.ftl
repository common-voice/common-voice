## REVIEW

sc-review-lang-not-selected = Anjeun teu acan milih basa nanaon. Mangga buka <profileLink>Profile</profileLink> anjeun kanggo milih basa.
sc-review-title = Kalimah-kalimah ulasan
sc-review-loading = Ngamuat kalimah…
sc-review-select-language = Mangga pilih basa pikeun marios kalimah-kalimahna.
sc-review-no-sentences = Teu aya kalimah anu kedah diulas. <addLink>Tambahkeun deui kalimah ayeuna!</addLink>
sc-review-form-prompt =
    .message = Kalimah anu tos diulas teu acan dikintunkeun, yakin?
sc-review-form-usage = Geser ka katuhu pikeun satuju kana kalimah éta. Gésér ka kénca pikeun nolak. Geser ka luhur pikeun dilangkungan. <strong>Tong hilap lebetkeun ulasan anjeun!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Sumber: { $sentenceSource }
sc-review-form-button-reject = Tolak
sc-review-form-button-skip = Liwat
sc-review-form-button-approve = Satuju
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Anjeun ogé tiasa nganggo Pintasan Kibor: { sc-review-form-button-approve-shortcut } pikeun Nyatujuan, { sc-review-form-button-reject-shortcut } pikeun Nolak, { sc-review-form-button-skip-shortcut } pikeun Ngalangkungan
sc-review-form-button-submit =
    .submitText = Réngsékeun Ulasan
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Teu aya kalimah nu diulas
       *[other] { $sentences } kalimah parantos diulas. Hatur nuhun!
    }
sc-review-form-review-failure = Ulasan teu tiasa disimpen. Mangga cobian deui engké.
sc-review-link = Ulasan

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kriteria Ulasan
sc-criteria-title = Kriteria Ulasan
sc-criteria-make-sure = Pastikeun kalimah éta nyumponan kritéria ieu:
sc-criteria-item-1 = Kalimahna kudu diéjah kalawan bener.
sc-criteria-item-2 = Kalimahna kudu bener sacara gramatikal.
sc-criteria-item-3 = Kalimahna kudu bisa diucapkeun.
sc-criteria-item-4 = Upami kalimahna nyumponan kriteria, klik tombol "Satuju" di sisi katuhu.
sc-criteria-item-5-2 = Upami kalimahna henteu nyumponan kritéria di luhur, klik tombol "Tolak" di sisi kénca. Upami anjeun teu yakin kana kalimahna, anjeun ogé tiasa ngalangkungan éta sareng teraskeun ka anu salajengna.
sc-criteria-item-6 = Upami anjeun kaséépan kalimah anu kedah diulas, punten bantosan arurang ngumpulkeun langkung seueur kalimah!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pariksa <icon></icon> ieu kalimah leres sacara linguistik atawa henteu?
sc-review-rules-title = Kalimah éta nyumponan pedoman henteu?
sc-review-empty-state = Ayeuna teu acan aya kalimah anu tiasa diulas dina basa ieu.
report-sc-different-language = Basa anu béda
report-sc-different-language-detail = Ieu ditulis dina basa anu béda ti anu keur kuring ulas.
sentences-fetch-error = Aya kasalahan nalika nyokot kalimah
review-error = Aya kasalahan nalika marios ieu kalimah
review-error-rate-limit-exceeded = Anjeun gancang teuing. Mangga parios deui kalimah ieu kanggo mastikeun leres.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Arurang nuju ngadamel sababaraha parobihan ageung
sc-redirect-page-subtitle-1 = Pangumpul Kalimah nuju pindah ka platform inti Common Voice. Ayeuna anjeun tiasa <writeURL>nulis</writeURL> hiji kalimah atanapi <reviewURL>marios</reviewURL> kiriman hiji kalimah dina Common Voice.
sc-redirect-page-subtitle-2 = Tanyakeun ka arurang ngeunaan <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> atanapi <emailLink>email</emailLink>.
# menu item
review-sentences = Ulas kalimah
