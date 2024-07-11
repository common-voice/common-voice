action-click = Щёлкнуть
action-tap = Нажмите
contribute = Принять участие
review = Проверить
skip = Пропустить
shortcuts = Сочетания клавиш
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> запись
        [few] <bold>{ $count }</bold> записи
       *[many] <bold>{ $count }</bold> записей
    }
goal-help-recording = Вы помогли Common Voice достичь <goalPercentage></goalPercentage> из нашей ежедневной цели по записи в { $goalValue }!
goal-help-validation = Вы помогли Common Voice достичь <goalPercentage></goalPercentage> из нашей ежедневной цели по проверке в { $goalValue }!
contribute-more =
    { $count ->
        [one] Готовы сделать ещё { $count }?
        [few] Готовы сделать ещё { $count }?
       *[other] Готовы сделать ещё { $count }?
    }
speak-empty-state = У нас закончились предложения для записи на этом языке...
no-sentences-for-variants = На вашем языковом варианте может не существовать предложений! Если вам удобно, вы можете изменить свои настройки, чтобы увидеть другие предложения на вашем языке.
speak-empty-state-cta = Предложить предложения
speak-loading-error =
    Мы не смогли подобрать ни одного предложения, чтобы вы могли его произнести.
    Пожалуйста, попробуйте еще раз позже.
record-button-label = Запишите свой голос
share-title-new = <bold>Помогите нам</bold> найти больше голосов
keep-track-profile = Отслеживайте свой прогресс с помощью профиля
login-to-get-started = Войдите или зарегистрируйтесь, чтобы начать
target-segment-first-card = Вы вносите свой вклад в наш первый целевой сегмент
target-segment-generic-card = Вы вносите свой вклад в целевой сегмент
target-segment-first-banner = Помогите создать первый целевой сегмент Common Voice на { $locale }
target-segment-add-voice = Добавить свой голос
target-segment-learn-more = Подробнее
change-preferences = Изменить настройки

## Contribution Nav Items

contribute-voice-collection-nav-header = Коллекция голосов
contribute-sentence-collection-nav-header = Коллекция фраз

## Reporting

report = Пожаловаться
report-title = Отправить жалобу
report-ask = Какие проблемы вы испытываете с этим предложением?
report-offensive-language = Оскорбительные выражения
report-offensive-language-detail = Предложение содержит дискриминационные или оскорбительные выражения.
report-grammar-or-spelling = Грамматическая / орфографическая ошибка
report-grammar-or-spelling-detail = Предложение содержит грамматическую или орфографическую ошибку.
report-different-language = Другой язык
report-different-language-detail = Написано на языке, отличном от того, на котором я говорю.
report-difficult-pronounce = Сложно произнести
report-difficult-pronounce-detail = Содержит слова или фразы, которые трудно прочитать или произнести.
report-offensive-speech = Оскорбительные выражения
report-offensive-speech-detail = Запись содержит дискриминационные или оскорбительные выражения.
report-other-comment =
    .placeholder = Комментарий
success = Готово
continue = Продолжить
report-success = Жалоба была успешно отправлена

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = с

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = и
shortcut-record-toggle-label = Записать/остановить
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Перезаписать клип
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Отменить текущую запись
shortcut-submit = Return
shortcut-submit-label = Отправить клипы
request-language-text = Пока не видите ваш язык в Common Voice?
request-language-button = Запросить язык

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = о
shortcut-play-toggle-label = Воспроизвести/остановить
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = а
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = е

## Validation criteria

