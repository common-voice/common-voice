## REVIEW

sc-review-lang-not-selected = Ɛnɛ hók ŋma nú na. Nɛ́ si tɛ <profileLink>mɔ̀ɔ́iŋyí'nɛ</profileLink> wen hóká o nú.
sc-review-title = Zii o núwen nɛ sàá̧
sc-review-loading = Kpaia o núwen ...
sc-review-select-language = Hók ŋma nú wen zia o núwen nɛ sàá̧.
sc-review-no-sentences = Ŋma núwen zii-sá̧ bo na. Ɛnɛ nyɛma <addLink>aa o núwen zú-a há̧ dɔk</addLink>.
sc-review-form-prompt =
    .message = O núwen nɛ'i zia-sá̧ tom hɔ́ na, ɛnɛ kɔ̀ɔ̧́ mɛ nɛ-siti nde ?
sc-review-form-usage = Dé há̧ tir si wiigo wen kpɛka núwen. Dé há̧ tir si galé wen bɛ̧-aa, é-aa dúk. Dé há̧ tir si gɔn wen é-aa tɛ geemɔ. <strong>Tɛ'nɛ a̧ ka biɗoŋ toma mɔ̀ɔ́oe ɗafamɔ k'ɛnɛ na !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Zúzér-a/Tugun-a : { $sentenceSource }
sc-review-form-button-reject = Bɛ̧-aa
sc-review-form-button-skip = Yák-é-dúk
sc-review-form-button-approve = Kpɛk-aa
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Ɛnɛ nyɛma baa gɔmzaŋ ko mɔ̀ɔ́yɔrmɔ mbɛt : { sc-review-form-button-approve-shortcut } wen kpɛk-aa, { sc-review-form-button-reject-shortcut } wen bɛ̧-aa, { sc-review-form-button-skip-shortcut } wen yak-aa-é-duk
sc-review-form-button-submit =
    .submitText = Kaɗi nɛ kɔ̀ɔ̧́ɗɔ̀ɔ́tom
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ŋma zia núwen sá̧ bo na.
        [one] Zia núwen kpɔk ɔ sàá̧. Yàáɗuk !
       *[other] { $sentences } o-núwen ɔ zia nɛ sàá̧. Yàáɗuk !
    }
sc-review-form-review-failure = Zia núwen nɛ sàá̧'i tigɛr-a tɛ ba so na. We ba-a woyo nɛ ɗoŋ.
sc-review-link = Ɗafaɗoŋmɔ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ O-do ɗafaɗoŋmɔ
sc-criteria-title = O-yuwar ɗafaɗoŋmɔ
sc-criteria-make-sure = Zɔ́k-sá̧ hee núwen nyɛma-yí o do mɔ nɔ̀ɔ́ :
sc-criteria-item-1 = Yɔr yí núwen nɛ de-a.
sc-criteria-item-2 = Núwen a̧ nyɛm yí gun-nú.
sc-criteria-item-3 = Núwen a̧ nyɛm tɔ̧a-a.
sc-criteria-item-4 = Ka núwen a̧ nyɛma yí o do mɔ'ɛ̧, gbɔsi fara « Kpɛk-aa» sɛn wiigo.
sc-criteria-item-5-2 = Ka núwen a̧ nyɛma yí o do mɔ nɛ war-gɔn'i na, gbɔsi fara «Bɛ̧-aa» si-war galé. Ka tàámɔ k'ɛnɛ ɔ yukuta, ɛnɛ nyɛma kpiɗa-a in yaka-a siti mbɛt.
sc-criteria-item-6 = K'ɛnɛ nɛ boo nɛ o nuwen mɛ zii nɛ sàá̧ ɓɔna, ɛnɛ gbák yɛ tɛ mɔi̧a o núwen siti-siti !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Zɔ́k-sá̧ <icon></icon> hee núwen nyɛma yí tɔ̀ɔ̧́ nú-a
sc-review-rules-title = Núwen nyɛma yí yuwar tom-aa nde ?
sc-review-empty-state = Ŋma núwen zii-sá̧ bo kinii tɛ nú'ɛ̧ na.
report-sc-different-language = Ŋma nú nɛtɛ
report-sc-different-language-detail = Núwen yɔra tɛ ŋma nú nɛtɛ in wan n'am tɔr-ɗoŋ'i.
sentences-fetch-error = Ŋma yɔamɔ gɔma ŋgimbi mɔi̧a o núwen
review-error = Ŋma yɔamɔ gboa ŋgimbi tɔra ɗoŋ núwen'i
review-error-rate-limit-exceeded = Ɛnɛ nɛ́nɛ̀ɛ́ nɛ haya-a yak zalé. Ɛnɛ ba ŋma bé ŋgimbi wen tɔra ɗoŋ núwen in zɔ́ka-a sá̧ hee nyɛma sɛnɛ.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Ɛɛ dé nɛ o zɔm kpaiamɔ
sc-redirect-page-subtitle-1 = Mɔi̧ o núwen foo sitɛ gbabeegara Common Voice/Tigɛr Kpɔk. Ɛnɛ nyɛma hegɔ-yaknɛnɛ <writeURL>yɔra</writeURL> ŋma núwen kòó <reviewURL>zia-nɛ-sàá̧</reviewURL> o núwen nɛtɛ Common Voice/Tigɛr Kpɔk.
sc-redirect-page-subtitle-2 = Tom o akamɔ k'ɛnɛ h'ɛɛ zú <matrixLink>Matrix/Nanagunmɔ</matrixLink>, <discourseLink>Discourse/Tɔ̀ɔ̧́-nyɛ́rɛ́</discourseLink> kòó <emailLink>nɛ e-mail</emailLink>.
