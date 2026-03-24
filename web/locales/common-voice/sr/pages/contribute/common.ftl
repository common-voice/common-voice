action-click = Кликни
action-tap = Тапни
contribute = Допринеси
review = Преглед
skip = Прескочи
shortcuts = Пречице
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> исечак
        [few] <bold>{ $count }</bold> исечка
       *[other] <bold>{ $count }</bold> исечака
    }
goal-help-recording = Помогли сте Common Voice-у да достигне <goalPercentage></goalPercentage> од нашег дневног { $goalValue } циља за снимање!
goal-help-validation = Помогли сте Common Voice-у да достигне <goalPercentage></goalPercentage> од нашег дневног { $goalValue } циља валидације!
contribute-more =
    { $count ->
        [one] Спремни да урадите још { $count }?
        [few] Спремни да урадите још { $count }?
       *[other] Спремни да урадите још { $count }?
    }
speak-empty-state = Понестало нам је реченица за снимање на овом језику...
no-sentences-for-variants = Ваша варијанта језика је можда остала без реченица! Ако желите, можете да промените подешавања како бисте видели друге реченице у оквиру свог језика.
speak-empty-state-cta = Предложите реченице
speak-loading-error =
    Нисмо успели да преузмемо реченице за изговарање.
    Покушајте поново касније.
record-button-label = Снимите свој глас
share-title-new = <bold>Помозите нам</bold> да пронађемо више гласова
keep-track-profile = Пратите свој напредак преко профила
login-to-get-started = Пријавите се или направите налог да бисте започели
target-segment-first-card = Помажете у постизању нашег првог циљног сегмента
target-segment-generic-card = Доприносите циљном сегменту
target-segment-first-banner = Помозите Common Voice-у у прављењу првог циљног { $locale } сегмента
target-segment-add-voice = Додајте ваш глас
target-segment-learn-more = Сазнајте више
change-preferences = Промени поставке
login-signup = Пријава / Регистрација
vote-yes = Да
vote-no = Не
datasets = Скупови података
languages = Језици
about = О пројекту
partner = Партнери
submit-form-action = Пошаљи

## Reporting

report = Пријави
report-title = Поднеси пријаву
report-ask = Шта није у реду са овом реченицом?
report-offensive-language = Увредљив језик
report-offensive-language-detail = Изјава садржи неучтив или увредљив језик.
report-grammar-or-spelling = Граматичка грешка / грешка при куцању
report-grammar-or-spelling-detail = Изјава садржи граматичке грешке или грешке у куцању.
report-different-language = Другачији језик
report-different-language-detail = Изјава је на другачијем језику од оног ког говорим.
report-difficult-pronounce = Тешко за изговорити
report-difficult-pronounce-detail = Изјава садржи речи или фразе које су тешке за прочитати или изговорити.
report-offensive-speech = Увредљив језик
report-offensive-speech-detail = Клип садржи неучтив или увредљив језик.
report-other-comment =
    .placeholder = Коментар
success = Успех
continue = Настави
report-success = Пријава је успешно поднета

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = с

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = р
shortcut-record-toggle-label = Снимај/заустави
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Сними поново
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Одбаците текуће снимање
shortcut-submit = Назад
shortcut-submit-label = Пошаљи исечке
request-language-text = Још не видите ваш језик у пројекту Common Voice?
request-language-button = Затражи језик

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = п
shortcut-play-toggle-label = Пусти/заустави
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = д
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = н

## Validation criteria

