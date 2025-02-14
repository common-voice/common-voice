## REVIEW

sc-review-lang-not-selected = Шумо ягон забонро интихоб накардаед. Лутфан, барои интихоби забонҳо ба <profileLink>Профил</profileLink> гузаред.
sc-review-title = Баррасии ҷумлаҳо
sc-review-loading = Ҷумлаҳо бор шуда истодаанд…
sc-review-select-language = Лутфан, барои баррасӣ кардани ҷумлаҳо забонеро интихоб намоед.
sc-review-no-sentences = Ягон ҷумлаи дигар барои баррасӣ нест. <addLink>Акнун ҷумлаҳои навро ҳар чи бештар илова кунед!</addLink>
sc-review-form-prompt =
    .message = Ҷумлаҳои баррасишуда пешниҳод карда нашудаанд, мутмаин ҳастед?
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
sc-review-form-keyboard-usage-custom = Шумо инчунин метавонед аз миёнабурҳои клавиатура истифода баред: { sc-review-form-button-approve-shortcut } барои «Тасдиқ кардан/Ҳа», { sc-review-form-button-reject-shortcut } барои «Рад кардан/Не», { sc-review-form-button-skip-shortcut } барои «Нодида гузарондан»
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
sc-review-form-review-failure = Баррасӣ нигоҳ дошта нашуд. Лутфан, баъдтар аз нав кӯшиш кунед.
sc-review-link = Бознигарӣ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Меъёрҳои бознигарӣ
sc-criteria-title = Меъёрҳои бознигарӣ
sc-criteria-make-sure = Боварӣ ҳосил кунед, ки ҷумла ба меъёрҳои зерин мувофиқат мекунад:
sc-criteria-item-1 = Ҷумла бояд дуруст навишта шавад.
sc-criteria-item-2 = Ҷумла бояд аз ҷиҳати грамматикӣ дуруст бошад.
sc-criteria-item-3 = Ҷумла бояд қобили талаффуз бошад.
sc-criteria-item-4 = Агар ҷумла ба меъёрҳо мувофиқ бошад, тугмаи &quot;Тасдиқ кардан&quot;-ро аз тарафи рост зер кунед.
sc-criteria-item-5-2 = Агар ҷумла ба меъёрҳои дар боло зикршуда мувофиқат накунад, тугмаи &quot;Рад кардан&quot;-ро дар тарафи чап пахш намоед. Агар шумо ба ҷумла боварӣ надошта бошед, шумо, инчунин, метавонед аз тугмаи &quot;Нодида гузарондан&quot; истифода намуда ба ҷумлаи дигар гузаред.
sc-criteria-item-6 = Агар шумо барои баррасӣ ҷумлаҳои дигар надошта бошед, лутфан, ба мо дар ҷамъоварии ҷумлаҳои ҳар чӣ бештар кумак кунед!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Тафтиш кунед <icon></icon>, ки оё ин ҷумла мувофиқи меъёрҳои забонӣ дуруст аст?
sc-review-rules-title = Оё ҷумла ба меъёрҳои дастур мувофиқат мекунад?
sc-review-empty-state = Айни ҳол дар ин забон ягон ҷумлаи дигар барои баррасӣ нест.
report-sc-different-language = Забони дигар
report-sc-different-language-detail = Он дар забоне навишта шудааст, ки аз забони баррасӣ кардаи ман фарқ мекунад.
sentences-fetch-error = Ҳангоми гирифтани ҷумлаҳо хато ба миён омад
review-error = Ҳангоми баррасии ин ҷумла хато ба миён омад
review-error-rate-limit-exceeded = Шумо хеле зуд ҳаракат мекунед. Лутфан, вақти худро барои баррасии бодиққати ҷумлаи нав ҷудо кунед ва боварӣ ҳосил намоед, ки он дуруст аст.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Мо баъзе дигаргуниҳои калонро омода карда истодаем
sc-redirect-page-subtitle-2 = Ба мо тавассути <matrixLink>«Matrix»</matrixLink>, <discourseLink>«Discourse»</discourseLink> ё <emailLink>почтаи электронӣ</emailLink> саволҳоро ирсол намоед.
# menu item
review-sentences = Баррасии ҷумлаҳо
