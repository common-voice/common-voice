## REVIEW

sc-review-lang-not-selected = o nji top nkobô esiñ. Kele<profileLink> abam duè<profileLink> o top minkobô
sc-review-title = tuaneya fas nloñ bifiè
sc-review-loading = bifiè bivo'o bia zu
sc-review-select-language = top nkobô asu ya na o tuana fas minloñ bifiè
sc-review-no-sentences = ka'a nloñ éfiè ésiñ be ne fas/ O ne <addLink>koghlo bifiè bife<addLink>
sc-review-form-prompt =
    .message = minloñ bifiè bi ve koghlo mi nji kia ke, ye wa koma ke osu?
sc-review-form-usage = kele mbô nnom nge wa koma yebe bifiè. Kele mbô nga'a nge momo. Firi ayop nge jam té da ndeghle ki. <strong>O ta'a vuène a lom éyalan duè<strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = metara{ $sentenceSource }
sc-review-form-button-reject = a ben
sc-review-form-button-skip = dañe lor
sc-review-form-button-approve = e yebe
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ya!
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = momo
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = eyoñ ésiñ
sc-review-form-keyboard-usage-custom = o ne belan a bitun mezen:   { sc-review-form-button-approve-shortcut }nge ya yebe, { sc-review-form-button-reject-shortcut }nge wa ben  { sc-review-form-button-skip-shortcut } nge wa lor
sc-review-form-button-submit =
    .submitText = ye o maneya tuana bebe
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] be nji bebe nloñ bifiè ésiñ
        [one] nloñ bifiè mbo'o o ve tuana fa'aban. Akiba!
       *[other] Bifiè bi tuana fa'aban. Akiba!
    }
sc-review-form-review-failure = bi nji kui na bia ba'ale osiman. Bereya ve'ele éyoñ efe
sc-review-link = e vé dissbera ba'ala

## REVIEW CRITERIA

sc-criteria-modal = ⓘ mendem m'ayé'é
sc-criteria-title = mendem m'ayé'é
sc-criteria-make-sure = koma fas nge nloñ bifiè o bele mendem ma toñ ma :
sc-criteria-item-1 = nloñ bifiè wa yièna bo mbemba ntilan
sc-criteria-item-2 = nloñ bifiè wa yièna bi mbemba atimi
sc-criteria-item-3 = nloñ bifiè wa yiéna tuana lañban
sc-criteria-item-4 = nge nloñ bifiè ô bele mendem mese, firi atuan "Yebe" mbô nnôm
sc-criteria-item-5-2 = nge nloñ bifiè ô bele ki mendem mese, firi atuan "bene" mbô nga'a. nge wa soane, o ne dañ a ke nloñ wa toñ
sc-criteria-item-6 = nge bifiè bife ya fas bi se; voloye bia njeñ bife
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = tuaneya fas<icon></icon> nge nloñ bifiè o ne mbemba nkoban
sc-review-rules-title = ye nloñ bifiè wa sémé metiñ
sc-review-empty-state = ka'a nloñ éfiè be ne fas nkobo wi
report-sc-different-language = nkôbô ofe
report-sc-different-language-detail = nloñ bifiè o ne ntilan nkobô ofe , sa'a éwi ma lañ
sentences-fetch-error = ékop é ve yéné éyoñ ye nyoane bifiè
review-error = ékop é ve yéné éyoñ bi ve koma tuana tili nloñ bifiè
review-error-rate-limit-exceeded = wa ke édeda'a avo'o. nyoñ éyoñ ya bera lañ a yen nge nloñ bifiè o ne zôsô
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = bia tyen abui mam me ne a nfi
sc-redirect-page-subtitle-1 = be ve tyèn été nyoñ bifiè, o ntôo ya étyimi Common Voice. O nto <writeURL> a tili <writeURL> nloñ bifiè ng'a </reviewURL> tuana fas </reviewURL> minloñ bifiè e Common Voice
sc-redirect-page-subtitle-2 = siliyana biè minsili e <matrixLink> Matrix <matrixLink>,  <discourseLink> Discourse <discourseLink> nge ki </emailLink>. e-mail</emailLink>.
