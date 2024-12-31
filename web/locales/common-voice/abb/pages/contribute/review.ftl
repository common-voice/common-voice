## REVIEW

sc-review-lang-not-selected = Ɔ̀ tɔ pɔ᷇s mbɔs tɔ yǎ. Lem i <profileLink>sū wɔ̄ŋ</profileLink> i ipɔ̀sɔ̀k di mikòobyaà.
sc-review-title = Ɓaksɛ mìkòo mi byaà
sc-review-loading = Ìlemêk di mikòobyaà...
sc-review-select-language = Pɔ̌s mbɔ̄s yǎ i iɓāksɛ̀kɛ̀ di mikòobyaà.
sc-review-no-sentences = Ŋ̀kòobyaà tɔ̀mwǎ mu tɔ̄ŋ iɓaksɛ̀gɛ̀ mu ta. Ɔ̀ là <addLink>ɓat mikòonyaà mipɛ </addLink>.
sc-review-form-prompt =
    .message = Mìkòobyaà mìlà mi baksànà mi ta wōma, ɔ̌ kɛ̀ ibasû ?
sc-review-form-usage = Lòo i wāalōm i ikɛ̀msɛ̀gɛ̀ di nkòobyaà. Lòo i kimɔ̄ŋ i itɛ̀wɛ̀k. Lòo i lɔw i iɓààsàgà.<strong>Ɔ̀ to kɔ̀la là ɔ̀ yɛ᷇wlɛ iwɔmɔ̂k di mbagō ì ǹtìmbìs mɔŋ !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Ìbwɛ̀ŋɛ : { $sentenceSource }
sc-review-form-button-reject = Tɛ̌w
sc-review-form-button-skip = Pènek
sc-review-form-button-approve = Kɛ̀msɛ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Ɔ̀ là-sala kì patàpɛm ì kìɓambo ki sɔɔ : { sc-review-form-button-approve-shortcut } i ikɛ̀msɛ̀gɛ̀, { sc-review-form-button-reject-shortcut } i itɛ̀wɛ̀k, { sc-review-form-button-skip-shortcut } i ipènèk
sc-review-form-button-submit =
    .submitText = Màa nì ìɓaksɛ̀gɛ̀
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ŋ̀kòobyaà tɔ̀mwǎ mu ta ɓāksana.
        [one] Ŋ̀kòobyaà mwǎ mu ɓaksana. Mɛ̀ sɔm !
       *[other] { $sentences } ma mikòobyaà mi ɓaksana. Mɛ̀ sɔm !
    }
sc-review-form-review-failure = Ìɓaksɛ̀gɛ̀ di ta dīmi. Kèga ipɛ i mbūs-ponda.
sc-review-link = Ǹtìmbìs

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Màteeyàk ma ntìmbìs
sc-criteria-title = Màteeyàk ma ntìmbìs
sc-criteria-make-sure = Ɓaksɛ là ŋ̀kòobyaà mu nɔ̌ŋ àmà màteeyàk ma:
sc-criteria-item-1 = Ŋ̀kòobyaà mu kɔ̀la là mu cilā lam.
sc-criteria-item-2 = Ŋ̀kòobyaà mu kɔ̀la là mu bwɛɛ̄ kiteliyà-iyo kilām.
sc-criteria-item-3 = Ŋ̀kòobyaà mu kɔ̀la là mu ɓa nyaà ìlà wɛŋa.
sc-criteria-item-4 = Ɔ̂ ŋ̀kòobyaà mu nɔ̌ŋ mateeyàk i mbūs, kon i ntōŋga mu «Ìkɛ̀msɛ̀gɛ̀» i wāalōm.
sc-criteria-item-5-2 = Ɔ̂ ŋ̀kòobyaà mu ta nɔ̌ŋ mateeyàk imbūs, kon i ntōŋga mu «Ìtɛ̀wɛ̀k» i kimɔ̄ŋ. Ɔ̂ ɔ̀ tɔ yēge mbagì, ɔ̀ là fɛm ɔ̀ kɛ i ŋkòobyaà mupɛ.
sc-criteria-item-6 = Ɔ̂ ɔ̀ tɔ ngē bwě mìkòobyaà i iɓāksɛ̀gɛ̀, woŋwa běs i ikòsòk di mikòobyaà mipɛ.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ɓaksɛ <icon></icon> là ŋ̀kòobyaà mu yegi ndi iyo di teli
sc-review-rules-title = Ŋ̀kòobyaà mu nɔ̌ŋ matɛɛwɛ i mbūs i?
sc-review-empty-state = Ŋ̀kòobyaà tɔ̀ mwǎ mu tɔ̄ŋ iɓaksɛ̀gɛ̀ mu ta itē ìna mbɔ̄s.
report-sc-different-language = Mbɔs ìpɛ̀
report-sc-different-language-detail = Mu ŋ̀kòòbyaà mu cììla ndī nì mbɔs ìpɛ̀pɛ.
sentences-fetch-error = Ìfùsuk di nɛnɛ i pōnda ì ìbussàk di byaà.
review-error = Ìfùsuk di nɛnɛ i pōnda ì ìtalâk di byaà.
review-error-rate-limit-exceeded = Ɔ̌ kɛ̀ makɛɛ ŋga᷇n. Yɔ̌ŋ wɔ̌ŋ ndɔgɔ̀ i iwāŋgâk di mi mìkòobyaà nyǔm, ɔ̀ ɓaksɛ là mi teli.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Sa kà fèŋsà màm ma ŋgǎn.
sc-redirect-page-subtitle-1 = Ŋ̀kɔ̀ta mìkòobyaà à kɛ i jiā di Common Voice. Ìɓɔ̀tɔ̀k di latatàla ɔ̀ là <writeURL>ceē</writeURL> ŋkòobya to <reviewURL>ìɓaksɛ̀sɛ̀ di</reviewURL> mikòobyaà i Common Voice.
sc-redirect-page-subtitle-2 = Niisɛ ɓěs biniisɛ byɔŋ i <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> tɔ <emailLink>nì e-mail</emailLink>.