contribution-criteria-nav = Критерии
contribution-criteria-link = Узнать правила
contribution-criteria-page-title = Критерии участия
contribution-criteria-page-description = Узнайте, на что обращать внимание при прослушивании записей, а также сделайте свои записи богаче!
contribution-for-example = например
contribution-misreadings-title = Неверное прочтение
contribution-misreadings-description = При прослушивании очень внимательно проверяйте, что записано в точности то, что написано; отклоняйте даже незначительные ошибки. <br /> Очень частые ошибки:
contribution-misreadings-description-extended-list-1 = Пропуск части слова в начале записи. Например, если произносится "ивет" вместо "привет".
contribution-misreadings-description-extended-list-2 = В конце слова отсутствует символ <strong>«s»</strong> (для английского языка).
contribution-misreadings-description-extended-list-3 = Произносится слово, похожее на написанное, но отличающееся от него. Например "вскрикнул" вместо "воскрикнул" или наоборот.
contribution-misreadings-description-extended-list-4 = Пропуск конца последнего слова из-за преждевременного прерывания записи.
contribution-misreadings-description-extended-list-5 = Несколько попыток прочесть слово.
contribution-misreadings-example-1-title = Гигантские динозавры триаса.
contribution-misreadings-example-2-title = Гигантский динозавр триасового периода.
contribution-misreadings-example-2-explanation = [Должно быть «динозавры»]
contribution-misreadings-example-3-title = Гигантские динозавры Триассо-.
contribution-misreadings-example-3-explanation = [Запись обрывается до конца последнего слова]
contribution-misreadings-example-4-title = Гигантские динозавры триаса. Да.
contribution-misreadings-example-4-explanation = [Записано больше, чем требуемый текст]
contribution-misreadings-example-5-title = Мы выходим за кофе.
contribution-misreadings-example-6-title = Мы идем за кофе.
contribution-misreadings-example-6-explanation = [Должно быть «Мы»]
contribution-misreadings-example-7-title = Мы выходим за кофе
contribution-misreadings-example-7-explanation = [Нет буквы "а" в исходном тексте]
contribution-misreadings-example-8-title = Мимо пронесся шмель.
contribution-misreadings-example-8-explanation = [Несоответствующий контент]
contribution-varying-pronunciations-title = Различное Произношение
contribution-varying-pronunciations-description = Будьте осторожны, прежде чем отклонять клип на том основании, что читатель неправильно произнес слово, поставил ударение не в том месте или, по-видимому, проигнорировал знак вопроса. Во всем мире используется большое разнообразие произношений, некоторые из которых вы, возможно, не слышали в своем местном сообществе. Пожалуйста, не отвергайте тех, кто может говорить иначе, чем вы.
contribution-varying-pronunciations-description-extended = С другой стороны, если вы считаете, что читатель, вероятно, никогда раньше не встречал это слово и просто делает неверное предположение о произношении, пожалуйста, отклоните его. Если вы не уверены, используйте кнопку пропуска.
contribution-varying-pronunciations-example-1-title = На голове у него был берет.
contribution-varying-pronunciations-example-1-explanation = [«Берет» допустимо как с ударением на первый слог (Великобритания), так и на второй слог (США)]
contribution-varying-pronunciations-example-2-title = Его рука была поднята.
contribution-varying-pronunciations-example-2-explanation = [‘Raised’ в английском языке всегда произносится как один слог, а не два]
contribution-background-noise-title = Фоновый шум
contribution-background-noise-description = Мы хотим, чтобы алгоритмы машинного обучения могли справляться с различными фоновыми шумами, и даже относительно громкие звуки могут быть приняты при условии, что они не мешают вам слышать весь текст. Тихая фоновая музыка допустима; музыка достаточно громкая, чтобы вы не могли расслышать каждое слово - недопустима.
contribution-background-noise-description-extended = Если запись обрывается или в ней появляются потрескивания, отклоните её, если не слышен весь текст.
contribution-background-noise-example-1-fixed-title = <strong>[Чихание]</strong> Гигантские динозавры <strong>[кашель]</strong> триаса.
contribution-background-noise-example-2-fixed-title = Гигантский динозавр <strong>[кашель]</strong> триасового периода.
contribution-background-noise-example-2-explanation = [Часть текста не слышно]
contribution-background-noise-example-3-fixed-title = <strong>[треск]</strong> гигантские динозавры из <strong>[треск]</strong>-риаса.
contribution-background-voices-title = Фоновые голоса
contribution-background-voices-description = Тихий и неразборчивый шум посторонних голосов вполне приемлем, однако если вы можете разобрать хоть одно слово, которого нет в тексте, запись следует отклонить, так как это может помешать машинному алгоритму в распознании слов. Обычно это случается, когда кто-то не выключает телевизор или если где-то поблизости идёт разговор.
contribution-background-voices-description-extended = Если запись обрывается или в ней появляются потрескивания, отклоните её, если не слышен весь текст.
contribution-background-voices-example-1-title = Гигантские динозавры триаса. <strong>[прочитано одним голосом]</strong>
contribution-background-voices-example-1-explanation = Ты идешь? <strong>[зовёт кто-то другой]</strong>
contribution-volume-title = Громкость
contribution-volume-description = Между записями вам будет встречаться вполне естественная разница в громкости, поэтому отклоняйте по этой причине только те из них, звук в которых настолько громок, что запись ломается или (что случается чаще) если звук настолько тихий, что вы не можете разобрать ни слова без обращения к тексту.
contribution-reader-effects-title = Эффекты чтения
contribution-reader-effects-description = Большинство записей - это люди, говорящие естественным голосом. Вы можете принимать иногда встречающиеся нестандартные записи, которые кричат, шепчут или явно произносят «драматическим» голосом. Пожалуйста, не принимайте песенные записи, и записи, в которых используется голос, синтезированный на компьютере.
contribution-just-unsure-title = Не уверены?
contribution-just-unsure-description = Если вы столкнетесь с чем-то, что не охвачено этими рекомендациями, проголосуйте, исходя из вашего здравого смысла. Если вы действительно не можете решить, используйте кнопку пропуска и переходите к следующей записи.
see-more = <chevron></chevron>Более подробно
see-less = <chevron></chevron>Менее подробно
