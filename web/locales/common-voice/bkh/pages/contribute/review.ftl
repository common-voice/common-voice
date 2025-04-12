## REVIEW

sc-review-lang-not-selected = Wah pɔŋɔɔ ɓe mpɔ́t tɔ wá. Niŋgíí vá  <profileLink>á titíí yɔɔ</profileLink> á lipɔhɔɔ lí mimpɔ́t
sc-review-title = Leg'ɓé akwɛla
sc-review-loading = Mveŋ'hanɛ akwɛla
sc-review-select-language = Pɔhɔ́ɔ́ mpɔ́t wa anyuú liɓɛ li mbaki la akwɛla
sc-review-no-sentences = Ɔkwɛla tɔ va ví seɓe. Ɔ lɛ nɛ́ <addLink>wa kondye akwɛla</addLink>.
sc-review-form-prompt =
    .message = Akwɛla wáh om'ɓɛ́ɛ ɓé, ɔg somoo sig pɛ liceg'lɛɛ ?
sc-review-form-usage = Duutɛɛ á mɓɛnlomɛ́ anyuú liyeɓé lí ɔkwɛla. Duutɛɛ á mɓɛngáá anyuú liɓen l' ɔkwɛla. Tíínɛ́ɛ á loó anyuú ngi liyí. <strong>ɔ volkagán ɓé liom li mbag ɛ nsom wɔɔ ! </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Lisɔ́lé : { $sentenceSource }
sc-review-form-button-reject = liɓen
sc-review-form-button-skip = liloo
sc-review-form-button-approve = liyeɓe
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Ɔ lɛ nɛ́ wa ɓɔŋ'le yi nzen ɛ tafel :  { sc-review-form-button-approve-shortcut } anyuu liyéɓé, { sc-review-form-button-reject-shortcut } anyuú liɓen, { sc-review-form-button-skip-shortcut } anyuú liloo
sc-review-form-button-submit =
    .submitText = limanɛ lí nsɔ́n
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ɔkwɛla tɔ wa vi seɓe.
        [one] ɔkwɛla va pam. Masoma !
       *[other] { $sentences } akwɛla wa ɛ́ni. Masoma !
    }
sc-review-form-review-failure = Ɓaá la ɓé ɓɛhɛ liɓɛ li mbaki á linaŋɛ l' akwɛla. Ceg'lɛɛ sig pɛ váŋ vɔŋɔ́.
sc-review-link = liɓákɛ́

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Bitɛɛyéné bi linyamɛ́ lí pɔŋ
sc-criteria-title = Bitɛɛyené bi linyamɛ́ lí pɔ́ŋ
sc-criteria-make-sure = Ɓɛ́ mbaki nɛ́ ɔkwɛla víg oŋ'le bí bitɛɛyené:
sc-criteria-item-1 = Ɔkwɛla ví lɛ ntiiɓɛgɛ mɓɛɛŋ
sc-criteria-item-2 = Ɔkwɛla ví ŋóŋɓɛgɛ mɓɛɛŋ
sc-criteria-item-3 = Ɔkwɛla víg páh'lɛ́ɛ mɓɛɛŋ
sc-criteria-item-4 = Kiyaɓɛnɛ ɔkwɛla víg oŋ'le bíŋ bitɛɛyené, mɔt «liyéɓé» á mɓɛnlomɛ́
sc-criteria-item-5-2 = Kiyaɓɛnɛ ɔkwɛla vi ngá oŋ'le ɓé bitɛɛyené bi lɛ á loó, mɔt «liɓen» á mɓɛngáá. kiyaɓɛnɛ ɔ seɓé mbaki loó á jam litám
sc-criteria-item-6 = Kiyaɓɛnɛ ɔ byɛɛ ɓé pɛ́ akwɛla, ɔŋganɛ ɓɛhɛ likɔt l' atám
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Leg'ɓe <icon></icon> kiyaɓɛnɛ ɔkwɛla vá tiiɓɛɛ mɓɛɛŋ kaa ɛ ngáa ɓat
sc-review-rules-title = Ɔkwɛla víg óg'le mimbendá ?
sc-review-empty-state = Bi byɛɛ ɓé ɓɛhɛ ɔkwɛla tɔ va mú á nyú mpɔ́t.
report-sc-different-language = Mpɔ́t ntámmpɔ́t ntám
report-sc-different-language-detail = Ɔkwɛla va tiiɓɛɛ a mpɔ́t nyú á seɓe nyú mi lɛ lisɔ́ŋgɔ́ɔ
sentences-fetch-error = Ɓaá kuh'la ɔnɛ́g á linyɔŋ l' akwɛla
review-error = Baá kuh'la ɔnɛ́g á lioŋ lí ví ɔkwɛla
review-error-rate-limit-exceeded = Ɔg vóó ngandag. Nyoŋ eceg, sɔŋgɔɔ ɔkwɛla mɓɛɛŋ, ɔ leg'ɓe kiyaɓɛnɛ njom ɛ seɓe.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Bi lɛ liveŋ'hanɛ lí mam
sc-redirect-page-subtitle-1 = Nkomanɛ akwɛla a lɛ ɔku ví common Voice. Ɔ lɛ nɛ <writeURL>wa  cii</writeURL> ɔkwɛla tɔnɛ́ <reviewURL>lileg'ɓe</reviewURL> l' akwɛla á common Voice.
sc-redirect-page-subtitle-2 = Ɓat mbihíí yɔɔ a <matrixLink>Matrix</matrixLink>, <discourseLink>Nkwɛl</discourseLink> tɔnɛ́ <emailLink>á kwɛ́m</emailLink>.
# menu item
review-sentences = Leg'ɓé akwɛla
