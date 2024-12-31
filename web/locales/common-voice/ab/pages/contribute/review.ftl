## REVIEW

sc-review-lang-not-selected = Уара бызшәак уҳәаӡом. Урҭ ралхразы, шәца <profileLink>Профиль</profileLink> ахь.
sc-review-title = Аҳәарақәа гәашәҭ
sc-review-loading = Аҳәарақәа рҭагалара...
sc-review-select-language = Игәашәҭо аҳәоуқәа рбызшәа алышәх.
sc-review-no-sentences = Уажәазы ​​игәаҭатәу ажәалагалақәа ыҟаӡам, аха <addLink>ҿыцқәак ацҵара ҟалоит!</addlink>
sc-review-form-prompt =
    .message = Аиҩызцәа рыла ахәаԥшра змоу ажәалагалақәа ҟаҵамызт, агәра ганы уҟоума?
sc-review-form-usage = Ажәалагала шәыдышәкыларц азы арӷьарахь шәнаскьа. Мап ацәкразы иаанхеит. Ахыԥара аҟынӡа. <strong>Ишәхашәмыршҭын шәреитинг ашьақәырӷәӷәара!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Ахыҵхырҭа: { $sentenceSource }
sc-review-form-button-reject = Мап ацәкра
sc-review-form-button-skip = Абжьажьра
sc-review-form-button-approve = Адкылара
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Уара иара убасгьы иухы иаурхәар улшоит ацаԥха: { sc-review-form-button-approve-shortcut } ақәшаҳаҭхаразы, { sc-review-form-button-reject-shortcut } мап ацәкразы, { sc-review-form-button-skip-shortcut } ахыԥара
sc-review-form-button-submit =
    .submitText = Агәаҭара анагӡара
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Макьана ажәалагалақәа гәаҭаӡам.
        [one] Уара игәоуҭеит { $sentences } аҳәоу. Иҭабуп!
        [few] Уара игәоуҭеит { $sentences } аҳәоуқәа. Иҭабуп!
       *[many] Уара игәоуҭеит { $sentences } аҳәоуқәа. Иҭабуп!
    }
sc-review-form-review-failure = Ахҳәаа аиқәырхара алымшеит. Ҳаҳәоит, нас даҽазнык шәҽазышәшәа.
sc-review-link = Агәаҭара

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Агәаҭаратә критериақәа
sc-criteria-title = Агәаҭаратә критериақәа
sc-criteria-make-sure = Апропозициақәа абарҭ аҭахрақәа ирықәшәоит ҳәа агәра ганы шәыҟаз:
sc-criteria-item-1 = Ажәаҳәа аҩышьа иашазароуп.
sc-criteria-item-2 = Ажәаҳәа грамматикала ииашазароуп.
sc-criteria-item-3 = Ажәаҳәа убас иҟазароуп, ажәала иуҳәартә еиԥш.
sc-criteria-item-4 = Ажәалагала акритериақәа ирықәшәозар, &quot;Ақәшаҳаҭхара&quot; ақәыӷәӷәара.
sc-criteria-item-5-2 =
    Аҳәара акритериақәа ирықәымшәозар, ақәыӷәӷәара
     &quot;Мап ацәкра&quot;. Агәра ганы шәыҟамзар, шәхы иашәырхәар шәылшоит аҟәардә &quot;Ахысра&quot;, убас ала анаҩстәи ажәаҳәарахь шәиасуеит.
sc-criteria-item-6 = Ахәаԥшразы алабжьарақәа нҵәазар, егьырҭ алабжьарақәа реизгараҿы ҳацхраа!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Игәашәҭ <icon></icon> ари ажәаҳәа лингвистикала ииашоу-ииашаму аилкааразы?
sc-review-rules-title = Апропозициа амҩақәҵагаҿы иаагоу апринципқәа ирықәшәома?
sc-review-empty-state = Уажәазы ​​ари абызшәала ахәшьаратә ҟаҵатәқәа ыҟаӡам.
report-sc-different-language = Даҽа бызшәак
report-sc-different-language-detail = Ари сара сзыхәаԥшуа абызшәа акәымкәа, даҽа бызшәак ала иҩуп.
sentences-fetch-error = Аҳәарақәа анҳауаз агха ҟалеит
review-error = Ари ажәалагала ахәшьара анаҭоз агха ҟалеит
review-error-rate-limit-exceeded = Уара мыцхәы уццакуеит. Ажәаҳәа ибзианы шәахәаԥш, ииашоу-ииашаму еилышәкаарц азы.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Аиҭакра дуқәа ҳамоуп
sc-redirect-page-subtitle-1 = Ауалҳәаҩы Common Voice аплатформа хада ахь диасуеит. Уажәшьҭа шәара ишәылшоит <writeURL>шәҩырц</writeURL> жәаҳәа мамзаргьы <reviewURL>ахәаԥш</reviewURL> жәаҳәарак Азеиԥш бжьы аҟны.
sc-redirect-page-subtitle-2 = Азҵаарақәа ҳаҭ <matrixLink>Матрица</matrixLink>, <discourseLink>Дискурс</discourseLink>мамзаргьы <emailLink>email</emailLink> ала.
