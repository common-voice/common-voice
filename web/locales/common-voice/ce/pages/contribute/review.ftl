## REVIEW

sc-review-lang-not-selected = Цхьа а мотт ца хаьржина ахь. Дехар ду хьайн <profileLink>Профиль</profileLink> чу гӀо, меттанаш харжа.
sc-review-title = Аламашна таллам
sc-review-loading = Аламаш чубовлу...
sc-review-select-language = Дехар ду , Аламашка хьажа мотт харжар
sc-review-no-sentences = Таллам бан Аламаш бац <addLink>Амма Кхин  аламаш тӀетоха йиш ю!</addLink>
sc-review-form-prompt =
    .message = Таллам бина аламаш дӀа ца белла, тешна вуй хьо?
sc-review-form-usage = Алам къобалбархьамма аьтту агӀор хьакха. Аьрру агӀор хьакха, иза юхатоха. Хьала хьакха, иза дӀатоха. <strong>Диц ма де хьайн таллам чубала!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Хьост
sc-review-form-button-reject = юхатоха
sc-review-form-button-skip = ТIехдалийта
sc-review-form-button-approve = ТIеэца
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Иштта лело мегар ду цхьаьна тоьхна пиллигаш: { sc-review-form-button-approve-shortcut } ТӀеэца, { sc-review-form-button-reject-shortcut }Юхатоха,{ sc-review-form-button-skip-shortcut }ТӀехдалийта .
sc-review-form-button-submit =
    .submitText = Таллам чекхбаккха
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Цхьа а аламна таллам ца бина.
        [one] 1 аламна таллам бина. Баркалла!
       *[other] { $sentences } аламна таллам бина. Баркалла!
    }
sc-review-form-review-failure = Таллам ларбан аьтто ца баьлла. ТӀаьхьо юха хьажа.
sc-review-link = Таллам бе

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Талламан йусткиртиг
sc-criteria-title = Талламан йусткиртиг
sc-criteria-make-sure = Аламаш хӀокху йусткиртиган барамашца йогӀуш хиларх тешна хила:
sc-criteria-item-1 = Алам нийсайаздарц хила беза.
sc-criteria-item-2 = Алам граматикаца нийса хила беза.
sc-criteria-item-3 = Алам дIабийцалуш  хила беза .
sc-criteria-item-4 = Нагахь санна алам йусткиртиган барамца богӀуш белахь, &quot;ТӀеэца&quot; аьлла пиллиг тIетаIайе.
sc-criteria-item-5-2 = Нагахь санна алам лакхахь йийцинчу йусткиртиган барамашца богӀуш бацахь тӀетаӀйе , &quot;ДӀатоха&quot; аьлла пиллиг. Нагахь санна предложенех тешна вацахь, иза а дӀа а теттина, рогӀерчу предложене дӀакхача мегар ду.
sc-criteria-item-6 = Нагахь санна таллам бан аламаш чекхбевлехь, кхин а предложенеш гулйеш гӀо де тхуна!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Таллам бе <icon></icon> меттан нийса алам буй хӀара?
sc-review-rules-title = Алам низамца богӀуш буй?
sc-review-empty-state = карарчу ханна оцу  маттахь карлабаха аламаш бац.
report-sc-different-language = Кхин мотт
report-sc-different-language-detail = Ас таллам бечу маттахь а доцуш, кхечу маттахь яздина ду иза.
sentences-fetch-error = Аламаш схьаоьцуш гӀалат даьлла
review-error = ХӀокху аламна таллам беш гӀалат даьлла
review-error-rate-limit-exceeded = Хьо тӀех сихавелла. дикка тидам беш хьажа аламашка, иза нийса хиларх тешна хила.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Цхьа баккхий хийцамаш беш ду вай
sc-redirect-page-subtitle-1 = Аламаш гулбархой дӀабольху коьртачу Common Voice платформе. ХӀинца хьан йиш ю алам<writeURL>язбан</writeURL>  я <reviewURL>Талла</reviewURL>  цхьа алам Common Voice-сехь
sc-redirect-page-subtitle-2 = Хаттарш схьадахкийта <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> я <emailLink>email</emailLink>.
# menu item
review-sentences = Аламашна таллам
