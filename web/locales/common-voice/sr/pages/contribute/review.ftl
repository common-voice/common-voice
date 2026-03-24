## REVIEW

sc-review-lang-not-selected = Нисте изабрали ниједан језик. Идите на свој <profileLink>профил</profileLink> да бисте изабрали језике.
sc-review-title = Прегледај реченице
sc-review-loading = Учитавање реченица…
sc-review-select-language = Изаберите језик да прегледате реченице.
sc-review-no-sentences = Нема реченица за преглед. <addLink>Додајте нове предлоге!</addLink>
sc-review-form-prompt =
    .message = Прегледане реченице нису послане, јесте ли сигурни?
sc-review-form-usage = Превуците удесно да одобрите, налево да одбаците, а нагоре да прескочите реченицу. <strong>Не заборавите да пошаљете ваш преглед!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Извор: { $sentenceSource }
sc-review-form-button-reject = Одбиј
sc-review-form-button-skip = Прескочи
sc-review-form-button-approve = Одобри
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Д
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = Н
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = П
sc-review-form-keyboard-usage-custom = Можете да користите пречице на тастатури: { sc-review-form-button-approve-shortcut } да одобрите, { sc-review-form-button-reject-shortcut } да одбијете, { sc-review-form-button-skip-shortcut } да прескочите
sc-review-form-button-submit =
    .submitText = Доврши преглед
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Нема прегледаних реченица.
        [one] 1 прегледана реченица. Хвала вам!
        [few] { $sentences } прегледане реченице. Хвала вам!
       *[other] { $sentences } прегледаних реченица. Хвала вам!
    }
sc-review-form-review-failure = Није могуће сачувати преглед. Покушајте поново касније.
sc-review-link = Прегледај

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Критеријуми за преглед
sc-criteria-title = Критеријуми за преглед
sc-criteria-make-sure = Уверите се да реченица испуњава следеће критеријуме:
sc-criteria-item-1 = Реченица мора бити правилно написана.
sc-criteria-item-2 = Реченица мора бити граматички исправна.
sc-criteria-item-3 = Реченица мора бити лака за изговор.
sc-criteria-item-4 = Ако реченица испуњава критеријуме, кликните на дугме „Одобри” на десној страни.
sc-criteria-item-5-2 = Ако реченица не испуњава горенаведене критеријуме, кликните на дугме „Одбаци” на левој страни. Ако нисте сигурни у вези са реченицом, можете је прескочити и прећи на следећу.
sc-criteria-item-6 = Ако понестане реченица за преглед, помозите нам да прикупимо још реченица!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Проверите <icon></icon> да ли је ово лингвистички исправна реченица?
sc-review-rules-title = Да ли реченица испуњава смернице?
sc-review-empty-state = Тренутно нема реченица за преглед на овом језику.
report-sc-different-language = Другачији језик
report-sc-different-language-detail = Написана је на језику који је другачији од оног који прегледам.
sentences-fetch-error = Дошло је до грешке при преузимању реченица
review-error = Дошло је до грешке при прегледу ове реченице
review-error-rate-limit-exceeded = Идете пребрзо. Одвојите тренутак да прегледате реченицу како бисте били сигурни да је исправна.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Уводимо неке велике промене
sc-redirect-page-subtitle-1 = Сакупљач реченица се сели на главну Common Voice платформу. Сада можете <writeURL>писати</writeURL> реченице или <reviewURL>прегледати</reviewURL> појединачне доставе реченица на Common Voice-у.
sc-redirect-page-subtitle-2 = Постављајте нам питања на <matrixLink>Matrix-у</matrixLink>, <discourseLink>Discourse-у</discourseLink> или путем <emailLink>е-поште</emailLink>.
# menu item
review-sentences = Прегледај реченице
