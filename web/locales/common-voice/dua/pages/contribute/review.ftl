## REVIEW

sc-review-lang-not-selected = O sí pɔsi ɓwambo tɔ ɓɔɔ́. Sôn alá ó <profileLink>votre profil</profileLink> ó pɔsɔ myambo.
sc-review-title = Ombwá tɛ́ mîn myembá má ɓwambo ɓwǎm̀ɓwam
sc-review-loading = Jǐŋgɛlɛ lá myembá má ɓwambo
sc-review-select-language = Sôn pɔsɔ́ ɓwambo ɓɔɔ́ ná ó ombwe myembá má ɓwambo ɓwǎm̀ɓwam,
sc-review-no-sentences = Mwembá mwá ɓwambo tɔ mɔɔ́ mwá  jombwa ɓwǎm̀ɓwam mú tití
sc-review-form-prompt =
    .message = Myembá má ɓwambo mí ombwáɓɛ́ ɓwǎm̀ɓwam mí sí lómaɓɛ, o mapúlá wala ó ɓosó?
sc-review-form-usage = Nímɛ́lɛ́ lá môm ó jemea mwembá mwá ɓwambo. Nímɛ́lɛ́ lá dimɔsɛ́ ó ɓáŋga mɔ́. Nímɛ́lɛ́ lá mɔ́ny ó jesɛlɛ mɔ́. <strong>O sí dimbéá lóma mbakó á eɓoló áŋgɔ̄ yá sáŋgisɛ </strong>!
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Wúma : { $sentenceSource }
sc-review-form-button-reject = Ɓáŋgâ
sc-review-form-button-skip = Tómbâ
sc-review-form-button-approve = Éméâ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = O ená ó ɓolánɛ́ ŋgeá pɛ́m nyá etilan : { sc-review-form-button-approve-shortcut } ó jěmeea, { sc-review-form-button-reject-shortcut } ó ɓáŋga, { sc-review-form-button-skip-shortcut } ó tómba
sc-review-form-button-submit =
    .submitText = Ɓɔ́lɛ́ eɓoló á jombwa ɓwǎm̀ɓwam
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] mwembá tɔ mɔɔ́ mú sí ombwaɓɛ ɓwǎm̀ɓwam.
        [one] Mwembá mɔɔ́ mú ɔmbwáɓɛ ɓwǎmɓwam. Na sôm !
       *[other] { $sentences } Myembá mí ombwáɓɛ ɓwǎm̀ɓwam. Na sôm !
    }
sc-review-form-review-failure = eɓoló á jombwa ɓé sí íŋgedi ɓwǎmɓwam é sí timbi jǐŋgea, Sôn keká ɓola níka póndá nípɛ́pɛ̄
sc-review-link = Ɓetúkwédí

## REVIEW CRITERIA

sc-criteria-modal = Ɓetésédí ɓá ɓetúkwédí
sc-criteria-title = Ɓetésédí ɓá ɓetúkwédí
sc-criteria-make-sure = Nɔŋgɔ́ póndá ó jombwa ná mwembá mwá ɓwambo mú mabupɛ́ ɓên ɓetésédí
sc-criteria-item-1 = Mwembá mwá ɓwambo mú áŋgámɛ̂n tilaɓɛ ɓwǎm̀.
sc-criteria-item-2 = Mwembá mwá ɓwambo mú áŋgámɛ̂n bupɛ mbéndá á etésɛɓwambo,
sc-criteria-item-3 = Mwembá mwá́ ɓwambo mú áŋgámɛ̂n tɛ́mɛ ó pásɛlɛ láō.
sc-criteria-item-4 = Mwembá mwá ɓwambo mú mabupɛ́ tɛ́ ɓetésédí, mɔtɔ́ ekwɛn á « Émea » ó mǒm.
sc-criteria-item-5-2 = Mwembá mwá ɓwambo mú si mabupɛ́ tɛ́ ɓetésédí ɓé ó mɔ́ny, mɔtɔ́ ekwɛnɛn á « Ɓáŋga » ó dimɔsɛ́. Yétɛ́nɛ́ o tití mbáki, o ená pɛ́ ó kata ó wala ó mwembá mú bupɛ́.
sc-criteria-item-6 = Yétɛ̄ná o sí ɓɛ̂n pɛ́ myembá má ɓwambo má jombwa ɓwǎm̀ɓwam, o ená ó óŋgwánɛ́ bisɔ́ ó kɔtɛlɛ myembá má ɓwambo mípɛ́pɛ̄.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ombwá ɓwǎm̀ɓwam <icon></icon> ná mwembá mwá ɓwambo mú tɛ̂m kapóndá ɓwambo.
sc-review-rules-title = Mwembá mwá ɓwambo mú tɛ̂m kapóndá njé é ɓáísáɓɛ́?
sc-review-empty-state = Ó nîn póndá tatân mwembá mwá ɓwambo tɔ mɔɔ́ mú tití pɛ́ ó jombwa ɓwǎm̀ɓwam ó ɓôn ɓwamb.,
report-sc-different-language = Ɓwambo ɓópɛ́pɛ̄
report-sc-different-language-detail = Mwembá mwá ɓwambo mú tiláɓɛ ndé ó ɓwambo ɓópɛ́pɛ̄ ɓó e diweŋgísán na ɓô ná enɔ́ pɛ́tɛ́ láŋga.
sentences-fetch-error = Diwusɛ́ diwɔ́ dí tómbi ó póndá  nɔŋgɔ lá myembá má ɓwambo
review-error = Diwusɛ́ diwɔ́ dí tómbi ó póndá jombwa lá mûn mwembá mwá ɓwambo
review-error-rate-limit-exceeded = O mawâmsɛ ɓwambí. Nɔŋgɔ́ son a póndá ó ɓáta láŋga mwembá mwá ɓwambo ó ɓɛ́ mbáki ná mú tɛ̂m.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Di e ó túkwa mambo jǐta
sc-redirect-page-subtitle-1 = Elóŋgísán á kɔtɛlɛ myembá má ɓwambo é katí lá m̀ɓóko mwá Common Voice. Ɓotea na tatánu <writeURL>tilá</writeURL> mwembá mwá ɓwambo mɔɔ́ tɔ <reviewURL> ombwá ɓwǎmɓwam</reviewURL> myembá má ɓwambo ó  Common Voice.
sc-redirect-page-subtitle-2 = Ɓáísɛ́ bisɔ́ myúédí mɔ́ŋgɔ̄ ó <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ou <emailLink>toŋgwea na mukóɓá mwá malétá mwá mulato</emailLink>.
