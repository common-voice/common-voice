## General

yes-receive-emails = Ja tak, send mig gerne mails, så jeg er opdateret om projektet Common Voice.
stayintouch = Hos Mozilla bygger vi et fællesskab omkring stemmeteknologi. Vi vil gerne holde kontakten med opdateringer, nye datakilder og høre mere om, hvordan du bruger disse informationer.
privacy-info = Vi lover at behandle dine oplysninger på betryggende vis. Læs mere i vores <privacyLink>Privatlivspolitik</privacyLink>.
return-to-cv = Vend tilbage til Common Voice
email-input =
    .label = Mail
submit-form-action = Indsend
loading = Indlæser…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

an = Aragonsk
ar = Arabisk
as = Assamesisk
ast = Asturisk
az = Aserbajdsjansk
bn = Bengalsk
br = Bretonsk
bxr = Burjatisk
ca = Catalansk
cnh = Hakha Chin
cs = Tjekkisk
cv = Tjuvasjisk
cy = Walisisk
da = Dansk
de = Tysk
dsb = Nedresorbisk
el = Græsk
en = Engelsk
es = Spansk
et = Estisk
fi = Finsk
fo = Færøsk
fr = Fransk
fy-NL = Frisisk
ga-IE = Irsk
he = Hebraisk
hsb = Øvresorbisk
hu = Ungarnsk
ia = Interlingua
id = Indonesisk
is = Islandsk
it = Italiensk
ja = Japansk
ka = Georgisk
kab = Kabylisk
kk = Kasakhisk
ko = Koreansk
kpv = Komi
kw = Cornisk
ky = Kirgisisk
mk = Makedonsk
myv = Erzya
nb-NO = Bokmål
ne-NP = Nepalesisk
nl = Nederlandsk
nn-NO = Nynorsk
or = Oriya
pl = Polsk
pt-BR = Portugisisk (Brasilien)
ro = Rumænsk
ru = Russisk
sah = Yakut
sk = Slovakisk
sl = Slovensk
sq = Albansk
sr = Serbisk
sv-SE = Svensk
ta = Tamil
te = Telugu
th = Thai
tr = Tyrkisk
tt = Tatarisk
uk = Ukrainsk
uz = Usbekisk
zh-CN = Kinesisk (Kina)
zh-HK = Kinesisk (Hong Kong)
zh-TW = Kinesisk (Taiwan)

# [/]


## Layout

speak = Tal
speak-now = Tal nu
datasets = Datasæt
languages = Sprog
profile = Profil
help = Hjælp
contact = Kontakt
privacy = Privatliv
terms = Vilkår
cookies = Cookies
faq = Ofte stillede spørgsmål
content-license-text = Indhold tilgængeligt under <licenseLink>Creative Commons-licens</licenseLink>
share-title = Hjælp os med at finde andre, der kan bidrage med deres stemme!
share-text = Hjælp med at lære maskiner, hvordan mennesker taler - bidrag med din stemme på { $link }
link-copied = Link kopieret
back-top = Tilbage til toppen
contribution-banner-text = Vi har netop lanceret et nyt interface til at bidrage
contribution-banner-button = Tag et kig
report-bugs-link = Hjælp med at rapportere fejl

## Home Page

home-title = Projektet Common Voice er et Mozilla-initiativ, der skal hjælpe maskiner med at forstå, hvordan mennesker taler.
home-cta = Åbn munden og vær med her!
wall-of-text-start = Stemmen er naturlig, stemmen er menneskelig. Det er derfor, vi er fascineret af at skabe en brugbar stemmeteknologi til vores maskiner. Men for at skabe systemer til stemmegenkendelse kræves en ekstrem stor mængde stemmedata.
wall-of-text-more-mobile = Hovedparten af de data, som bruges af store virksomheder, er ikke tilgængelige for flertallet af mennesker. Vi mener, at det bremser ny innovation. Derfor har vi startet projektet Common Voice, der skal hjælpe med at gøre stemmegenkendelse tilgængeligt for alle.
wall-of-text-more-desktop = Nu kan du bidrage med din stemme og hjælpe med at opbygge en open source stemmedatabase, som alle kan bruge til at skabe innovative applikationer, både til computere, telefoner og til internettet.<lineBreak></lineBreak> Læs en sætning og hjælp maskiner til at forstå, hvordan mennesker taler. Kontrollér andres bidrag og vær med til at forbedre kvaliteten. Så simpelt er det!
show-wall-of-text = Læs mere
help-us-title = Hjælp os med at kontrollere sætninger!
help-us-explain = Tryk på afspil, lyt og fortæl os, om den indtalte sætning var korrekt.
no-clips-to-validate = Det ser ud til, at der ikke er nogen klip at lytte til på dette sprog. Hjælp os med at fylde køen ved at optage nogle nu.
vote-yes = Ja
vote-no = Nej
toggle-play-tooltip = Tryk på { shortcut-play-toggle } for at starte eller stoppe afspilningen

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = p

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = s
shortcut-play-toggle-label = Afspil/Stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = j
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = O
shortcut-record-toggle-label = Optag/Stop
request-language-text = Kan du ikke finde dit sprog på Common Voice?
request-language-button = Anmod om at få tilføjet et nyt sprog

