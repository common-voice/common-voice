## REVIEW

sc-review-lang-not-selected = Ɓya a syɛɛ lüii. Nikáná ɓɛ̌ <poofil link> ɗi poto yēn ê<profileLink> tí ɛsu lɛ ɛsaŋ ilüii
sc-review-title = ɛfyal mímbɔŋ mi mɛ̄kɛl
sc-review-loading = Ɛlwondɛl mímbɔŋ mí mɛ̄kɛl
sc-review-select-language = syɛɛka lüii tí ɛsu lɛ ɛtwoŋgɛl mímbɔŋ mí mɛ̄kɛl
sc-review-no-sentences = Ya a ɓɛ nɛ mbɔŋ mɛ̄kɛl tí ɛsu lɛ ɛjüak ivus. Ɓi nɛ khul<addLink> ɛ ɓaka kɛl mil mímbɔŋ mímɛ̄kɛl<addLink>
sc-review-form-prompt =
    .message = Mimbɔŋ mí mɛ̄kɛl ɓɛ kwomnɛl mîk ɛ, ɓaa kɛnd myɛ, ɓi tí ɛkpɛl ɛtɔ ɓɛ sɔk ɛ?
sc-review-form-usage = Puská yɛ ɓɛ̌ ɛdom tí ɛkam mbɔŋ mɛ̄kɛl. Puská ɓɛ ɛmyɛl tí ɛsu lɛ ɛɓyen. Puská ɓɛ̌ ɛkō tí ɛsu lɛ ɛɗim <strong> Ɓya a jesa ɛkend yil yɛ̂ɛs ɓi kwombɛm !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ɛtin: { $sentenceSource }
sc-review-form-button-reject = ɛɓyen
sc-review-form-button-skip = ɛkpɛnjɛl
sc-review-form-button-approve = ɛkam
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Ɛ
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = Y
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = Ɛ
sc-review-form-keyboard-usage-custom = Ɓí nɛ khul ɛɓɛla nɛ izizye i teble ɓɛ til nɛ yɛ: { sc-review-form-button-approve-shortcut }, tí ɛsu lɛ ɛkam,  { sc-review-form-button-reject-shortcut } ɛɓyen,  { sc-review-form-button-skip-shortcut } gu thɔk tí ɛsu lɛ ɛkpɛnjɛl
sc-review-form-button-submit =
    .submitText = ɛsil ɛjüak gu í í thaŋ ɛnwɔɔnwɔŋ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Yaa ɓɛ nɛ mbɔŋ mɛ̄kɛl ɗi kwombɛla ê.
        [one] 1 I nɛ mbɔŋ mɛ̄kɛl ŋgwát ɗí kwombla ê. Mimyaŋla !
       *[other] { $sentences } Mimbɔŋ mi mɛ̄kɛl ɗi kwombla ê. Mimyaŋla !
    }
sc-review-form-review-failure = Ɓa a nɛnjl yil ɓɛ kwombɛl ê. Ɓaka jwoklaka
sc-review-link = ɛɓaka sá

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Mɛzye mɛ ɛthaŋ tí ɛɓak sá
sc-criteria-title = Mɛzyze mɛ ɛthaŋ tí ɛɓaka sá
sc-criteria-make-sure = Gu jüakká náǎ, mbɔŋ mɛ̄kɛl u tí ɛdala nɛ mɛzye mâk :
sc-criteria-item-1 = Mbɔŋ mɛ̄kɛl u dala nɛ ɛɓɛ tila ɛnwɔɔnwɔŋ.
sc-criteria-item-2 = Mbɔŋ mɛ̄kɛl u dala nɛ ɛɓɛ syesa
sc-criteria-item-3 = Mbɔŋ mɛ̄kɛl ú dala ɓɛ nɛ khul ɛlaŋaa ɛnwɔɔnwɔŋ.
sc-criteria-item-4 = I ɓɛ náǎ mbɔŋ mɛ̄kɛl i tila ɗakɛ í dala ekɛ́ nak, namká tí ɓutɔŋ «ɛkam» ɓɛ ɛdom
sc-criteria-item-5-2 = I ɓɛ náǎ mbɔŋ mɛ̄kɛl waa dala nɛ isá ɓɛ lɛɛ náǎ ɓi ɓɛ ka ɓɛ ɛko ɓîk, namká tí ɓutɔŋ «ɛɓyen» ɗi ɓɛ ɛmyɛl ê. I ɓɛ náǎ, ɓi tí ɛwenɛl nak ɓi nɛ khul ɛcel, ɓi thaŋ ɓɛ wul
sc-criteria-item-6 = I ɓɛ náǎ, ɓyaaká ɓɛ nɛ mbɔŋ mɛ̄kɛl tí ɛsu lɛ ɛɓaka jüak nak, kɛmká ɓes tí ɛɓaka twɔkla míl mimbɔŋ mi mɛ̄kɛl !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Jüaká <icon></icon>gu mbɔŋ mɛ̄kɛl ú tilá ɛnwɔɔnwɔŋ
sc-review-rules-title = Jüaká gu mbɔŋ mɛ̄kɛl ú tíla ɗakɛ ɓɛ lɛɛ ê.
sc-review-empty-state = yaa ɓalǐ ɓɛ nɛ mbɔŋ mɛ̄kɛl tí ɛsu lɛ ɛtwoŋgɛl tí lüii enɛŋ
report-sc-different-language = Yíl lüii
report-sc-different-language-detail = Mbɔŋ mɛ̄kɛl ú tilá ti yíl lüii ta ɓɛ yil mí ɗi tí ɛɓaka láŋ tek ê
sentences-fetch-error = Jüas ǐ kul tɛ́m ɓɛ wa ɓaka nwɔŋ mímbɔŋ mi mɛ̄kɛl ê
review-error = Jüas ǐ ɓaka kul tɛ́m ɓɛ ɓɛ́ tí ɛjüak mbɔŋ mɛ̄kɛl têk ê
review-error-rate-limit-exceeded = Ɓi tɔ lamb nɛ kamb. Nwɔŋká títɛ̌m tí ɛɓaka laŋ gu i tila ɛdala
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Zí í  cenj thund isínɔŋ ɓɛ náǎ, i cenjaa ke
sc-redirect-page-subtitle-1 = Mot sɔnj mimbɔŋ mi mɛ̄kɛl ɔkɛ́, ɛ́ ɛ́ tɔ ɓɛ pyat mílɔŋ Jwónd gwát. Ɓi nɛ khul ɛka<writeURL>til</writeURL> mbɔŋ mɛ̄kɛl<writeURL>Ɛguujüak</writeURL> mimbɔŋ mɛ̄kɛl  gu mimbɔŋ mímɛ̄kɛl tí pyat Jwónd gwát.
sc-redirect-page-subtitle-2 = Jiká ɓes mimiá myēn tí <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> gu <emailLink>tí pyat milɔŋ</emailLink>.
# menu item
review-sentences = Ɛjüak mímbɔŋ mí mɛ̄kɛl ɛnwɔɔnwɔŋ
