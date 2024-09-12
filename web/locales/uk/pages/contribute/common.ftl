action-click = Клацніть
action-tap = Торкнутися
contribute = Долучитися
review = Перевірити
skip = Пропустити
shortcuts = Швидкі клавіші
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> запис
        [few] <bold>{ $count }</bold> записи
       *[many] <bold>{ $count }</bold> записів
    }
goal-help-recording = Ви допомогли Common Voice досягти <goalPercentage></goalPercentage> нашої щоденної цілі запису { $goalValue }!
goal-help-validation = Ви допомогли Common Voice досягти <goalPercentage></goalPercentage> нашої щоденної цілі перевірки { $goalValue }!
contribute-more = Готові зробити ще { $count }?
speak-empty-state = У нас закінчилися речення для запису цією мовою ...
no-sentences-for-variants = Можливо, для вашого варіанту мови немає речень! Якщо вам зручно, можете змінити налаштування, щоб бачити інші речення вашою мовою.
speak-empty-state-cta = Запропонуйте свої речення
speak-loading-error =
    Нам не вдалося знайти жодних речень для вас.
    Будь ласка, спробуйте пізніше.
record-button-label = Запишіть свій голос
share-title-new = <bold>Допоможіть нам</bold> знайти більше голосів
keep-track-profile = Слідкуйте за своїм успіхом у профілі
login-to-get-started = Увійдіть або зареєструйтесь, щоб розпочати
target-segment-first-card = Ви допомагаєте досягнути нашої першочергової цілі
target-segment-generic-card = Ви робите внесок у цільовий сегмент
target-segment-first-banner = Допоможіть Common Voice досягнути першочергової цілі для { $locale }
target-segment-add-voice = Додайте ваш голос
target-segment-learn-more = Докладніше
change-preferences = Змінити налаштування

## Contribution Nav Items

contribute-voice-collection-nav-header = Збірка голосів
contribute-sentence-collection-nav-header = Збірка речень
login-signup = Увійти / Зареєструватися
vote-yes = Так
vote-no = Ні
datasets = Набори даних
languages = Мови
about = Про
partner = Партнер
submit-form-action = Надіслати

## Reporting

report = Звіт
report-title = Надіслати звіт
report-ask = Які проблеми у вас виникають із цим реченням?
report-offensive-language = Образливі вирази
report-offensive-language-detail = У реченні є неповажна або образлива мова.
report-grammar-or-spelling = Граматична / орфографічна помилка
report-grammar-or-spelling-detail = У реченні є граматична або орфографічна помилка.
report-different-language = Інша мова
report-different-language-detail = Написано мовою, відмінною від тої, якою я розмовляю.
report-difficult-pronounce = Складний для вимови
report-difficult-pronounce-detail = Містить слова чи фрази, які важко читати чи вимовляти.
report-offensive-speech = Образлива мова
report-offensive-speech-detail = Озвучення має нешанобливу або образливу лексику.
report-other-comment =
    .placeholder = Коментар
success = Успішно
continue = Продовжити
report-success = Звіт успішно надіслано!

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = п

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = з
shortcut-record-toggle-label = Записати/Зупинити
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Перезаписати
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Відхилити поточний запис
shortcut-submit = Return
shortcut-submit-label = Надіслати озвучення
request-language-text = Ваша мова відсутня в Common Voice?
request-language-button = Запит нової мови

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = в
shortcut-play-toggle-label = Відтворити/Зупинити
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = т
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = н

## Validation criteria

