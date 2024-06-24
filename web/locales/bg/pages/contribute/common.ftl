## Contribution

action-click = Изберете
action-tap = Докоснете
## Languages

contribute = Как да помогнете
review = Преглед
skip = Пропускане
shortcuts = Бързи клавиши
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> запис
       *[other] <bold>{ $count }</bold> записа
    }
goal-help-recording = Помогнахте Common Voice да изпълни <goalPercentage></goalPercentage> от ежедневната ни цел от { $goalValue } нови записи!
goal-help-validation = Помогнахте Common Voice да изпълни <goalPercentage></goalPercentage> от ежедневна ни цел за проверка на { $goalValue } записи!
contribute-more =
    { $count ->
        [one] Готови ли сте за още { $count }?
       *[other] Готови ли сте за още { $count }?
    }
speak-empty-state = Няма повече изречения за запис на този език…
speak-empty-state-cta = Дарете изречение
speak-loading-error =
    Не успяхме да намерим изречения, за да ги изговорите.
    Моля, опитайте отново по-късно.
record-button-label = Запишете гласа си
share-title-new = <bold>Помогнете</bold> да намерим още гласове
keep-track-profile = Следете напредъка си като създадете профил
login-to-get-started = За да започнете се впишете или се регистрирайте
target-segment-first-card = Вие допринасяте за създаването на първия ни целеви сегмент
target-segment-generic-card = Допринасяте за създаването на целеви сегмент
target-segment-first-banner = Помогнете за създаването на първия целеви сегмент на Common Voice на { $locale }
target-segment-add-voice = Добавете своя глас
target-segment-learn-more = Научете повече

## Contribution Nav Items

contribute-voice-collection-nav-header = Гласова колекция
contribute-sentence-collection-nav-header = Колекция със изречения

## Reporting

report = Докладване
report-title = Изпращане на доклад
report-ask = Какви проблеми срещате с това изречение?
report-offensive-language = Обиден изказ
report-offensive-language-detail = В изречението има неуважителен или обиден изказ.
report-grammar-or-spelling = Граматична / правописна грешка
report-grammar-or-spelling-detail = В изречението има граматична или правописна грешка.
report-different-language = На друг език е
report-different-language-detail = Написано е на език, различен от този, който говоря.
report-difficult-pronounce = Трудно е за произнасяне
report-difficult-pronounce-detail = Съдържа думи или фрази, които са трудни за прочитане или произнасяне.
report-offensive-speech = Обидна реч
report-offensive-speech-detail = В записа има неуважителна или обидна реч.
report-other-comment =
    .placeholder = Коментар
success = Успех
continue = Продължаване
report-success = Докладът е изпратен успешно

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = с

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = з
shortcut-record-toggle-label = Записване/Спиране
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Направете записа отново
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Отхвърляне на текущия запис
shortcut-submit = Enter
shortcut-submit-label = Изпращане на записите
request-language-text = Не виждате своя език в Common Voice?
request-language-button = Заявяване на език

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = п
shortcut-play-toggle-label = Старт/Стоп
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = д
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = н

## Validation criteria

