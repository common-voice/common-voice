## REVIEW

sc-review-lang-not-selected = Ó ka' cǐ sɔm ghɔm. Wɔ́ gɔ́ kəm nə́ <profileLink>cə́ mcuŋ mǔ</profileLink> tə́ nə́ cǐ shə́ mghɔm.
sc-review-title = Nə́ tiŋtə mkâmghɔm
sc-review-loading = Nə́ pɛ́tə́ mkâmghɔm
sc-review-select-language = Wɔ́ gɔ́ ci ta' ghɔm yə ó gɔ nə́ tiŋtə mkâmghɔm áa.
sc-review-no-sentences = Sɔm kâmghɔm diŋtə tiŋtə tə́ sǐ pə́. Ó fíŋ nə́ <addLink>cwɛp shə mkamghɔm dyɛ'</addLink>.
sc-review-form-prompt =
    .message = Á bə́ pú kétə cyâ mkâmghɔm myə é pú tiŋtə áa, ó wə́ cəŋ nə́ nə dɔ́kɛ á?
sc-review-form-usage = Kwa tʉ̌ nə́ ghəŋ ntʉɔ̂ tə́ nə́ byə̂ŋ kâmghɔm. Kwa tʉ̌ nə́ ghəŋ kwyàp tə́ nə́ bâ' kâmghɔm jʉm. Kwa tʉ̌ nə́ ghəŋ təŋ ka'ŋ tə́ nə́ nəŋtə́ kâmghɔm. <strong>Pɔ́mtə tyɔ̌nyə nə́ cyà mpé myə é fa' tiŋtə yə́ ó gə á da'tə lə!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Tsʉ' lə: { $sentenceSource }
sc-review-form-button-reject = Nə́ pâ' jʉm
sc-review-form-button-skip = Nə́ cyə̀
sc-review-form-button-approve = Nə́ pyə̂ŋ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Ó fíŋ hwìm bǎ mkâmjyə nə́ tə̌fî məsíŋ pa' : { sc-review-form-button-approve-shortcut } nə́ nə byə̂ŋ, { sc-review-form-button-reject-shortcut } nə́ nə bâ' jʉm, { sc-review-form-button-skip-shortcut } nə́ nə cyə̀
sc-review-form-button-submit =
    .submitText = Nə́ miŋ nə́ tiŋtə
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Sɔm kâmghɔm diŋtə tiŋtə.
        [one] Ta' kâmghɔm bə́ pú tiŋtə. Motokwa!
       *[other] { $sentences } kâmghɔm bə́ pú tiŋtə. Motokwa!
    }
sc-review-form-review-failure = Pú ka' fɛ́ dwɔ̂' nə́ tiŋtə zhyə̂. Wɔ́ gɔ́ cwə̌ kwi' fo'tə.
sc-review-link = Nə́ tiŋtə

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Mbʉə́ə nə́ diŋtə
sc-criteria-title = Mbʉə́ə nə́ diŋtə
sc-criteria-make-sure = Cə̌ŋtə dé tə́ kâmghɔm pə́ wə́ giŋ də̌ŋdəŋ nə́ mbʉə́ə mɔ̌gaə́:
sc-criteria-item-1 = Á gɔ pə́ bə́ pú və̀ kâmghɔm kwa' pəpúŋ
sc-criteria-item-2 = Mbǐnyə ghɔm ntʉ́m kâmghɔm gɔ̌ pə́ tə byà
sc-criteria-item-3 = Kâmghɔm gɔ̌ pə́ yə é bə́ pú ké lə
sc-criteria-item-4 = Kâmghɔm pə́ wə́ giŋ də̌ŋdəŋ nə́ mbʉə́ə mɔ̌gaə́, ó nwɔ' nə́ tsu' nwɔ'tə « Nə́ pyə̂ŋ » nə́ ghəŋ ntʉɔ̂.
sc-criteria-item-5-2 = Kâmghɔm cyə̌tə pə́ wə́ giŋ nə́ mbʉə́ə mɔ̌gaə́ pə́, ó nwɔ' nə́ tsu' nwɔ'tə « Nə́ pâ' jʉm » nə́ ghəŋ kwyàp. Ó pə́ wə zhʉ'nyə, bə́ ó fíŋ bâ nə́ ya'nyə nəŋ nə́ yə kâmghɔm dzə.
sc-criteria-item-6 = Á pə́ bə́ ó kǎ kwi' ghə mkâmghɔm diŋtə tiŋtə, ó kwǐtə wɔk nə́ cu'tə shə mkâmghɔm dyɛ'!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Cə̌ŋtə diŋtə <icon></icon> tə́ kâmghɔm pə́ tə́ byà nə́ mzhəŋ ghɔm
sc-review-rules-title = Tə́ kâmghɔm wə́ giŋ də̌ŋdəŋ nə́ mbʉə̌ nwə lə ?
sc-review-empty-state = Kwâ' cwəlɔ̌ sɔm kâmghɔm yə pú gɔ̌ tiŋtə ntʉ́m yəŋgaə́ ghɔm á tə́ si pə.
report-sc-different-language = Mú ghɔm dyɛ'
report-sc-different-language-detail = Á bə́ pú lə́ ghɔm dyɛ' və̀ kâmghɔm yə gaə́ bə́ wə́ biŋ ké ntʉ́m yəŋ ghɔm lə.
sentences-fetch-error = Pú pə́ cəŋ nə́ pyəŋ kwi mkâmghɔm byà tʉ
review-error = Pú pə́ cəŋ nə́ tinyə mkâmghɔm byà tʉ
review-error-rate-limit-exceeded = Ó wə́ də́gu' fa' tɛ'. Wɔ́ gɔ́ na' zhwi'tə tə́ biŋ ké kâmghɔm səə nəŋ cəŋtə dé tə á pə́ tə bya.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Pyə̌ si bə́ wə́ kwâtə mfa' kwǐpnyə sə myə gwyə
sc-redirect-page-subtitle-1 = Pú cya tsu' cú'tə mkâmghɔm nə́ ghəŋ múyɔ̌ fa' Common Voice. Tə́ tɔ' fə̂ cwəlɔ̌ ó fíŋ nə́ <writeURL>və̀</writeURL> ta' kâmghɔm kə <reviewURL>diŋtə</reviewURL> mkâmghɔm də̀m múyɔ̌ fa' Common Voice.
sc-redirect-page-subtitle-2 = Hə́ŋtə wɔ́k guŋ pǒtsə wɛ nə́ <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> kə́ <emailLink>cyə'm nə́ e-mail lə</emailLink>.