contribution-criteria-nav = Критеријуми
contribution-criteria-link = Разумевање критеријума учешћа
contribution-criteria-page-title = Критеријуми учешћа
contribution-criteria-page-description = Схватите на шта морате да пазите док слушате гласовне узорке, па чак и обогатите своје снимке!
contribution-for-example = на пример
contribution-misreadings-title = Грешке при читању
contribution-misreadings-description = Приликом слушања, пажљиво проверите да ли је снимљено тачно онако како је написано; одбацујте чак и ако постоје мање грешке. <br />Врло честе грешке укључују:
contribution-misreadings-description-extended-list-1 = Недостаје <strong>„A“</strong> или <strong>„The“</strong> на почетку снимка.
contribution-misreadings-description-extended-list-2 = Недостаје <strong>„s“</strong> на крају речи.
contribution-misreadings-description-extended-list-3 = Читање скраћеница које заправо нису ту, као што је „We're“ уместо „We are“, или обрнуто.
contribution-misreadings-description-extended-list-4 = Одсуство краја последње речи због превременог престанка снимања.
contribution-misreadings-description-extended-list-5 = Поновљени покушаји читања речи.
contribution-misreadings-example-1-title = The giant dinosaurs of the Triassic.
contribution-misreadings-example-2-title = The giant dinosaur of the Triassic.
contribution-misreadings-example-2-explanation = [Требало би да буде „dinosaurs“]
contribution-misreadings-example-3-title = The giant dinosaurs of the Triassi-.
contribution-misreadings-example-3-explanation = [Снимак је прекинут пре краја последње речи]
contribution-misreadings-example-4-title = The giant dinosaurs of the Triassic. Yes.contribution-misreadings-example-4-explanation = [Снимљено је више од потребног текста]
contribution-misreadings-example-5-title = We are going out to get coffee.
contribution-misreadings-example-6-title = We’re going out to get coffee.
contribution-misreadings-example-6-explanation = [Требало би да буде „We are“]
contribution-misreadings-example-7-title = We are going out to get a coffee.
contribution-misreadings-example-7-explanation = [Нема „а“ у оригиналном тексту]
contribution-misreadings-example-8-title = The bumblebee sped by.
contribution-misreadings-example-8-explanation = [Неподударање садржаја]
contribution-varying-pronunciations-title = Различити изговори
contribution-varying-pronunciations-description = Будите опрезни пре него што одбијете снимак због тога што је читалац погрешно изговорио реч, ставио нагласак на погрешно место или очигледно занемарио знак питања. Постоји велики избор изговора који се користе широм света, од којих неке можда нисте чули у својој локалној заједници. Молимо вас да покажете разумевање за оне који можда говоре другачије од вас.
contribution-varying-pronunciations-description-extended = С друге стране, ако мислите да се читалац вероватно никада раније није сусрео са том речју и да једноставно нагађа изговор, одбијте снимак. Ако нисте сигурни, користите дугме за прескакање.
contribution-varying-pronunciations-example-1-title = On his head he wore a beret.
contribution-varying-pronunciations-example-1-explanation = [„Beret“ је у реду без обзира на то да ли је нагласак на првом слогу (УК) или другом (САД)]
contribution-varying-pronunciations-example-2-title = His hand was rais-ed.
contribution-varying-pronunciations-example-2-explanation = [„Raised“ се у енглеском језику увек изговара као један слог, а не два]
contribution-background-noise-title = Позадинска бука
contribution-background-noise-description = Желимо да алгоритми машинског учења могу да обрађују различите врсте позадинске буке, па чак и релативно гласни звуци могу бити прихваћени под условом да вас не спречавају да чујете цео текст. Тиха позадинска музика је у реду; музика која је довољно гласна да вас спречи да чујете сваку реч није.
contribution-background-noise-description-extended = Ако се снимак прекида или крчи, одбијте га, осим ако се и даље може чути цео текст.
contribution-background-noise-example-1-fixed-title = <strong>[Кијање]</strong> Џиновски диносауруси <strong>[кашаљ]</strong> тријаса.
contribution-background-noise-example-2-fixed-title = Џиновски диносаурус <strong>[кашаљ]</strong> тријаса.
contribution-background-noise-example-2-explanation = [Део текста се не чује]
contribution-background-noise-example-3-fixed-title = <strong>[Крчање]</strong> џиновски диносауруси <strong>[крчање]</strong> тријаса.
contribution-background-voices-title = Гласови у позадини
contribution-background-voices-description = Тихи жамор у позадини је у реду, али не желимо додатне гласове који могу довести до тога да машински алгоритам препозна речи које нису у написаном тексту. Ако можете чути јасне речи поред оних из текста, снимак треба одбити. Обично се то дешава када је ТВ остао укључен или када се у близини води разговор.
contribution-background-voices-description-extended = Ако се снимак прекида или крчи, одбијте га, осим ако се и даље може чути цео текст.
contribution-background-voices-example-1-title = Џиновски диносауруси тријаса. <strong>[чита један глас]</strong>
contribution-background-voices-example-1-explanation = Долазиш ли? <strong>[дозива други]</strong>
contribution-volume-title = Јачина звука
contribution-volume-description = Постојаће природне варијације у јачини звука између читалаца. Одбијте само ако је јачина толико велика да се снимак прекида, или (чешће) ако је толико мала да не можете чути шта је речено без увида у написани текст.
contribution-reader-effects-title = Ефекти читаоца
contribution-reader-effects-description = Већина снимака су људи који говоре својим природним гласом. Можете прихватити повремени нестандардни снимак који је викан, шапутан или очигледно изведен „драмским“ гласом. Молимо вас да одбијете певане снимке и оне који користе компјутерски синтетизован глас.
contribution-just-unsure-title = Нисте сигурни?
contribution-just-unsure-description = Ако наиђете на нешто што ова упутства не покривају, гласајте према свом најбољем нахођењу. Ако заиста не можете да одлучите, користите дугме за прескакање и пређите на следећи снимак.
see-more = <chevron></chevron>Прикажи више
see-less = <chevron></chevron>Прикажи мање
