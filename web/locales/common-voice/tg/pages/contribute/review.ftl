## REVIEW

sc-review-title = Баррасии ҷумлаҳо
sc-review-loading = Ҷумлаҳо бор шуда истодаанд…
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Манбаъ: { $sentenceSource }
sc-review-form-button-reject = Рад кардан
sc-review-form-button-skip = Нодида гузарондан
sc-review-form-button-approve = Тасдиқ кардан
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-button-submit =
    .submitText = Анҷом додани баррасӣ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ягон ҷумла баррасӣ нашуд.
        [one] 1 ҷумла баррасӣ шуд. Сипос!
       *[other] { $sentences } ҷумла баррасӣ шуд. Сипос!
    }
sc-review-link = Бознигарӣ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Меъёрҳои бознигарӣ
sc-criteria-title = Меъёрҳои бознигарӣ
sc-criteria-item-2 = Ҷумла бояд аз ҷиҳати грамматикӣ дуруст бошад.
report-sc-different-language = Забони дигар
sentences-fetch-error = Ҳангоми гирифтани ҷумлаҳо хато ба миён омад
review-error = Ҳангоми баррасии ин ҷумла хато ба миён омад
# menu item
review-sentences = Баррасии ҷумлаҳо
