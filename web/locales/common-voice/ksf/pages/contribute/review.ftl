## REVIEW

sc-review-lang-not-selected = Bia bɔnɨ bɨ kɨtokɨ . Dɨŋghɨ  bɨ<profileLink>djaŋ yɔ </profileLink> lə u teg bɨtokɨ.
sc-review-title = Pɛpsɛn məkanɨ
sc-review-loading = Məkanɨ mə rɨ bɨ dɨ dɨnghɨ ...
sc-review-select-language = Bɔna  bɨtokɨ lə bɨ yɛn mətokɨ
sc-review-no-sentences = Məkanɨ mə n yɛn mə yin . Bɨrɨ lə  <addLink>butɛn tɨ məkanɨ</addLink>.
sc-review-form-prompt =
    .message = Məkanɨ mə tia yɛɛ ma kɛɛ bɨ, bii kɔdɨ lə tɨ kɛn a suu?
sc-review-form-usage = Sɛdɨ a zɨg i nwelɛm lə yerɛn məkanɨ.Sɛdɨ bɨ kɨmɨn lə u tsai. Bɔgha a dio kɔ kɨ tsom. <strong> kɔ dimzɛn dɨ rom dɨ kɨsal kɨ wa  pɛpsɛ ! <strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Djaŋ inə ka yuu: { $sentenceSource }
sc-review-form-button-reject = Dɨ tsarɛn
sc-review-form-button-skip = Dɨ fierɛn
sc-review-form-button-approve = Dɨ yɛrɛn
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ɛ
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = e
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = N
sc-review-form-keyboard-usage-custom = U lə u sal dɨ bɔɔ bee bə bɨ dɨ kanɛn : { sc-review-form-button-approve-shortcut } lə dɨ yerɛn { sc-review-form-button-reject-shortcut } pour rejeter, { sc-review-form-button-skip-shortcut }lə dɨ fierɛn
sc-review-form-button-submit =
    .submitText = Ləgsɨ dɨ pɛpsɛn
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] məkanɨ mə n pɛpsɛn mə yin .
        [one] nkanɨ bog a dɨ pəksɛn . Bɨtoksɛn !
       *[other] { $sentences } n pɛpsɛ nkanɨ. Bɨtoksɛn  !
    }
sc-review-form-review-failure = Kɨsal kɨ yin n nyamɛn
sc-review-link = Pɛpsɛn tɨtɨ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Pɛpsɛn kɨ tii nkɔn
sc-criteria-title = Pɛpsɛn kɨ tii nkɔn
sc-criteria-make-sure = Ghɛna ɨ məkanɨ mə rɨ loŋ ye tii nkɔn
sc-criteria-item-1 = Mɨkanɨ mə yɛsɛ baa dɨ balɛn lə siesie
sc-criteria-item-2 = Mɨkanɨ mə yɛsɛ baa dɨ kanɛn  lə siesie
sc-criteria-item-3 = Mɨkanɨ mə yɛsɛ baa dɨ kanɛn  lə siesie
sc-criteria-item-4 = Ɨ məkanɨ mə rɨ lɔŋ ye tin nkɔn, koma bɨ  « yerɛn » bɨ nwelɛm
sc-criteria-item-5-2 = Ɨ məkanɨ mə rɨ lɔŋ ye tin nkɔn bɨ dio,koma bɨ  « tsara  » bɨ kɨmɨŋ. Ɨ bii fəg lə bɨ rɨ bɨ tsai , tsarɨna
sc-criteria-item-6 = Ɨ bɨ yii dɨ dɨ məkanɨ mə bɨ pɛpsɛn, yemsɨ bɨsɨ dɨ bə məkanɨ
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pɛpsɛn<icon></icon>
sc-review-rules-title = Məkanɨ mə rɔtɛɛ?
sc-review-empty-state = Məkanɨ mə yin bɨsuu dɨ pɛpsɛn bɨ gomnə
report-sc-different-language = Bɨtokɨ bɨ bog
report-sc-different-language-detail = Məkanɨ mə rɨ nkanɛn bɨ kɨtokɨ kɨ bog kɨ nbalɨ
sentences-fetch-error = Kɨban kɛ kpaghɨ bɨ dɨ dɨ teg dɨ məkanɨ
review-error = Ɨ ban kɛ kpaghɨ bɨ dɨ dɨ yɛn  dɨ məkanɨ
review-error-rate-limit-exceeded = Biŋ kɛn lə fiɛg. Tera maa tsamɛn lə u bal dɨ dɨ yɛn ɨ nko kɨ rɨ nkanɛn lə siesie
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tii tsendə kɨsal
sc-redirect-page-subtitle-1 = Nterɛn a məkanɨ a kɛɛ yee Common Voice. Bɨ yɛsɛ lə  <writeURL>dɨ kan </writeURL> məkanɨ nkoo </reviewURL>pɛpsɛn</reviewURL>bə məkanɨ mə Common Voice.
sc-redirect-page-subtitle-2 = Tɔna bɨsɨ kɨ bii nkɔn bɨ  <matrixLink>Matrix</matrixLink>, <Discourse>Discourse</discourseLink> too <emailLink>bɨ e-mail</emailLink>
