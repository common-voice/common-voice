## LOGIN


## PROFILE


## REVIEW CRITERIA


## REVIEW

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

