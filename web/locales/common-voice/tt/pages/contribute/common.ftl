action-click = Чиртегез
action-tap = Төймәгә басып алыгыз,
contribute = Үз өлешеңне кертү
review = Тикшерү
skip = Калдырып тору
shortcuts = Төймә комбинацияләре
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Клип
       *[other] <bold>{ $count }</bold> Клиплар
    }
goal-help-recording = Сез Common Voice'ка көнлек { $goalValue } аудиоязма яздыру максатының <goalPercentage></goalPercentage> күрсәткеченә ирешүдә ярдәм иттегез!
goal-help-validation = Сез Common Voice'ка көнлек { $goalValue } аудиоязма тикшерү максатының <goalPercentage></goalPercentage> күрсәткеченә ирешүдә ярдәм иттегез!
contribute-more =
    { $count ->
        [one] башка
       *[other] Тагын { $count }'не башкарырга әзерме?
    }
speak-empty-state = Бу телдә яздыруга җөмләләр калмады...
speak-empty-state-cta = Җөмләләр өстәү
speak-loading-error =
    Сезгә укыр өчен  һичбер җөмлә табылмады.
    Зинһар соңрак тырышып карагыз.
record-button-label = Тавышыгызны яздырыгыз
share-title-new = Безгә күбрәк тавыш табарга <bold>ярдәм итегез</bold>
keep-track-profile = Профиль булдырып, башкарган эшләрегезне күзәтеп барыгыз
login-to-get-started = Башлау өчен керегез яки теркәлегез
target-segment-first-card = Сез үз өлешегезне безнең беренче максатлы сегментыбызга кертәсез
target-segment-generic-card = Сез үз өлешегезне максатлы сегментка кертәсез
target-segment-first-banner = Common Voice-ның { $locale } беренче максатлы сегментын булдырырга ярдәм итегез
target-segment-add-voice = Тавышыгызны өстәү
target-segment-learn-more = Тулырак
change-preferences = Көйләнмәләрне үзгәртү

## Contribution Nav Items

contribute-voice-collection-nav-header = Тавыш туплау
contribute-sentence-collection-nav-header = Җөмләләр туплау
login-signup = Керү / Теркәлү
vote-yes = Әйе
vote-no = Юк
datasets = Мәгълүмат тупланмалары
languages = Телләр
about = Хакында
partner = Партнёр
submit-form-action = Җибәрү

## Reporting

report = Шикаять итү
report-title = Шикаять итү
report-ask = Бу җөмләгә бәйле нинди кыенлыкларыгыз бар?
report-offensive-language = Рәнҗеткеч сүзләр
report-offensive-language-detail = Җөмләдә кимсетүле я рәнҗеткеч сүзләр бар.
report-grammar-or-spelling = Грамматик / орфографик хата
report-grammar-or-spelling-detail = Җөмләдә грамматик яки орфографик хата бар.
report-different-language = Башка тел
report-different-language-detail = Бу җөмлә мин сөйләшкән телдә түгел.
report-difficult-pronounce = Әйтүе кыен
report-difficult-pronounce-detail = Бу җөмләдә укырга я әйтергә кыен сүзләр я гыйбарәләр бар.
report-offensive-speech = Рәнҗеткеч сүз
report-offensive-speech-detail = Бу клипта кимсетүле-рәнҗеткеч  гыйбарәләр бар.
report-other-comment =
    .placeholder = Комментарий
success = Уңыш
continue = Дәвам итү
report-success = Шикаять җибәрелде

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Яздыру/Туктату
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Клипны янәдән яздыру
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Агымдагы яздырудан баш тарту
shortcut-submit = Enter
shortcut-submit-label = Клипларны җибәрү
request-language-text = Common Voice'ка Сезнең телегез өстәлмәгәнме әле?
request-language-button = Телнең өстәлүен сорау

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Уйнату/Туктату
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Критерийлар
contribution-criteria-link = Катнашу критерийларын аңлау
contribution-criteria-page-title = Катнашу критерийлары
contribution-criteria-page-description = Аудиоязмаларны тыңлаганда нәрсәгә игътибар итәргә кирәклеген, һәм үзегезнең аудиоязмаларыгызны да ничек баетып булганын өйрәнегез.
contribution-for-example = мәсәлән
contribution-misreadings-title = Дөрес укымаулар
contribution-misreadings-description = Сез тыңлаган аудиоязманың текстка туры килүен бик игътибар белән тикшерегез. Кечкенә генә хаталар булса да, аудиоязманы кире кагасыз. <br />Бик еш очраучы хата мисаллары:
contribution-misreadings-description-extended-list-1 = Аудиоязма башында сүз яки сүзнең бер өлешен төшереп калдыру. Мәсәлән, "сәлам" урынына "әләм" дип яздыру.
contribution-misreadings-description-extended-list-2 = Сүз ахырында <strong>"лар/ләр"</strong> төшеп калган.
contribution-misreadings-description-extended-list-5 = Бер үк сүзне берничә тапкыр укырга тырышу.
contribution-misreadings-example-1-title = Бу балыклар базарда сатыла.
contribution-misreadings-example-2-title = Бу балык базарда сатыла.
contribution-misreadings-example-2-explanation = ["балыклар" булырга тиеш иде]
contribution-misreadings-example-3-title = Бу балыклар базарда саты-.
contribution-misreadings-example-4-title = Бу балыклар базарда сатыла. Әйе.
contribution-misreadings-example-5-title = Без кофе алырга тышка чыгып керергә җыенабыз.
contribution-misreadings-example-6-title = Без кофе алырга тышка чыгып керергә җыенабыз.
contribution-misreadings-example-8-explanation = [Туры килмәгән эчтәлек]
contribution-varying-pronunciations-title = Төрле әйтелешләр
contribution-varying-pronunciations-description = Укучының сүзне дөрес әйтмәве, басымны урынсыз калдыруы яки сорау билгесенә игътибар итмәве нигезендә язуны кире кагар алдыннан сак булыгыз. Дөньяның һәм илнең төрле почмакларында кулланылган төрле акцентлар һәм әйтелешләр булырга мөмкин. Зинһар, сездән башкача сөйләшә алганнарны кире какмагыз.
contribution-background-noise-title = Арткы планда шау-шу
contribution-background-voices-title = Арткы планда тавышлар
contribution-volume-title = Тавыш көче
contribution-reader-effects-title = Укучы эффектлары
contribution-just-unsure-title = Тәгаен белмисезме?
see-more = <chevron></chevron>Күбрәк
see-less = <chevron></chevron>Әзрәк
