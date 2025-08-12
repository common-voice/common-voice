## REVIEW

sc-review-lang-not-selected = Tanno benn làkk. Baalnu nga dem ci sa sa <profileLink>Lëkkalekaayu</profileLink> ngir tànn saw làkk.
sc-review-title = Jàngat ay waat
sc-review-loading = Dafay yab ay waat...
sc-review-select-language = Tannal benn làkk ngir jàngat ay waat.
sc-review-no-sentences = Amul waat yuñu wara jàngat. <addLink>Yokk yeneen waat léegi!</addLink>
sc-review-form-prompt =
    .message = Baat yinga jàngat yonné woo ko, wóor na ?
sc-review-form-usage = Bu baat bi baaxé laalal sa ndeyjoor. Bu baaxul sa cammoy ngir bañ ko. Bësal ci kaw ngir jàll. <strong> Bul fàtte yonné sa saytu !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Cosaan : { $sentenceSource }
sc-review-form-button-reject = Dàqq
sc-review-form-button-skip = Tëb
sc-review-form-button-approve = Dëggal
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = W
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = D
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = Mën nga itam jëfandikoo gaawaayu àlluwa kër ngir :{ sc-review-form-button-approve-shortcut } Nangu, { sc-review-form-button-reject-shortcut } Bañ,{ sc-review-form-button-skip-shortcut } Jàll
sc-review-form-button-submit =
    .submitText = Jeexal jàngat bi
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Amul benn baat buñu jàngat.
       *[other] { $sentences } waat yunu jàngat.
    }
sc-review-form-review-failure = Mënul yab jàngat bi. Jéemaatal ci kanam.
sc-review-link = Jàngat

## REVIEW CRITERIA

sc-criteria-modal = Càkkutéefi saytu gi
sc-criteria-title = Càkkutéefi saytu gi
sc-criteria-make-sure = Fexeel ba baat bi méngoo ak càkkutéef yi :
sc-criteria-item-1 = Dañoo wara bind baat bi ci nimu warée.
sc-criteria-item-2 = Baat bi dafa wara sàmmote ay càkkutéefi nafar yi.
sc-criteria-item-3 = Baat bi dafa wara nekk lunu mëna wax.
sc-criteria-item-4 = Su baat bi sàmmote ak càkkutéef yi, bësal ci butoŋu &quot;Nangu&quot; bi ci sa ndeyjoor.
sc-criteria-item-5-2 = Sudee baat bi wuute na ak liñu bind ci kaw, bësal ci butoŋu &quot;Dàqq&quot; ci sa cammoy. Soo xamul baat bi, mën nga jàll dem ci baat bi ci topp.
sc-criteria-item-6 = Soo amatul waat yoo jàngat, mën ngañoo jàppale ñu dajale yeneen waat.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Jàngatal <icon></icon> ndax baat bi awna yoon ?
sc-review-rules-title = Ndax baat bi sàmmo na ak càkkutéef yi ?
sc-review-empty-state = Waat yiñ war a jàngat, jéex na ci làkk wii.
report-sc-different-language = Làkk wu wuute
report-sc-different-language-detail = Dañ ko bind ci làkk wu wuute ak làkk wii may jàngat.
sentences-fetch-error = Dafa am njuumte ci waat yi
review-error = Dafa am njuumte ci jàngatum baat bi
review-error-rate-limit-exceeded = Ningay deme gaaw na lool. Ñoo ngi lay ñaan nga jël ab diir ngir jàngat baat bi xam ndax jub na.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Ñoo ngi def ay coppite yu am solo
sc-redirect-page-subtitle-1 = Dajalekay waat yi mingi toxu ci xarala gii di Common Voice. Leegi mën nga <writeURL>bind</writeURL> ab baat wala <reviewURL>jàngat</reviewURL> benn baat bune ci Common Voice.
sc-redirect-page-subtitle-2 = Sàmp ap làaj ci <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> wala<emailLink>imeel</emailLink>.
# menu item
review-sentences = Jàngat ay waat
