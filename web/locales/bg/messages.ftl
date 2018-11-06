## General

yes-receive-emails = Да, искам да получавам електронни писма. Бих искал да съм информиран за работата по проекта Common Voice.
stayintouch = Ние в Mozilla изграждаме общност около гласовите технологии. Бихме искали да поддържаме връзка с новини, нови източници на данни и да научим повече за това как вие използвате тези данни.
privacy-info = Ние обещаваме да обработваме вашата информация внимателно. Прочетете повече в нашите <privacyLink> Условия за поверителност </ privacyLink>.
return-to-cv = Обратно към Common Voice
email-input =
    .label = Електронна поща
submit-form-action = Изпращане
loading = Зареждане…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

ace = Ачехски
an = Арагонски
ar = Арабски
as = Асамски
ast = Астурски
az = Азербайджански
bn = Бенгалски
br = Бретонски
bxr = Бурятски
ca = Каталунски
cak = Какчикелски
cnh = Чински
cs = Чешки
cv = Чувашки
cy = Уелски
da = Датски
de = Немски
dsb = Долнолужишки
el = Гръцки
en = Английски
eo = Есперанто
es = Испански
et = Естонски
fa = Персийски
fi = Финландски
fo = Фарьорски
fr = Френски
fy-NL = Фризийски
ga-IE = Ирландски
he = Иврит
hsb = Горнолужишки
hu = Унгарски
ia = Интерлингва
id = Индонезийски
is = Исландски
it = Италиански
ja = Японски
ka = Грузински
kab = Кабилски
kk = Казахкски
ko = Корейски
kpv = Коми-зирянски
kw = Корнийски
ky = Киргизски
mdf = Мокша
mk = Македонски
mn = Монголски
myv = Ерзянски
nb-NO = Норвежки Бокмал
ne-NP = Непалски
nl = Нидерландски
nn-NO = Норвежки (Нюношк)
oc = Окситански
or = Одийски
pl = Полски
pt-BR = Португалски (Бразилия)
rm-sursilv = Сурсливан
ro = Румънски
ru = Руски
sah = Сакха
sk = Словашки
sl = Словенски
sq = Албански
sr = Сръбски
sv-SE = Шведски
ta = Тамилски
te = Телугу
th = Тайландски
tr = Турски
tt = Татарски
uk = Украински
ur = Урду
uz = Узбекски
vi = Виетнамски
zh-CN = Китайски (Китай)
zh-HK = Китайски (Хонконг)
zh-TW = Китайски (Тайван)

# [/]


## Layout

speak = Говорете
speak-now = Говорете сега
datasets = Набори от данни
languages = Езици
profile = Профил
help = Помощ
contact = Контакт
privacy = Поверителност
terms = Условия
cookies = Бисквитки
faq = Често задавани въпроси
content-license-text = Съдържанието е достъпно под <licenseLink>Creative Commons лиценз</licenseLink>
share-title = Помогнете ни да намерим и други, които да споделят гласа си!
share-text = Помогнете да научим машините как говорят хората, дарете гласа си на { $link }
link-copied = Препратката е копирана
back-top = Връщане в началото
contribution-banner-text = Току-що стартирахме нов начин да помогнете

## Home Page

vote-yes = Да
vote-no = Не
toggle-play-tooltip = Натиснете { shortcut-play-toggle }, за да превключите в режим на възпроизвеждане
speak-subtitle = Дари своя глас
speak-goal-text = Записани клипове
listen-goal-text = Проверени клипове
hours-recorded = Записани часове
hours-validated = Проверени часове
ready-to-record = Готови ли сте да дарите гласа си?
all-languages = Всички езици
today = Днес
x-weeks-short =
    { $count ->
        [one] Седмица
       *[other] { $count } седмици
    }
x-months-short =
    { $count ->
        [one] Месец
       *[other] { $count } месеци
    }
x-years-short =
    { $count ->
        [one] Година
       *[other] { $count } години
    }

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = с

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

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = з
shortcut-record-toggle-label = Записване/Спиране
request-language-text = Не виждате вашия език в Common Voice?
request-language-button = Заявяване на език

## ProjectStatus

status-contribute = Допринесете с вашия глас
status-hours =
    { $hours ->
        [one] един  валидиран час досега!
       *[other] { $hours } валидирани часове досега!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Следваща цел: { $goal }
english = Английски

## ProfileForm

profile-form-cancel = Изход от фрмуляра
profile-form-username =
    .label = Потребителско име
profile-form-language =
    .label = Език
profile-form-accent =
    .label = Акцент
profile-form-age =
    .label = Възраст
profile-form-gender =
    .label = Пол
leaderboard-visibility =
    .label = Видимост на класацията
native-language =
    .label = Роден език
profile-form-submit-save = Запазване
profile-form-submit-saved = Запазено
male = Мъж
female = Жена
# Gender
other = Друг
why-profile-title = Защо да си създадете профил?
why-profile-text = С предоставянето на кратка информация за себе си към Common Voice ще подпомогнете на системите за гласово разпознаване да подобрят точността си.
edit-profile = Редактирайте профила си
profile-create-success = Профилът е създаден успешно!
profile-close = Затваряне
edit = Редактиране
email-subscriptions = Абонаменти за имейл
off = Изключено
on = Включено
connect-gravatar = Свързване с Gravatar
gravatar_not_found = Не е открит профил в gravatar с вашата електронна поща
file_too_large = Избраният файл е прекалено голям

## FAQ


## Profile


## NotFound


## Data

review-recording = Преглед
review-rerecord = Презапис
review-cancel = Отказ на изпращането
review-keep-recordings = Запазване на записите
review-delete-recordings = Изтриване на моите записи

## Download Modal


## Contact Modal


## Request Language Modal


## Languages Overview


## New Contribution

contribute-more =
    { $count ->
        [one] Готови ли сте за още { $count }?
       *[other] Готови ли сте за още { $count }?
    }
record-instruction = { $actionType }<recordIcon></recordIcon> след това прочетете изречението на глас
review-instruction = Преслушайте и ако е нужно запишете клипа отново
record-abort-text = Ако напуснете сега, ще загубите напредъка
record-abort-submit = Изпращане клиповете
listen-instruction = { $actionType }<playIcon></playIcon> точно ли беше изговорено изречението?
listen-3rd-time-instruction = Изминаха 2, продължете!<playIcon></playIcon>
listen-last-time-instruction = <playIcon></playIcon>Последно!
