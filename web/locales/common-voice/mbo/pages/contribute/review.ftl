## REVIEW

sc-review-lang-not-selected = Ní tə́ə́tɛ́ ihwɔ́ kɛ́ pɔ́', Ní nyə̂ŋ á  ijaní <profileLink> ilʉ̂mpi yɛ̌n átə̂ <profileLink> ítə́ti ahwɔ́ bi ní də́ə́ŋī
sc-review-title = Ní céki ǹyampi ápə́
sc-review-loading = Ilə́ti ǹyampi
sc-review-select-language = Ní tə́lɛ ihwɔ́ bɔnkɛ́ ní céki ǹyampi
sc-review-no-sentences = Ǹyampi kɛ́ ŋ̀hɔ́' ń shyɛ̌ a céki, Ní pə́lɛ<addLink>a háti ǹyampi âpə́ </addLink>
sc-review-form-prompt =
    .message = Ú lɛ́ɛ́mɛ́ ǹyampi mí ú máání a céki, ni hɛɛ cə úshwə̄ ?
sc-review-form-usage = Ní wônɛ ikɛ́ɛ́ mbɛ́ɛ́ , bɔnkɛ́ ní kwenki ǹyampi, Ní wônɛ ikɛ́ɛ́ myɛ îpimpi mɔ́<strong>Ní bɔ́tɛ́kɛ gwɛ̌m ígi ní túúŋi a lɛ́m á ḿmaní ǹyə́ki tə̂ ! <strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Ábú di í bíyɛ { $sentenceSource }
sc-review-form-button-reject = a pim
sc-review-form-button-skip = a tɛ́m
sc-review-form-button-approve = a kwenki
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = n
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = s
sc-review-form-keyboard-usage-custom = Ní hɛnɛ ní boǹli isúŋ nzhə̌ ígi íjaní itɔnikɛ́ɛ́ :  { sc-review-form-button-approve-shortcut } îkwenki { sc-review-form-button-reject-shortcut } îpimpi { sc-review-form-button-skip-shortcut } ítɛ̂mpi
sc-review-form-button-submit =
    .submitText = A mali ǹcéki
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ǹyampi kɛ́ ŋ̀hɔ́' mi ú cékɛnɛ́
        [one] Ǹyampi ŋ̀hɔ́ mí ú cékínī ! Ǹyam̀mí
       *[other] Ǹyampi ŋ̀hɔ́' mí ú cékínī, Ǹyam̀mí
    }
sc-review-form-review-failure = Ú kɔŋkɛnɛ́ ǹcéki , Ní həəli ápə́ son póndə́,
sc-review-link = A yə́ki ápə̄

## REVIEW CRITERIA

sc-criteria-modal = Bɛ́ndə́ iyə́kî ápə́
sc-criteria-title = Bɛ́ndə́ iyə́kî ápə́
sc-criteria-make-sure = Ní céki bán Nyampi ń hilɛ bɛndə́ bínɛ́:
sc-criteria-item-1 = Ńyampi ń tí bwâm îtyɛnti tə̂
sc-criteria-item-2 = Ǹyampi ń tí bwâm íhwɔ́bɛndə́ tə̂
sc-criteria-item-3 = Ǹyampi ń tí bwâm ílaŋki tə̂
sc-criteria-item-4 = Nzɛ́ɛ́ ǹyampi ń hílɛ mbɛ́ndə́, ní tɔn ápeki ú tyɛ́ɛ́ní bán " a kwenki" íkɛ́ɛ́ mbɛ́ɛ́
sc-criteria-item-5-2 = Nzɛ́ɛ́ ǹyampi ḿ pə́ə́tɛ̄ bɛ́ndə̄ a híl mbí' , Ní tɔn á " A pim" íkɛ́ɛ́ mbɛ́ɛ́ , Nzɛ́ɛ́ ní tí á epandɛ́ tə̂ ní hɛnɛ gwɛ́ a nyə́ myēŋ , ní tɛ́mɛ ûshwə́
sc-criteria-item-6 = Nzɛ́ɛ́ ní ǹyampi a céki ápə́ , ní hə́pi sí îlati ǹyampi ápə́ ŋgʉ́mengêŋ
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ní céki<icon></icon>bán ihwɔ í tí bwâm îtyɛnti tə̂
sc-review-rules-title = Ǹyampi ń hílɛ bɛ́ndə̂ ?
sc-review-empty-state = ǹyampi kɛ́ ŋ̀hɔ́' ń shyɛ̌ a céki íhwɔ́ gínɛ́ tə̂
report-sc-different-language = Ihwɔ́ təkə
report-sc-different-language-detail = Ú tyɛ́ɛ́n ǹyampi íhwɔ́ tə̂ ígi í shyɛ̌ káni pɔ́ ni gwɛ̌m ígi ń láŋɛki
sentences-fetch-error = Epandɛ́ í tí îkwopi ǹyampi
review-error = Epandɛ́ í tí ícéki ǹyampi tə̂
review-error-rate-limit-exceeded = Ní láŋɛ wáwā, Ní tə́lɛ póndə́ ní láŋ ǹyampi ápə̄, Ní bon kə́ŋ í bɛ́ bwâm
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Sí tí mam a pɛnti tə̂
sc-redirect-page-subtitle-1 = Gwɛ̌m ígi í lalɛ ǹyampi í cə́ə́ a ihwɔ́ mɔ ǹhyə̂, Bɔɔnɛ́ nî hɛnɛ <writeURL> a tyɛn</writeURL>ǹyampi ŋ̀hɔ́' áŋgâ<reviewURL>,a céki</reviewURL>,ǹyampi á ihwɔ́ mɔ ǹshyə̂ tə̂
sc-redirect-page-subtitle-2 = Ní siǹli sí mam<matrixLink>Mátris</matrixLink>,<discourseLink> ŋ̀kâ<discourseLink>áŋgâ<emailLink>á mɛ̂l tə̂</emailLink>