contribution-criteria-nav = Критерії
contribution-criteria-link = Пояснення критеріїв внеску
contribution-criteria-page-title = Критерії внеску
contribution-criteria-page-description = Дізнайтеся, на що слід звертати увагу під час прослуховування голосових записів, а також допоможіть зробити ваші голосові записи кориснішими!
contribution-for-example = наприклад
contribution-misreadings-title = Неправильне прочитання
contribution-misreadings-description = Під час прослуховування дуже уважно перевіряйте, чи записано саме те, що було написано; відхиляйте внесок, якщо є навіть незначні помилки. <br />До найпоширеніших помилок належать:
contribution-misreadings-description-extended-list-1 = На початку запису пропущено <strong>«A»</strong> або <strong>«The»</strong> (для англійської мови).
contribution-misreadings-description-extended-list-2 = У кінці слова відсутній символ <strong>«s»</strong> (для англійської мови).
contribution-misreadings-description-extended-list-3 = Читання скорочень, яких насправді не існує, таких як «Мо'» замість «Може», або навпаки.
contribution-misreadings-description-extended-list-4 = Пропуск закінчення останнього слова через занадто швидке обривання запису.
contribution-misreadings-description-extended-list-5 = Кілька спроб прочитати слово.
contribution-misreadings-example-1-title = Любові не буває забагато.
contribution-misreadings-example-2-title = Любови не буває забагато.
contribution-misreadings-example-2-explanation = [Повинно бути ‘любові’]
contribution-misreadings-example-3-title = Любові не буває забагат-.
contribution-misreadings-example-3-explanation = [Запис обривається на кінці останнього слова]
contribution-misreadings-example-4-title = Любові не буває забагато. Так.
contribution-misreadings-example-4-explanation = [Записано зайві слова]
contribution-misreadings-example-5-title = Може сходимо на каву?
contribution-misreadings-example-6-title = Мо' сходимо на каву?
contribution-misreadings-example-6-explanation = [Повинно бути «Може»]
contribution-misreadings-example-7-title = Може сходимо на цю каву?
contribution-misreadings-example-7-explanation = [В оригінальному тексті немає «цю»]
contribution-misreadings-example-8-title = Повз нас пролетів джміль.
contribution-misreadings-example-8-explanation = [Невідповідний вміст]
contribution-varying-pronunciations-title = Різна вимова
contribution-varying-pronunciations-description = Будьте уважні, перш ніж відхиляти озвучення через те, що читач неправильно вимовив слово, поставив наголос у неправильному місці або, можливо, проігнорував знак питання. У світі існує безліч різних вимов, які ви, ймовірно, не чули у своїй місцевості. Будь ласка, дозвольте свободу вимови тим, хто може розмовляти інакше.
contribution-varying-pronunciations-description-extended = З іншого боку, якщо ви думаєте, що читач, мабуть, ніколи раніше не стикався з цим словом і просто робить неправильну здогадку щодо вимови, відхиліть кліп. Якщо ви не впевнені, скористайтеся кнопкою пропуску.
contribution-varying-pronunciations-example-1-title = Завжди розмовляй українською мовою.
contribution-varying-pronunciations-example-1-explanation = [«Завжди» по-різному наголошують у різних місцевостях]
contribution-varying-pronunciations-example-2-title = Його рука підняла-ся.
contribution-varying-pronunciations-example-2-explanation = [«Піднялася» українською мовою завжди вимовляється одним словом, а не двома]
contribution-background-noise-title = Сторонні звуки
contribution-background-noise-description = Ми хочемо, щоб алгоритми машинного навчання могли справлятися з різними фоновими шумами, і навіть відносно гучні звуки можуть бути прийнятними за умови, що вони не заважають вам почути весь текст. Тиха фонова музика — це нормально; неприйнятною буде гучна музика, яка не дає змоги чітко почути кожне слово.
contribution-background-noise-description-extended = Якщо запис переривається або потріскує, відхиліть його, окрім випадку, що весь текст можна почути.
contribution-background-noise-example-1-fixed-title = <strong>[Чхання]</strong> Любові не буває <strong>[кашель]</strong> забагато.
contribution-background-noise-example-2-fixed-title = Любові не <strong>[кашель]</strong> забагато.
contribution-background-noise-example-2-explanation = [Частину тексту не чути]
contribution-background-noise-example-3-fixed-title = <strong>[Тріщання]</strong> не буває <strong>[тріщання]</strong> -агато.
contribution-background-voices-title = Сторонні голоси
contribution-background-voices-description = Тихий гомін на задньому плані – це нормально, але додаткові голоси, які можуть змусити машинний алгоритм визначити слова, яких немає в письмовому тексті, небажані. Якщо ви чуєте різні слова, яких немає в тексті речення, варто відхилити озвучення. Зазвичай це відбувається там, де увімкнено телевізор, або поруч хтось розмовляє.
contribution-background-voices-description-extended = Якщо запис переривається або потріскує, відхиліть його, окрім випадку, що весь текст можна почути.
contribution-background-voices-example-1-title = Любові не буває забагато. <strong>[прочитано одним голосом]</strong>
contribution-background-voices-example-1-explanation = Ти йдеш? <strong>[кличе хтось інший]</strong>
contribution-volume-title = Гучність
contribution-volume-description = Будуть природні коливання гучності між читачами. Відхиляйте записи лише якщо гучність настільки значна, що запис хрипить, або (частіше), якщо вона настільки низька, що ви не можете зрозуміти вимовлене не глянувши на написаний текст.
contribution-reader-effects-title = Штучність вимови
contribution-reader-effects-description = Більшість записів — це люди, які розмовляють своїм природним голосом. Ви можете прийняти випадкові нестандартні записи, у яких читачі викрикують, шепочуть або явно передають написане «драматичним» голосом. Будь ласка, відхиліть заспівані записи та записи, що використовують комп'ютерний синтезований голос.
contribution-just-unsure-title = Просто не впевнені?
contribution-just-unsure-description = Якщо ви стикаєтесь із випадком, не описаним у цих настановах, просимо голосувати якнайоб'єктивніше. Якщо ви дійсно не можете визначитися, натисніть кнопку пропуску та переходьте до наступного запису.
see-more = <chevron></chevron>Докладніше
see-less = <chevron></chevron>Згорнути