## ProjectStatus

status-title = Overordnet status for projektet. Se, hvor langt vi er kommet!
status-contribute = Bidrag med din stemme
status-hours =
    { $hours ->
        [one] En valideret time indtil videre!
       *[other] { $hours } validerede timer indtil videre!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Næste mål: { $goal }
english = Engelsk

## ProfileForm

profile-form-cancel = Luk formular
profile-form-delete = Slet profil
profile-form-username =
    .label = Brugernavn
profile-form-language =
    .label = Sprog
profile-form-accent =
    .label = Accent
profile-form-age =
    .label = Alder
profile-form-gender =
    .label = Køn
profile-form-submit-save = Gem
profile-form-submit-saved = Gemt
profile-keep-data = Behold data
profile-delete-data = Slet data
male = Mand
female = Kvinde
# Gender
other = Andet
why-profile-title = Hvorfor oprette en profil?
why-profile-text = Ved at give nogle oplysninger om dig selv, vil de lyddata, du indsender til Common Voice være mere brugbare til talegenkendelses-systemerne, der skal bruge disse data til at forbedre deres nøjagtighed.
edit-profile = Rediger profil
profile-create = Opret en profil
profile-create-success = Profil oprettet!
profile-close = Luk
profile-clear-modal = Når du rydder dine profil-data vil denne demografiske information ikke længere blive sendt til Common Voice sammen med dine lydoptagelser.
profile-explanation = Hold styr på din fremgang med en profil, samtidig med at du gør vores stemme-data mere præcist.

## FAQ

faq-title = Ofte stillede spørgsmål
faq-what-q = Hvad er Common Voice?
faq-what-a = Stemmegenkendelses-teknologi kan revolutionere den måde, vi kommunikerer med maskiner på. Men de nuværende systemer er dyre og proprietære. Common Voice er et projekt, der vil gøre stemmegenkendelses-teknologi nemt og tilgængeligt for alle. Folk bidrager med deres stemme til en stor database, der hurtigt og nemt vil lade enhver træne stemmeaktiverede applikationer. Al stemmedata vil være tilgængelig for udviklere.
faq-important-q = Hvorfor er det vigtigt?
faq-important-a = Stemmen er naturlig, stemmen er menneskelig. Med stemmen kommunikerer vi nemmest og mest naturligt. Vi ønsker, at udviklere kan skabe fantastiske ting fra realtids-oversættere til stemmeaktiverede administrative assistenter. Men lige nu er der ikke nok offentligt tilgængelige data til at skabe denne type applikationer. Vi håber, at Common Voice vil give udviklere det, de har brug for til at kunne finde på nye ting.
faq-get-q = Hvordan får jeg adgang til data fra Common Voice?
faq-get-a = Datasættet er tilgængeligt nu på vores <downloadLink>download-side</downloadLink> under en <licenseLink>CC-0</licenseLink> licens.
faq-mission-q = Hvorfor er Common Voice en del af Mozillas mission?
faq-mission-a = Mozilla er dedikeret til at holde internettet åbent og tilgængeligt for alle. For at gøre det er vi nødt til at bemyndige kreative personer ved hjælp af projekter som Common Voice. Eftersom stemmeteknologier ikke længere kun bruges i niche-applikationer, mener vi, at de skal tjene alle brugere lige godt. Vi ser et behov for at medtage flere sprog, accenter og demografier, når stemmeteknologier skabes og testes. Mozilla ønsker et sundt og levende internet. Det betyder, at nye skabere skal have adgang til stemmedata, så de kan bygge nye, ekstraordinære projekter. Common Voice bliver en offentlig ressource, der vil komme til at hjælpe både Mozilla og udviklere over hele verden.
faq-native-q = { $lang } er ikke mit modersmål, og jeg taler med accent - vil I stadig gerne have, at jeg bidrager med min stemme?
faq-native-a = Ja, vi vil meget gerne have din hjælp! En del af målet med Common Voice er at indsamle så mange forskellige accenter som muligt, så computere bedre kan forstå <bold>alle</bold> når de taler.
faq-firefox-q = Vil tale-til-tekst via Common Voice nogensinde blive en del af Firefox?
faq-firefox-a = Common Voice har et ubegrænset potentiale, og vi undersøger talegrænseflader i mange Mozilla-produkter, inklusive Firefox.
faq-quality-q = Hvilket kvalitetsniveau for lyden er krævet for at den kan bruges?
faq-quality-a = Vi vil gerne have, at lydkvaliteten afspejler og kan konkurrere med andre tale-til-tekst applikationer på markedet. Derfor har vi brug for variation. Dette lærer tale-til-tekst applikationen at håndtere forskellige situationer — baggrundsstøj, bilstøj, blæserstøj — uden fejl.
faq-hours-q = Hvorfor er målet at have 10.000 timers lydoptagelser?
faq-hours-a = Det er omtrent det antal timer, som det kræver at træne et velfungerende tale-til-tekst system.
faq-source-q = Hvor kommer kildeteksten fra?
faq-source-a1 = De nuværende sætninger er donationer fra bidragydere samt dialog fra filmmanuskripter i offentligt domæne, fx <italic>It’s a Wonderful Life.</italic>
faq-source-a2 = Du kan se vores kildetekster i <dataLink>denne folder på GitHub</dataLink>.

## Profile

profile-why-title = Hvorfor oprette en profil?
profile-why-content = Ved at give nogle oplysninger om dig selv, vil de lyddata, du indsender til Common Voice være mere brugbare til talegenkendelses-systemerne, der skal bruge disse data til at forbedre deres nøjagtighed.

## NotFound

notfound-title = Ikke fundet
notfound-content = Jeg er bange for, at jeg ikke ved, hvad du leder efter.

## Data

data-download-button = Hent data fra Common Voice 
data-download-yes = Ja
data-download-deny = Nej
data-download-license = Licens: <licenseLink>CC-0</licenseLink>
data-download-modal = Du er ved at gå i gang med at hente <size>{ $size }GB</size>. Vil du fortsætte?
data-subtitle = Vi bygger et åbent og offentligt tilgængeligt datasæt bestående af stemmer, som alle kan bruge til at træne stemmeaktiverede programmer.
data-explanatory-text = Vi tror på, at store og offentligt tilgængelige stemme-datasæt vil fremme innovation og en sund kommerciel konkurrence indenfor stemmeteknologi baseret på maskinlæring. Dette er en global indsats, og vi inviterer alle til at deltage. Vores mål er at gøre stemmeteknologi mere inkluderende, så teknologierne afspejler en diversitet af stemmer fra hele verden.
data-get-started = <speechBlogLink>Kom i gang med talegenkendelse</speechBlogLink>
data-other-title = Andre stemme-datasæt
data-other-goto = Gå til { $name }
data-other-download = Hent data
data-other-librispeech-description = LibriSpeech er et korpus af cirka 1000 timers engelsk tale (optaget ved 16Khz), der stammer fra lydbøger fra LibriVox-projektet.
data-other-ted-name = TED-LIUM korpus
data-other-ted-description = TED-LIUM korpus er lavet på baggrund af taler og deres transskriptioner fra TED's websted.
data-other-voxforge-description = VoxForge blev startet for at indsamle transskriberet tale til brug for frie og open source talegenkendelses-systemer.
data-other-tatoeba-description = Tatoeba er en stor database af sætninger, oversættelser og indtalt lyd til brug for sprogindlæring. Denne filhentning indeholder indtalt engelsk optaget af fællesskabet bag Tatoeba.
data-bundle-button = Hent datasæt-samling
data-bundle-description = Data fra Common Voice  samt alle andre stemme-datasæt ovenfor.
license = Licens: <licenseLink>{ $license }</licenseLink>
license-mixed = Blandet

## Record Page

record-platform-not-supported = Vi beklager, men din platform er i øjeblikket ikke understøttet.
record-platform-not-supported-desktop = Til computere kan du hente den seneste version:
record-platform-not-supported-ios = <bold>iOS</bold>-brugere kan hente vores gratis app:
record-must-allow-microphone = Du skal tillade mikrofon-adgang.
record-retry = Prøv igen
record-no-mic-found = Ingen mikrofon fundet.
record-error-too-short = Optagelsen var for kort.
record-error-too-long = Optagelsen var for lang.
record-error-too-quiet = Optagelsen var for stille.
record-submit-success = Indsendt! Vil du lave en ny optagelse?
record-help = Klik for at starte optagelsen, og læs så sætningen ovenfor højt.
record-cancel = Afbryd genindspilningen
review-terms = Ved brug af Common Voice accepterer du vores <termsLink>Vilkår</termsLink> og <privacyLink>Privatlivspolitik</privacyLink>
terms-agree = Jeg accepterer
terms-disagree = Jeg accepterer ikke
review-aborted = Upload afbrudt. Vil du slette dine optagelser?
review-submit-title = Godkend og indsend
review-submit-msg = Tak for din optagelse! <lineBreak></lineBreak> Godkend og indsend dine optagelser nedenfor.
review-recording = Godkend
review-rerecord = Optag igen
review-cancel = Afbryd indsendelsen
review-keep-recordings = Behold optagelserne
review-delete-recordings = Slet mine optagelser

## Download Modal

download-title = Din filhentning er startet.
download-helpus = Hold kontakten via mail og hjælp os med at skabe et fællesskab omkring stemmeteknologi. 
download-form-email =
    .label = Indtast din mail
    .value = Tak, vi vender tilbage
download-back = Tilbage til datasæt for Common Voice
download-no = Nej tak

## Contact Modal

contact-title = Kontaktformular
contact-form-name =
    .label = Navn
contact-form-message =
    .label = Meddelelse
contact-required = *påkrævet

## Request Language Modal

request-language-title = Anmodning om et nyt sprog
request-language-form-language =
    .label = Sprog
request-language-success-title = Din anmodning om et nyt sprog er modtaget. Tak!
request-language-success-content = Vi kontakter dig snart med oplysninger om, hvordan du tilføjer dit sprog til Common Voice.

## Languages Overview

language-section-in-progress = I gang
language-section-in-progress-description = Kommende sprog er ved at blive gjort klar til at fællesskabet kan bidrage. Deres fremgang viser, hvor langt bidragsydere er med at oversætte hjemmesiden og indsamle sætninger.
language-section-launched = Startet
language-section-launched-description = For følgende sprog er hjemmesiden blevet oversat, og der er indsamlet sætninger nok. <italic>{ speak }</italic> eller <italic>{ listen }</italic> for at bidrage.
languages-show-more = Se flere
languages-show-less = Se færre
language-speakers = Talere
language-meter-in-progress = Status
language-total-progress = I alt
language-search-input =
    .placeholder = Søg

## New Contribution

action-click = Klik på
action-tap = Tryk på
contribute = Bidrag
listen = Lyt
skip = Spring over
shortcuts = Genveje
clips = Klip
goal-help-recording = Du har hjulpet Common Voice med at nå <goalPercentage></goalPercentage> af vores daglige { $goalValue } mål for indspilninger!
goal-help-validation = Du har hjulpet Common Voice med at nå <goalPercentage></goalPercentage> af vores daglige { $goalValue } mål for validering!
contribute-more = Klar til at lave { $count } mere?
record-cta = Start optagelse
record-instruction = { $actionType } <recordIcon></recordIcon> og læs så sætningen højt
record-stop-instruction = { $actionType }<stopIcon></stopIcon> når du er færdig
record-three-more-instruction = Tre tilbage!
record-again-instruction = Fremragende! <recordIcon></recordIcon> Optag dit næste klip
record-again-instruction2 = Fortsæt det gode arbejde, optag igen <recordIcon></recordIcon>
record-last-instruction = <recordIcon></recordIcon> Den sidste!
review-tooltip = Godkend og optag klip her efterhånden
unable-speak = Ikke mulighed for at tale lige nu
review-instruction = Godkend og optag klip igen hvis nødvendigt
record-submit-tooltip = { $actionType } indsend når du er klar
clips-uploaded = Optagelser uploaded
record-abort-title = Færdiggør optagelsen først? 
record-abort-text = Hvis du stopper nu, så mister du din fremgang
record-abort-submit = Indsend klip
record-abort-continue = Afslut optagelse
record-abort-delete = Afslut og slet klip
listen-instruction = { $actionType } <playIcon></playIcon> udtalte de sætningen nøjagtigt?
listen-again-instruction = Godt arbejde! <playIcon></playIcon> Lyt igen når du er klar
listen-3rd-time-instruction = 2 overstået <playIcon></playIcon>, fortsæt det gode arbejde!
listen-last-time-instruction = <playIcon></playIcon>Den sidste!
nothing-to-validate = Vi har ikke noget klar til at validere på dette sprog. Hjælp os med at fylde køen op!
record-button-label = Optag din stemme
share-title-new = <bold>Hjælp os</bold> med at finde flere stemmer
