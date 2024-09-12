## REVIEW

sc-review-lang-not-selected = kaa nɨ̀ bùrə tɨ̀ mɨghàà mî tsu yarə̀. Tsà'à, tsà'à ghɛ̀ɛ̀ a nɨ̀ nuu <profileLink>Profile<profileLink>a
sc-review-title = bǔ nyàrə̀ ɨnnù
sc-review-loading = lwensə ɨnnù
sc-review-select-language = tsà'à tsà yàrə̀ nɨghàà a mbǔ nlèntə̂ ɨ̀nnù
sc-review-no-sentences = kaa ɨ̀nnù a mbǔ kù'ùsə ɨnnù ̂<addLink>jî mɔ'ɔ̀ nlèntə tsɨ̀tsɔ̀ŋ sɨ̀ bə</addLink>
sc-review-form-prompt =
    .message = mə̀ kɨ̀ lèntə̂ ɨ̀nnù jìi mə kaa bɨ kɨ̀ wa'a tsyàsə̀ mə ɨ ku'unə lɛ?
sc-review-form-usage = tintə nghɛ̀nsə̀ a abô mà'àba mbiintə̂ ɨ̀nnù jyâ tintə ŋghɛ̀nsə̀ abô ŋkàbə̀ a ntuù tintə ŋkɔ'ɔsə a nlɨ <strong>mə̀ kɨ̀ lèntə̂ ɨ̀nnù jìi mə kaa bɨ kɨ̀ wa'a tsyàsə̀ </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = àdɨ̀gə̀ yìi o lɔ̀gə ɨnnù ggu: { $sentenceSource }
sc-review-form-button-reject = tuû
sc-review-form-button-skip = lɨsƏ̂
sc-review-form-button-approve = biintə̂
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = m̀bə ò tsi fà'à nɨ m̀ba'à màaîn bɨ̀mânjì bî ghù'ùtə̀{ sc-review-form-button-approve-shortcut }  bî   { sc-review-form-button-reject-shortcut }  biibtə̂    { sc-review-form-button-skip-shortcut }  biibtə̂
sc-review-form-button-submit =
    .submitText = màŋsə a mbǔ nlèntə̂
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ɨ̀nnù jìi mə kaa bɨ bùrə tɨ̀ lèntə̀ annù yî fùùrə̀ mə bɨ kèntə̀ mə̂*
        [one] { "" }
       *[other] { $sentences } ɨ̀nnù jî mɔ'ɔ mə bɨ lèntə̀ mə̂. Mɨyà ghò!
    }
sc-review-form-review-failure = jaa bɨ kɨ̀ wa'a a mbǔ nlèntə ya lə̀ə̀ tsà'a tsà'à, bǔ nywe'etə fu a njɨ̌m mûbàŋtə̀
sc-review-link = ǹlèŋtə fu

## REVIEW CRITERIA

sc-criteria-modal = ⓘ bu lèntə bɨ́ mânjì byâ
sc-criteria-title = bu lèntə bɨ́ mânjì byâ
sc-criteria-make-sure = Tò' ɨvɨ na awo teyna na ghɨ teyn;
sc-criteria-item-1 = naŋsənyəmə ŋkàŋ annuwa ɨ́ ghɛɛ ǹtiŋər.
sc-criteria-item-2 = bɨ tswe nɨ̀ ŋwà'ànə ànnù ya sɨ̀gɨ̀nə..
sc-criteria-item-3 = ǹaŋsə yə mə ò ŋwà'ànə annù yaa kù'unə̀.
sc-criteria-item-4 = mbə mɨ̀kàŋ mɨ̀ ɨ̀nnu mya yoŋ bɨ nɔ̀ŋsə̀ mɔ̀ɔ̀tə mbà'à abo nɨ̀ jɨ̀ yâ. /tuù/m̀bà'à abo nɨ̀jɨ̀ &quot;. &quot Biintə̂.o lɔ̀ɔ̀ ǹtsɨgɨ́tə annù yìi ò kò mə̀ aa
sc-criteria-item-5-2 = mbəba bə mə ò khə ntsyà mɨkaŋ mə ɨnnù mya bə mə ò lèŋtə̂, tsà, mɨ̀kàn mɨ̀ ɨnnù mya mì mɔ'ɔ̀  .&quot; Tuynsɨ &quot à taa'a yo kwɛtə yì'iǹkwrəkə
sc-criteria-item-6 = mbə a bə mə kàa mɨ̀kaŋ̀ mə ɨ̀nnù mya sɨ bɨ́ mâŋjì bya yi'i bɛɛ̀/tuù/ mbà'à ya a bo kwàbə̀. M̀bə a bə mə bə ò lɨ̂ ŋ̀ghɛɛ nɨ́ yí mɔ'ɔ!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = miyà mə ò ko aà <icon></icon>  tsɨ́tsɔŋ bu lèntə̂ ntsyàsə ɨmbɛɛjo a mfə̀ŋ?
sc-review-rules-title = ànnù ya a ku'unə a nɨ bɨ̀nɔŋsə̀ bya??
sc-review-empty-state = kaa ɨ̀nnù a mbǔ nlèntə tsɨ̀tsɔŋ fàa mum nɨ̀ghàà aɨ̀ bû m̀bə
report-sc-different-language = nɨ̀ghàà ni dàŋə̀
report-sc-different-language-detail = bɨ ŋwa'anə aa a nɨ nɨghàà ni daŋ kaa a wa'a annù ya mə mə bù ǹlentə aa bə̂
sentences-fetch-error = àfànsənnù kɨ̀ fɛ̀'ɛ a noò ǹlɔ̀ɔ̂ ɨnnù
review-error = àfǎnsənnù a kɨ̀ fɛ̀ɛ a noò yìi mə bɨ kɨ̀ aɨ lèntə̀ yuà ànnù 
review-error-rate-limit-exceeded = o qàŋsə̀ ŋghɛɛ si'i tsàà tsà'à, bɔɔ nyɨ'ɨnə a mbǔ nlèntə̂ ɨ̀nnù jyâ a nyə mə ɨ ku'unə̂
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = bì'i ggɨ̀rə̀ bɨ̂kwensə bî wè bî mɔ'ɔ̀
sc-redirect-page-subtitle-1 = ŋù ŋkwɛrəkə̂ ɨ̀nnù a karə ŋghɛɛ a nɨ̂ àdɨ̂gə njì jì bòòntə. Tsɨ̂tsɔ̀ŋ m̀bə ò<writeURL>ŋ̀tayàsə̀   <writeURL>   annù kə̀ m̀bǔ nlèntə̂ <reviewURL>  <reviewURL>   yì fùùrə̀ ǹtsyàaə̂ ɨ̀nnù a nɨ̂ njì jî bòòntə̀ Common Voice.
sc-redirect-page-subtitle-2 = betə yi'i nɨ̂ ɨ̀betə̀ a nɨ<matrixLink>Matrix</matrixLink>,<discourseLink> bùlatì</discourseLink>  kə < emailLink>  ndə̀ŋ ǹlèntə̂ ɨ̀nnù </emailLink>
