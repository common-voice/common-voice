## REVIEW

sc-review-lang-not-selected = Bí gǝ̀ yɔ̌ŋ ndû tɑ̀h lɛ́n. Nɛ̌n tɔ̌<profileLink>yù dʉ̂ ncúp</profileLink>nǝ̀ lǔ' tàh lɛ́n
sc-review-title = lɔ́dǝ́ ncúp
sc-review-loading = yɑ́p ncúp
sc-review-select-language = lǔ'ǝ́ tàh lɛ́n nǝ lɔ́dǝ́ ncúp
sc-review-no-sentences = sɔ̌ cúp zǝ̄ bū lɔ̂dǝ́ lá. bí fít<addLink> nǝ̀ tsẁdǝ̌ tsǝ̀mû' ncúp</addLink>
sc-review-form-prompt =
    .message = bú gǝ̀ yɔ̌ŋ câk ncúp zǝ̄ bū yǎ lɔ́dǝ́ lá. Bí cwɛ̌d nǝ̌ nɛ̌n mbwǝ̀ gí
sc-review-form-usage = nyǔ' nzî nǝ̀ bámǝ́ cúp la, nyǔ' bāk nzî nǝ̀ rá, nyǔ' nzî nǝ nyágǝ̀ yǝ́.<strong>Kâ làgdǝ̌ nǝ̀ làgdǝ̌ zǝ̄ ū lû' lá!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ŋwà'nì { $sentenceSource }
sc-review-form-button-reject = rá
sc-review-form-button-skip = cǎ
sc-review-form-button-approve = bɑ́mǝ́
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = n
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = s
sc-review-form-keyboard-usage-custom = bí fít nǝ̀ kǐ bû kǝ̂tpǝ̀ nzǝ̀: { sc-review-form-button-approve-shortcut } nǔ nǝ̀ bɑ́mǝ́; { sc-review-form-button-reject-shortcut } nǔ nǝ̀ vwáh,{ sc-review-form-button-skip-shortcut } nǔ nǝ̀ tɔ́k
sc-review-form-button-submit =
    .submitText = myɑ̀də̌ nǝ̀ lɔ́dǝ́ mǝ̀brɔ́
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] sɔ̌ cúp zǝ̄ bū lɔ̂dǝ́
        [one] tàh cúp zǝ̄ bū lɔ̂dǝ́
       *[other] ncúp zǝ̄ bū lɔ̂dǝ́ lá
    }
sc-review-form-review-failure = bǝ̌ gǝ̀ brɔ̌ lǝ̌ jú zǝ̄ ū lɔ̂dǝ́ lā
sc-review-link = lɔ̂dǝ́

## REVIEW CRITERIA

sc-criteria-modal = nǝ̀ lɔ̄dǝ́ cú
sc-criteria-title = cu ́nǔ nǝ̀ lɔ̄dǝ́
sc-criteria-make-sure = Bìn lɔ́dǝ́ mǝ̀brɔ́ cûp mbǝ̌ a ̀bǝ́ mbâ cǝ̂ ŋwànǐ lî
sc-criteria-item-1 = cúp rǝ̌ nǝ̀ bǝ́ zǝ̄ bú kǐ mǝ̀bwo
sc-criteria-item-2 = cúp rǝ̌ nǝ̀ bǝ́ zǝ̄ bú nàptǝ̌ mǝ̀bwo
sc-criteria-item-3 = cúp rǝ̌ nǝ̀ bǝ́ mbā bú fî nə́ jú'ǝ́
sc-criteria-item-4 = àmbǝ́zǝ̄ cûp bǝ̂ mǝ̀bwo lā û nyû nǝ̀ bɑ́mə́
sc-criteria-item-5-2 = àmbǝ́zǝ̄ cûp nyâgǝ bǝ́ mǝ̀bwo lā bî nyû nǝ̀ bàdǝ̌. àmbǝ́zǝ̄ cûp nyâgǝ bǝ́ mbɑ̄ bí cwɛ̌d kwâdǝ́ lá bí tɔ̂k nɛ̂n mbrǝ̀
sc-criteria-item-6 = bì nyɑ́gǝ̀ bɛ̀n rə̌ ncûp nǝ̄ lɔ́də́, bî wîndǝ̂ yǝ́k nǝ̀ rǝ̌ mû cúp
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = lɔ̂dǝ́<icon></icon> mbǝ́zǝ̄ bū kî ncúp lā mǝ̀bwó
sc-review-rules-title = ncúp bǝ́ á mbɑ́ bʉ́ bɛ́tǝ́ lɑ́ gī?
sc-review-empty-state = ndɔ̌lî sɔ̌ ncúp nǝ́ bɛ̀n lɔ́dǝ́ tɔ̌ yǝ̂n lɛ́n lî
report-sc-different-language = mû' lɛ́n
report-sc-different-language-detail = bú khǐ cúp tɔ̌ mǔ' lɛ́n vwɑ́ gǝ̀bǝ́ zǝ̄ mǝ̄ cɛ̌d bɛ̌n syɑŋǝ́
sentences-fetch-error = tɑ̀h nǔ tɔ́k tɑ̂mǝ̀ nǝ̀ kwé ncúp
review-error = tɑ̀h nǔ tɔ́k tɑ̂mǝ̀ nǝ̀ yɑ́nǝ́ ncúp
review-error-rate-limit-exceeded = Bǐn cɛ̌n nɛ̂n ndǝ̂ndǝ́. Bì lú'ǝ́ tàh tɑ́mǝ́ nǝ́ bɛ̀n siạ́ŋǝ́ cúp nǔ nǝ̀ lǝ̀ lɛ̀n mbǝ́zǝ́ ɑ̀ bǝ̌ mǝ̀brɔ́
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = bɑ̌k cɛ̀d bɑ̂dǝ̂ bà cú mɑ̂yɑ́mǝ́
sc-redirect-page-subtitle-1 = jû nǝ́ rǝ̌ ncúp lɑ́ tɑ̀mndǝ̂ lá. Bí yɑ́ fít nǝ̀<writeURL> kǐ</writeURL>tà' ncúp ô <reviewURL> nǝ̀ lɔ́dǝ́ </reviewURL> ncúp mɑ́ tɑ̀mndǝ̂ lá
sc-redirect-page-subtitle-2 = bì yɑ̌ fít nǝ̀ bɛ́tǝ́ tàh jú nù<matrixLink><discourseLink></discourseLink> ncúp rǝ̌ nkrʉ̀n<emailLink></emailLink>
