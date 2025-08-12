## REVIEW

sc-review-lang-not-selected = U kɨ ted nchɔʼ mɔʼ chu bə. Mbuʼmbo ghə ma <profileLink>Profile</profileLink> ma chɔʼ yu chu
sc-review-title = Kuʼ ŋkiti ŋkaŋ chukɛ
sc-review-loading = Ma bomti ŋkaŋ chukɛd ...
sc-review-select-language = Mbuʼmbo chɔʼ taʼ ma kuʼ ŋkiti ŋkaŋchuked
sc-review-no-sentences = Mɔʼ ŋkaŋchukɛd ma mbə ma kuʼŋkiti be. <addLink> Kuʼti bimɔʼ ŋkanchu ndindi</addLink>
sc-review-form-prompt =
    .message = U kɨ ted ncheʼni ŋkaŋchu u kitiked mɨ a bə, kɛ kə ɔ?
sc-review-form-usage = Pad mfa ni bo lum ma chɔʼ ŋkaŋ chu. pad mfa ni bo ŋkəb ma bed. Pad ŋkɔʼ ma tad.<strong> Ma ndaʼni ŋkaŋchu yi u kitikɛd mɨ a bə!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Lɨʼ a tum a { $sentenceSource }
sc-review-form-button-reject = Bed
sc-review-form-button-skip = Tad
sc-review-form-button-approve = Bim
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = n̂
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ŋ
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = U be ma faʼ ni chəlikɛd sɛ: { sc-review-form-button-approve-shortcut } ma bim, { sc-review-form-button-reject-shortcut } ma bed, { sc-review-form-button-skip-shortcut } ma tad.
sc-review-form-button-submit =
    .submitText = Meʼti ma kiti
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Bo ka ma ŋkuʼ ŋkiti bimɔʼ ŋkaŋchukɛd bə.
        [one] 1 ŋkaŋchu bo ka kuʼ kiti a. Njika!
       *[other] { $sentences } ŋkaŋchu bo ka kuʼ kiti a. Njika!
    }
sc-review-form-review-failure = Mbumbo waŋni mɔʼ ŋka
sc-review-link = Ma kuʼ ŋkiti

## REVIEW CRITERIA

sc-criteria-modal = Lɔʼ ndib ŋga ŋkaŋchu lɛ
sc-criteria-title = Lɔʼ ndib ŋga ŋkaŋchu lɛ
sc-criteria-make-sure = Kɨli tɨn ma yə ŋga ŋkaŋ chu bumti boa bɔ mad
sc-criteria-item-1 = Yɔ ŋkaŋ chu bə ma ŋwaʼni mbɔŋkɛd
sc-criteria-item-2 = Mad ma chu yɔ ŋkaŋchu bə ma bə nchinikɛd
sc-criteria-item-3 = ŋkaŋchu lin ma bə ni manji ma chu
sc-criteria-item-4 = Mbə ŋka yɔ ŋkaŋchu ni nɔʼɨ, fed &quotm-bi&quot; m mɨ ni bo lum
sc-criteria-item-5-2 = Mbə ŋka yɔ ŋkaŋchu kɨ bə ni nɔʼɨ bə, fed &quot; ŋgaŋ &quot; ni bo kəb. Mbə ŋga u pa pila ni yɔ ŋkaŋ chu,u tad ŋgə sɨsɨ
sc-criteria-item-6 = U bə ŋkam ŋkaŋchu ma kuʼ ŋkiti, mbuʼmbo u yemti yɨʼ ŋkə bimɔʼ ŋkaŋchu
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kiti <icon></icon> yɔ ŋkaŋ-chu lan ɛ?
sc-review-rules-title = A mɛ yɔ ŋkaŋchu chini ni manji a kuʼni a ɛ?
sc-review-empty-state = Yɔ chu ma mbə ni mɔʼ ŋkaŋchu ndindi ma kuʼ ŋkiti bə.
report-sc-different-language = Chu njɨʼ
report-sc-different-language-detail = Bo ŋwaʼni ni chu njɨ ni yi mɨ ni ŋkuʼ ŋkiti a
sentences-fetch-error = Fannu tum ni taʼ ŋkaŋchukɛd
review-error = Fannu tum ni ndib ma kuʼ ŋkiti yɔ ŋkaŋchu
review-error-rate-limit-exceeded = U ŋgə ni ndə. Mbuʼmbo lɔʼ;mo ndib ma kuʼ ŋkiti yɔ ŋkaŋ chu ma yə ŋga a ŋkuʼnikəd.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Bɨ ni yə bimɔʼ kɨbti ŋgɨŋgɨ
sc-redirect-page-subtitle-1 = ŋgaŋ kə ŋkaŋ-chu ni ntiʼ ncho maji Common Voice. Ndindi, u bə ma <writeURL>ŋwàʼni</writeURL>ŋkaŋ-chu kɛ <reviewURL>kuʼ nkiti</reviewURL> nu ma cheʼni taʼtaʼ ŋkaŋ-chu ni Common Voice
sc-redirect-page-subtitle-2 = Fa bətikɛd mbiʼ <matrixLink>Matrix</matrixLink>, <discourseLink>ŋgam</discourseLink> kɛ <emailLink>ŋkaŋ-ma-cho</emailLink>.
# menu item
review-sentences = Kuʼ ŋkiti ŋkaŋ chukɛd
