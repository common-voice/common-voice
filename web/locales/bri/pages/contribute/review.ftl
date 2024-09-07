## REVIEW

sc-review-lang-not-selected = ò zrí βɔ́zrê mbɔ́zrí. Nò zrózrómélì ɛ̀ndo<profileLink>Profile</profileLink>lì βɔ̀zrê mbɔ́zrí
sc-review-title = ɔ́ŋgɔ́ mátìlà βɛ̂
sc-review-loading = íká mátìlà
sc-review-select-language = nò zrózrómélì βɔ̀zrɔ́ è mbɔ́zrí lɔ̌ŋgɔ̀ lítìlà
sc-review-no-sentences = ó zrèndʒé màtìlà lɔ̌ŋgɔ̀. <addLink>Íká máβɛ́βɛ́ màtìlà náŋgɛ̂</addLink>
sc-review-form-prompt =
    .message = mátìl̀ wá mɔ́ŋgɛ̌ í zrómáwí,ò lòkɛ́?
sc-review-form-usage = lɛ̀mbɛ́ éβàzrá lìjá lá mómɛ̀ lì βɔ̀zrɔ́ è sentence. Lɛ̀mbɛ́ ó lìjá lá límɔ̀zrɛ́ ò zrì méjá. Lɛ̀mbɛ́ ó ɱáɲú lì βándʒà. <strong>Ò zrí βóŋmgá lǒmà!<strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ékī júwɛ́lɛ́lɛ̂: { $sentenceSource }
sc-review-form-button-reject = βìmbâ
sc-review-form-button-skip = βándʒâ
sc-review-form-button-approve = βɔ̀zrɔ̂
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = n
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = s
sc-review-form-keyboard-usage-custom = ò tánó gbèjáná è βólò é tú: { sc-review-form-button-approve-shortcut } lì βɔ̀zrɔ́, { sc-review-form-button-reject-shortcut } lì βìmbá, { sc-review-form-button-skip-shortcut } lì βándʒà
sc-review-form-button-submit =
    .submitText = kúlɛ́ lɔ̌ŋgɔ̀
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] wázrɔ́ŋgɔ́ tɔ̀ lìtìlà
        [one] wá mɔ́ŋgɔ́ lìtìlà βɔ́kɔ́ Nà zrómì!
       *[other] wá mɔ́ŋgɔ́ lìtìlà βɔ́kɔ́ Nà zrómì
    }
sc-review-form-review-failure = Review could not be saved. Please try again later.
sc-review-link = ɔ́ŋgɔ́ βɛ̂

## REVIEW CRITERIA

sc-criteria-modal = wéjà wé lɔ̌ŋgɔ̀
sc-criteria-title = wéjà wé lɔ̌ŋgɔ̀
sc-criteria-make-sure = ɛ́nɛ́ émá  lítìlà lí βélì lì nánù
sc-criteria-item-1 = ɛ́nɛ́ émá lítìlà lí tíláwí gbǎmù
sc-criteria-item-2 = ɛ́nɛ́ émá  lítìlà lí βómɛ́nɛ́ lì βálà è mbɔ́zrí
sc-criteria-item-3 = ɛ́nɛ́ émá lítìlà lí βélì wé émá mòtà táná dʒówà
sc-criteria-item-4 = lítìlà lí βélì tɛ́ gbámù, lɛ̀mbɛ́ & quot; βɔ̀zrɔ́ & quot; button ó lìjá lá mómɛ̀.
sc-criteria-item-5-2 = lítìlà lí zrá βálì tɛ́ è mbéndá tɔ́rɔ́ &quot;ò zrì mánɛ́lɛ́ &quot; è βólò é βàzrá límɔ̀zrɛ̂.ò zrá wí téjà lì βómɛ̀nɛ̀ lítìlà, ò tánó βándʒà lɛ̀ndɛ́ èβɛ́βɛ̂
sc-criteria-item-6 = ò zrɛ́nì tɛ́ lìtìlà lɔ̌ŋgɔ̀, ó dʒǒŋgwáné làzrá máβɛ́βɛ́ màtìlà
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ɔ́ŋgɔ́ <icon></icon>línì lìtìlà lí βélì gbǎmú?
sc-review-rules-title = lítìlà lí βálí è mbèndà?
sc-review-empty-state = ó zrèndʒé màtìlà èné mbɔ́zrí émá mòtà táná ɔ́ŋgɔ̀
report-sc-different-language = èβɛ́βɛ́ mbɔ́zrí
report-sc-different-language-detail = é tíláwí éβɛ́βɛ́ mbɔ́zrí lǎkà è jɔ́ nɔ́ŋgɔ̌ɔ̀
sentences-fetch-error = ó βélì ɱá mbènàkò lì wówà línì lìtìlà
review-error = ó βélì ɱá mbènàkò lì βómɛ̀nɛ̀ línì lìtìlà
review-error-rate-limit-exceeded = ó βélì ɱá mbènàkò lì βómɛ̀nɛ̀ línì lìtìlà
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ì βélì dʒěŋgòwà wèjà dʒɔ̌
sc-redirect-page-subtitle-1 = è mòtà wó mátìlà à wélà ɛ̀ndɛ̀ ó Common Voice platform. Náŋgɛ́ ò tánɛ́ <writeURL>tìlá</writeURL> lítìlà tɔ̀ <reviewURL>ɔ̂ŋgɔ́</reviewURL>lìtìlà lɔ̀kɔ́ óōmèjá Common Voice
sc-redirect-page-subtitle-2 = ó dʒìdʒówé kpízrɔ̀nì lì βómɛ̀nɛ̀ <matrixLink>mɛ́zrɔ̀ŋgí</matrixLink>, <discourseLink>ówâ</discourseLink> tɔ̀ <emailLink>lítìlà lá kɔ̀mpjútà</emailLink>.