contribution-criteria-nav = Критерии
contribution-criteria-link = Разберете критериите за принос
contribution-criteria-page-title = Критерии за принос
contribution-criteria-page-description = Разберете на какво да обърнете внимание, когато слушате гласови записи и направите и вашите гласови записи по-богати!
contribution-for-example = например
contribution-misreadings-title = Неправилни разчитания
contribution-misreadings-description = Когато слушате, проверете много внимателно дали записаното е точно това, което е написано; отхвърлете, ако има дори незначителни грешки. <br />Много често срещаните грешки включват:
contribution-misreadings-description-extended-list-1 = Липсват <strong>думи</strong>  в началото на записа.
contribution-misreadings-example-8-explanation = [Несъответстващо съдържание]
contribution-varying-pronunciations-title = Различни произношения
contribution-varying-pronunciations-description = Бъдете внимателни, преди да отхвърлите клип на основание, че читателят е произнесъл погрешно дума, поставил е ударението на грешното място или очевидно е пренебрегнал въпросителен знак. Има голямо разнообразие от произношения, използвани по целия свят, някои от които може да не сте чували в местната общност. Моля, предоставете свобода на преценка за тези, които може да говорят различно от вас.
contribution-varying-pronunciations-description-extended = От друга страна, ако смятате, че читателят вероятно никога не е срещал думата преди и просто прави неправилно предположение за произношението, моля, отхвърлете. Ако не сте сигурни, използвайте бутона за пропускане.
contribution-varying-pronunciations-example-1-title = На главата си носеше барета.
contribution-varying-pronunciations-example-1-explanation = [„Барeта“ е ОК, независимо дали с ударение върху първата сричка (Великобритания) или втората (САЩ)]
contribution-varying-pronunciations-example-2-title = Ръката му беше вдигната.
contribution-varying-pronunciations-example-2-explanation = [„Raised“ на английски винаги се произнася като една сричка, а не като две]
contribution-background-noise-title = Фонов шум
contribution-background-noise-description = Искаме алгоритмите за машинно обучение да могат да се справят с различни фонови шумове и дори относително силни шумове могат да бъдат приети, при условие че не ви пречат да чуете целия текст. Тихата фонова музика е ОК; достатъчно силна музика, за да ви попречи да чуете всяка дума, не е така.
contribution-background-noise-description-extended = Ако записът се разпада или има пращене, отхвърлете, освен ако не може да се чуе целият текст.
contribution-background-noise-example-1-fixed-title = <strong>[Кихане]</strong> Гигантските динозаври от <strong>[кашлица]</strong> триас.
contribution-background-noise-example-2-fixed-title = Гигантският дино <strong>[кашля]</strong> от триас.
contribution-background-noise-example-2-explanation = [Част от текста не се чува]
contribution-background-noise-example-3-fixed-title = <strong>[Пращене]</strong> гигантски динозаври от <strong>[пращене]</strong> -риас.
contribution-background-voices-title = Фонови гласове
contribution-background-voices-description = Тихият фонов шум е ОК, но ние не искаме допълнителни гласове, които могат да накарат машинен алгоритъм да идентифицира думи, които не са в писмения текст. Ако можете да чуете различни думи, различни от тези в текста, клипът трябва да бъде отхвърлен. Обикновено това се случва, когато телевизорът е оставен включен или когато наблизо се води разговор.
contribution-background-voices-description-extended = Ако записът се разпадне или има пращене, отхвърлете, освен ако не може да се чуе целият текст.
contribution-background-voices-example-1-title = Гигантските динозаври от триаса. <strong>[чете се от един глас]</strong>
contribution-background-voices-example-1-explanation = Идваш ли? <strong>[извикан от друг]</strong>
contribution-volume-title = Сила на звука
contribution-volume-description = Ще има естествени разлики в силата на гласа на читателите. Отхвърлете само ако силата на звука е толкова висока, че записът се разпада, или (по-често) ако е толкова ниска, че не можете да чуете какво се казва, без да се позовавате на писмения текст.
contribution-reader-effects-title = Читателски ефекти
contribution-reader-effects-description = Повечето записи са на хора, които говорят с естествения си глас. Можете да приемете случайни нестандартни записи, които се извикват, шепнат или очевидно се предават с „драматичен“ глас. Моля, отхвърлете изпятите записи и тези, използващи компютърно синтезиран глас.
contribution-just-unsure-title = Просто не сте сигурни?
contribution-just-unsure-description = Ако попаднете на нещо, което тези указания не покриват, моля, гласувайте според най-добрата си преценка. Ако наистина не можете да решите, използвайте бутона за пропускане и преминете към следващия запис.
see-more = <chevron></chevron>Вижте още
see-less = <chevron></chevron>Вижте по-малко

