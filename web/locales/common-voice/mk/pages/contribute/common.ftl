action-click = Клик
action-tap = Допир
contribute = Придонеси
review = Прегледај
skip = Прескокни
shortcuts = Кратенки
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Снимка
       *[other] <bold>{ $count }</bold> Снимки
    }
goal-help-recording = Вие помогнавте на Common Voice да достигне <goalPercentage></goalPententage> од нашата дневна цел { $goalValue } за снимки!
goal-help-validation = Вие помогнавте на Common Voice да достигне <goalPercentage></goalPententage> од нашата дневна цел { $goalValue } за валидација!
contribute-more =
    { $count ->
        [one] Подготвени сте за 1 повеќе?
       *[other] Подготвени сте направите уште { $count } ?
    }
speak-empty-state = Ни снемаа реченици за да снимаме на овој јазик ...
speak-empty-state-cta = Придонесувајте реченици
record-button-label = Снимете го вашиот глас
share-title-new = <bold>Помогни ни</bold> да најдеме повеќе гласови
keep-track-profile = Следете го вашиот напредок во создавањето на профил
login-to-get-started = Најавете се или регистрирајте се за да започнете
target-segment-first-card = Придонесувате кон нашиот прв целен сегмент
target-segment-generic-card = Придонесувате кон целен сегмент
target-segment-first-banner = Помогнете да се создаде првиот целен сегмент на Common Voice на { $locale }
target-segment-add-voice = Додајте го вашиот глас
target-segment-learn-more = Дознајте повеќе

## Contribution Nav Items

contribute-voice-collection-nav-header = Збирка на гласови
contribute-sentence-collection-nav-header = Збирка на реченици

## Reporting

report = Пријави
report-title = Поднеси пријава
report-ask = Со какви проблеми се среќавате во оваа реченица?
report-offensive-language = Навредлив јазик
report-offensive-language-detail = Реченицата има непочитувачки или навредлив јазик.
report-grammar-or-spelling = Граматичка / правописна грешка
report-grammar-or-spelling-detail = Реченицата има граматичка или правописна грешка.
report-different-language = Различен јазик
report-different-language-detail = Напишано е на јазик различен од оној што го зборувам.
report-difficult-pronounce = Тешко за изговорање
report-difficult-pronounce-detail = Содржи зборови или фрази што се тешки за читање или говор.
report-offensive-speech = Навредлив говор
report-offensive-speech-detail = Снимката содржи непочитувачки или навредлив јазик.
report-other-comment =
    .placeholder = Коментар
success = Успех
continue = Продолжи
report-success = Извештајот е успешно испратен

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = с

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = р
shortcut-record-toggle-label = Снимање/Стоп
shortcut-rerecord-toggle = [1–5]
shortcut-rerecord-toggle-label = Пресними клип
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Отфрли ја тековната снимка
shortcut-submit = Врати
shortcut-submit-label = Доставете клипови
request-language-text = Сѐ уште не го гледате вашиот јазик на Common Voice?
request-language-button = Побарајте јазик

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Пушти/Запри
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Критериум
contribution-criteria-link = Разберете ги критериумите за придонес
contribution-criteria-page-title = Критериуми за придонес
contribution-for-example = на пример
contribution-misreadings-title = Погрешно читање
contribution-misreadings-description = Кога слушате, проверете многу внимателно дали она што е снимено е токму она што е напишано; отфрлете ако има дури и мали грешки. <br /> Многу вообичаени грешки вклучуваат:
contribution-misreadings-description-extended-list-2 = Недостасува <strong>'s'</strong> на крајот од зборот.
contribution-misreadings-description-extended-list-4 = Недостасува крајот на последниот збор бидејки снимката е прекината порано.
contribution-misreadings-description-extended-list-5 = Потребни се повеќе обиди за да се прочита збор.
contribution-misreadings-example-1-title = Џиновските диносауруси на Тријас.
contribution-misreadings-example-2-title = Џиновскиот диносаурус на Тријас.
contribution-misreadings-example-2-explanation = [Треба да биде „диносауруси“]
contribution-misreadings-example-4-title = Џиновските диносауруси на Тријас. Да.
contribution-misreadings-example-4-explanation = [Снимено е повеќе од потребниот текст]
contribution-misreadings-example-7-explanation = [Нема ‘а’ во оригиналниот текст]
contribution-misreadings-example-8-explanation = [Содржината не се совпаѓа]
contribution-varying-pronunciations-title = Различни изговори
contribution-background-noise-title = Бучава во позадина
contribution-background-noise-example-2-fixed-title = Џиновскиот дино <strong>[к'хм]</strong> Тријас.
contribution-background-noise-example-2-explanation = [Дел од текстот не може се слушне]
contribution-background-voices-title = Гласови во позадина
contribution-background-voices-description-extended = Ако снимката се прекине или има крцкање, отфрлете ја, освен ако не може да се слушне целиот текст.
contribution-background-voices-example-1-explanation = Дали доаѓаш? <strong> [повикан од друг] </strong>
contribution-volume-title = Глас
contribution-reader-effects-title = Ефекти на читателот
contribution-just-unsure-title = Само несигурни?
contribution-just-unsure-description = Ако наидете на нешто што овие упатства не го опфаќаат, ве молиме гласајте според вашата најдобра проценка. Ако навистина не можете да одлучите, користете го копчето за прескокнување и продолжете со следната снимка.
see-more = <chevron> </chevron> Види повеќе
see-less = <chevron> </chevron> Види помалку
