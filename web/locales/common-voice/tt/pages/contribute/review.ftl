## REVIEW

sc-review-lang-not-selected = Сез бернинди тел дә сайламадыгыз. Аларны сайлау өчен <profileLink>Профилегезгә</profileLink> күчегез.
sc-review-title = Җөмләләрне тикшерү
sc-review-loading = Җөмләләрне йөкләү…
sc-review-select-language = Зинһар, җөмләләрне тикшерү өчен телне сайлагыз.
sc-review-no-sentences = Тикшерү өчен җөмләләр юк. <addLink>Хәзер күбрәк җөмлә өстәгез!</addLink>
sc-review-form-prompt =
    .message = Тикшерелгән җөмләләр җибәрелмичә калган. Дәвам итәргәме?
sc-review-form-usage = Җөмләне кабул итү өчен уңга тартыгыз. Кире кагу өчен сулга тартыгыз. Калдырып тору өчен өскә тартыгыз. <strong>Бәяләмәгезне расларга онытмагыз!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Чыганак: { $sentenceSource }
sc-review-form-button-reject = Кире кагу
sc-review-form-button-skip = Калдырып тору
sc-review-form-button-approve = Раслау
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Сез шулай ук тизтөймәләр дә куллана аласыз: { sc-review-form-button-approve-shortcut } — Раслау өчен, { sc-review-form-button-reject-shortcut } — Кире кагу өчен, { sc-review-form-button-skip-shortcut } — Калдырып тору өчен.
sc-review-form-button-submit =
    .submitText = Тикшерүне тәмамлау
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Җөмләләр тикшерелмәде.
        [one] 1 җөмлә тикшерелде. Рәхмәт!
       *[other] { $sentences } җөмлә тикшерелде. Рәхмәт!
    }
sc-review-form-review-failure = Тикшерүне саклап булмады. Зинһар соңрак янә тырышып карагыз.
sc-review-link = Тикшерү

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Тикшерү критерийлары
sc-criteria-title = Тикшерү критерийлары
sc-criteria-make-sure = Җөмләнең түбәндәге критерийларга туры килүен тикшерегез:
sc-criteria-item-1 = Җөмләдә орфографик хаталар булмаска тиеш.
sc-criteria-item-2 = Җөмлә грамматик кагыйдәләр нигезендә язылырга тиеш.
sc-criteria-item-3 = Җөмлә әйтемле булырга тиеш.
sc-criteria-item-4 = Әгәр җөмлә критерийларга туры килсә, уңдагы &quot;Кабул итү&quot; төймәсенә басыгыз.
sc-criteria-item-5-2 = Җөмлә югарыдагы критерийларга туры килмәсә, сул яктагы &quot;Кире кагу&quot; дигәненә басыгыз. Шикләнсәгез, &quot;Калдырып тору&quot; дигәненә басыгыз һәм киләсе җөмләгә күчегез.
sc-criteria-item-6 = Тикшерү өчен җөмләләр беткән булса, безгә күбрәк җөмләләр тупларга ярдәм итегезче!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = <icon></icon> — бу җөмлә лингвистик яктан дөрес төзелгәнме?
sc-review-rules-title = Җөмлә кулланмадагы принципларга туры киләме?
sc-review-empty-state = Әлеге бу телдә тикшерү өчен сөйләмнәр юк.
report-sc-different-language = Башка тел
report-sc-different-language-detail = Бу җөмлә мин тикшергән телдә түгел.
sentences-fetch-error = Җөмләләр алганда хата килеп чыкты
review-error = Бу җөмләне тикшерүдә хата килеп чыкты
review-error-rate-limit-exceeded = Сез нык ашыгасыз. Җөмләнең дөреслеген тикшерү өчен игътибарлырак карагыз.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Без мөһим үзгәрешләр ясыйбыз
sc-redirect-page-subtitle-1 = Җөмләләрне җыючы төп Common Voice платформасына күчә. Хәзер сез җөмләне <writeURL>яза</writeURL> аласыз яки бер җөмләне Common Voice платформасында <reviewURL>тикшерә</reviewURL> аласыз.
sc-redirect-page-subtitle-2 = Сез безгә <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> яки <emailLink>электрон почта</emailLink> аша сораулар бирә аласыз.
# menu item
review-sentences = Җөмләләрне тикшерү
