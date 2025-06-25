## REVIEW

sc-review-lang-not-selected = pɔ̌ kâ ténə́ ntsɔ᷇ yɛcʉ́ə tsǎp .  Ghʉə́ nǒ ndɛ'nə  <profileLink> yɔ̌  mə́ténənə </profileLink> ntsɔ' mə́tsǎp
sc-review-title = məsênə məŋkyě ŋwɛ'nə
sc-review-loading = mətyénə məŋyě ŋwɛ'nə
sc-review-select-language = ténə́  ntsɔ' tâ' tsǎp lɔ sénə́ mə́ŋkyě ŋwɛ'nə
sc-review-no-sentences = kea ŋkyě ŋwɛ'nə məsênə . Mbî pɔ̌ <addLink> kwɛ́'nə nəghǎ məŋkyě ŋwɛ'nə  </addLink>.
sc-review-form-prompt =
    .message = məŋkyě ŋwɛ'nə séénə́ mɛ tɔ́nə́ pɔ̂, pɔ̌ nə́ nyê mə́lɔ̌nə ŋgʉ́ə́ nə̂ shʉ̂ ?
sc-review-form-usage = sə̌t ŋgʉə́ nǒ pwâ tə ndɔ́ ní' lɛ'nə nǒ ŋkyě ŋwɛ'nə .  Sə̌t ŋgʉə́ nǒ pwâ kwɛp ndɔ́ fúnə́ myɛ́. Sə̌t ŋkɔ́' tʉ́ə ndɔ́ fə́nə́.  <strong> Pɔ̌ ma mɛ́'nə́ kə ŋá ndʉ́nə mbə́nə kwénə zyé'nə </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Nəsá'nə  { $sentenceSource }
sc-review-form-button-reject = məfúúnə myě'
sc-review-form-button-skip = məlěnə
sc-review-form-button-approve = mənə̌tnə ndʉnə
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ə̂
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ŋ
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = m
sc-review-form-keyboard-usage-custom = Mbî pɔ̌ mʉ́əlyê məkə̌t  { sc-review-form-button-approve-shortcut } lɔ mbé,  { sc-review-form-button-reject-shortcut } lɔ myê' , { sc-review-form-button-skip-shortcut }  lɔ ndê,
sc-review-form-button-submit =
    .submitText = mə́lʉinə́nə nə ténə́nə́
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] kɛa ŋkyě ŋwɛ'nə ténə́nə́
        [one] 1 ŋkyě  ŋwɛ'nə ténənə́.  Pʉ̌ tsɛ'nə̂ !
       *[other] { $sentences }  məŋkyě  ŋwɛ'nə ténənə́.  Pʉ̌ tsɛ'nə̂ !
    }
sc-review-form-review-failure = Pə́ ká fit mətɛ́pmə nə ténə́nə́ ,  penə́nə mɔ̂ nɔ ndǒ .
sc-review-link = kwénə́nə

## REVIEW CRITERIA

sc-criteria-modal = məlɛ'nə kwénə́nə
sc-criteria-title = məlɛ'nə kwénə́nə
sc-criteria-make-sure = Pɔ̌ zí ŋgâ' ŋkyě ŋwɛ'nə ghʉə́ ncu᷇' nõ məlɛ'nə mʉ́ə :
sc-criteria-item-1 = pə tsónə᷇  ŋwɛ'nə᷇ ŋkyě ŋwɛ'nə
sc-criteria-item-2 = ŋkyě ŋwɛ'nə pə́ nə̂ ntyâ yɛ̌
sc-criteria-item-3 = ŋkyě ŋwɛ'nə pə́ ŋgâ' mbî pə́ cû nə̂ ntsət
sc-criteria-item-4 = ŋkyě ŋwɛ'nə mbɔ̂ nǒ məlɛ'nə pɔ̌ nɔ̂' ndî mba' «mə́pe᷇nə  »  nǒ pwâ tə
sc-criteria-item-5-2 = ŋkyě ŋwɛ'nə nzî mbɔ̌ nǒ məlɛ́nə mʉ́ə tʉ᷇ pɔ̌ nɔ' nǒ ndî mba' « məmyyye'nə  »  nǒ pwâ kwɛp . Pɔ̌ ntə́ ŋkə́'nə᷇ , pɔ tɔ́mə ŋgʉ́ə́ shʉ̂
sc-criteria-item-6 = Pɔ̌ nzî ŋgwě  məŋkyě  ŋwɛ'nə mâ pə́ ndinə, pɔ̌ hɛ́mə wʉ́ mə́cu'nənə məŋkyě ŋwɛ'nə !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pɔ línə᷇ njʉə́ <icon></icon> ŋgâ' ŋkyě ŋwɛ'nə pɔ̌ nǒ tsǎp pa pə .
sc-review-rules-title = ŋkyě ŋwɛ'nə pɔ̌ nǒ  ntyâ yâ pə́ ŋánə᷇ ?
sc-review-empty-state = kea ŋkyě ŋwɛ'nə   ghó pə́ ŋgâ' pə́  ndinə́ fwo ghʉ́ə tsǎp .
report-sc-different-language = yɛcə́ tsǎp
report-sc-different-language-detail = Pə́ ŋwɛ'nə́ ŋkyě ŋwɛ'nə pə́ fwo tsǎp ndǒ, á má mbə́ ghʉ́ə ŋgâ' pə́ me lyê
sentences-fetch-error = Yɔ̂ ghɛ́ánə́  nǒ nɔ wâ pə lǎ ŋə᷇ ncû'nə məŋkyě ŋwɛ'nə .
review-error = Yɔ̂ lǎ ghɛ́ánə́  nɔ wâ pə́ ŋwɛ'nə  nə́ŋkyě ŋwɛ'nə wʉ̂ə .
review-error-rate-limit-exceeded = Pɔ̌ tə́ fɛ᷇t . Pɔ̌ ná' njwɛ́'nə mbénə᷇ mê ŋkyě ŋwɛ'nə lə́ njʉ́ə́ mbə́ yâ a pɔ̌ .
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Pʉ̌ tə᷇ ŋkʉ́ip kwa' mənə ghínə́nə
sc-redirect-page-subtitle-1 = Yɔ̂ yâ a cû'nənə́ məŋkyě ŋwɛ'nə a tsínə́ ŋgʉə́ fwo Common Voice.  Mbî pɔ̌ ghʉ́ə fwo Common Voice <writeURL>  ŋwɛ́'nə᷇ </writeURL> tâ' ŋkyě ŋwɛ'nə mba <reviewURL> ndínə᷇ məŋkyě ŋwɛ'nə </reviewURL>
sc-redirect-page-subtitle-2 = Pɛ́ánə́nə wʉ́ nə̂ mənə nǒ <matrixLink>Matrix</matrixLink>, <discourseLink>  kʉ́ímə́ tsǎp </discourseLink> kə mba <emailLink>  lɛ'nə ŋô </emailLink>.
# menu item
review-sentences = məsênə məŋkyě ŋwɛ'nə
