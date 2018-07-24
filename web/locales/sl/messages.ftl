## General

yes-receive-emails = Da, pošiljajte mi elektronska sporočila. Rad/a bi bil/a obveščen/a o novostih v projektu Common Voice.
stayintouch = Pri Mozilli gradimo skupnost okrog glasovne tehnologije. Z vami bi radi ostali v stiku za obveščanje o novostih, novih virih podatkov in izvedeli več o tem, kako podatke uporabljate.
privacy-info = Obljubimo, da bomo z vašimi podatki ravnali skrbno. Preberite več v našem <privacyLink>obvestilu o zasebnosti</privacyLink>.
return-to-cv = Nazaj na Common Voice
email-input =
    .label = Elektronski naslov
submit-form-action = Pošlji
loading = Nalaganje …

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

an = aragonščina
ar = arabščina
as = asamščina
ast = asturijščina
az = azerbajdžanščina
bn = bengalščina
br = bretonščina
ca = katalonščina
cnh = Hakha Chin
cs = češčina
cv = čuvaščina
cy = valižanščina
da = danščina
de = nemščina
dsb = dolnja lužiška srbščina
el = grščina
en = angleščina
eo = esperanto
es = španščina
et = estonščina
fi = finščina
fo = ferščina
fr = francoščina
fy-NL = frizijščina
ga-IE = irščina
he = hebrejščina
hsb = gornja lužiška srbščina
hu = madžarščina
ia = interlingva
id = indonezijščina
is = islandščina
it = italijanščina
ja = japonščina
ka = gruzinščina
kab = kabilščina
kk = kazaščina
ko = korejščina
kpv = komijščina
kw = kornijščina
ky = kirgiščina
mk = makedonščina
myv = erzjanščina
nb-NO = norveščina (bokmål)
ne-NP = nepalščina
nl = nizozemščina
nn-NO = norveščina (nynorsk)
or = odijščina
pl = poljščina
pt-BR = portugalščina (Brazilija)
rm = retoromanščina
ro = romunščina
ru = ruščina
sah = jakutščina
sk = slovaščina
sl = slovenščina
sq = albanščina
sr = srbščina
sv-SE = švedščina
ta = tamilščina
te = teluščina
th = tajščina
tr = turščina
tt = tatarščina
uk = ukrajinščina
ur = urdujščina
uz = uzbeščina
zh-CN = kitajščina (Kitajska)
zh-HK = kitajščina (Hong Kong)
zh-TW = kitajščina (Tajvan)

# [/]


## Layout

speak = Govorite
speak-now = Začnite govoriti
datasets = Nabori podatkov
languages = Jeziki
profile = Profil
help = Pomoč
contact = Kontakt
privacy = Zasebnost
terms = Pogoji
cookies = Piškotki
faq = Pogosta vprašanja
content-license-text = Vsebina je na voljo pod <licenseLink>licenco Creative Commons</licenseLink>
share-title = Pomagajte nam poiskati druge, ki bi prispevali svoj glas!
share-text = Pomagaj stroje naučiti, kako govorijo resnični ljudje. Prispevaj svoj glas na { $link }
link-copied = Povezava kopirana
back-top = Nazaj na vrh
contribution-banner-text = Pravkar smo omogočili novo izkušnjo sodelovanja
contribution-banner-button = Razglejte se
report-bugs-link = Pomagajte prijaviti hrošče

## Home Page

home-title = Projekt Common Voice je iniciativa Mozille, ki želi pomagati naučiti stroje, kako ljudje govorijo.
home-cta = Spregovori, prispevaj tukaj!
wall-of-text-start = Govor je naraven, govor je človeški. Zato navdušeno ustvarjamo uporabno govorno tehnologijo. Da lahko ustvarimo govorne sisteme, potrebujemo ogromne količine govornih podatkov.
wall-of-text-more-mobile = Večina podatkov, ki jih uporabljajo velika podjetja, ni na voljo vsem ljudem. Menimo, da to zavira inovacije. Projekt Common Voice smo zagnali, ker želimo, da je prepoznavanje govora dostopno vsakomur.
wall-of-text-more-desktop =
    Zdaj lahko prispevate svoj glas in nam pomagate zgraditi odprtokodno govorno bazo, ki jo bo lahko kdorkoli uporabil za izdelavo inovativnih aplikacij za naprave in splet.<lineBreak></lineBreak>
    Preberite stavek in pomagajte strojem pri učenju človeškega govora. Preglejte delo ostalih sodelavcev in izboljšajte kakovost. Tako enostavno je!
show-wall-of-text = Več
help-us-title = Pomagaj nam potrditi stavke!
help-us-explain = Pritisni predvajaj in poslušaj. Ali je spodnji stavek pravilno izgovorjen?
no-clips-to-validate = Videti je, da trenutno ni posnetkov, ki bi jih lahko poslušali v tem jeziku. Pomagajte nam napraviti posnetke, ki bodo zapolnili seznam.
vote-yes = Da
vote-no = Ne
toggle-play-tooltip = Pritisnite { shortcut-play-toggle } za preklop načina predavjanja

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = i

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Predvajaj/Ustavi
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = d
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = s
shortcut-record-toggle-label = Snemaj/Ustavi
request-language-text = Vaš jezik še ni vključen v Common Voice?
request-language-button = Predlagaj jezik

## ProjectStatus

status-title = Stanje projekta: oglejte si, kako daleč smo že prišli!
status-contribute = Prispevaj svoj glas
status-hours =
    { $hours ->
        [one] { $hours } preverjena ura do zdaj!
        [two] { $hours } preverjeni uri do zdaj!
        [few] { $hours } preverjene ure do zdaj!
       *[other] { $hours } preverjenih ur do zdaj!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Naslednji cilj: { $goal }
english = angleščina

## ProfileForm

profile-form-cancel = Zapri obrazec
profile-form-delete = Izbriši profil
profile-form-username =
    .label = Uporabniško ime
profile-form-language =
    .label = Jezik
profile-form-accent =
    .label = Naglas
profile-form-age =
    .label = Starost
profile-form-gender =
    .label = Spol
profile-form-submit-save = Shrani
profile-form-submit-saved = Shranjeno
profile-keep-data = Ohrani podatke
profile-delete-data = Izbriši podatke
male = Moški
female = Ženski
# Gender
other = Drugo
why-profile-title = Zakaj ustvariti profil?
why-profile-text = S tem, da dodate nekaj podatkov o sebi, bodo glasovni podatki, ki jih pošljete projektu Common Voice, uporabnejši za razpoznavo govora, saj se lahko uporabijo za zagotavljanje večje natančnosti.
edit-profile = Uredi profil
profile-create = Ustvari profil
profile-create-success = Uspelo je, profil je ustvarjen!
profile-close = Zapri
profile-clear-modal = Izbris vaših profilnih podatkov pomeni, da vaši demografski podatki ne bodo dostopni ob vaših posnetkih v projektu Common Voice. 
profile-explanation = Sledite svojemu napredku s pomočjo profila in nam pomagajte narediti naše zvočne podatke natančnejše.

## FAQ

faq-title = Pogosta vprašanja
faq-what-q = Kaj je Common Voice?
faq-what-a = Tehnologija za prepoznavo govora lahko revolucionizira način, s katerim upravljamo z napravami, toda trenutno dostopni sistemi so dragi in zaprti. Common Voice je projekt, ki bo naredil tehnologijo govorne prepoznave preprosto in dostopno vsem. Ljudje prispevajo svoje zvočne posnetke v ogromno bazo podatkov, ki bo nato omogočala hitro in enostavno učenje govorno podprtih aplikacij. Vsi govorni podatki bodo na voljo razvijalcem.
faq-important-q = Zakaj je to pomembno?
faq-important-a = Govor je naraven, govor je človeški. Je najpreprostejša in najbolj naravna oblika komunikacije. Želimo si, da bi razvijalci lahko ustvarjali čudovite stvari, od prevodov v realnem času do administrativnih pomočnikov, ki jih upravljamo z glasom. Trenutno ni na voljo dovolj javno dostopnih podatkov, da bi lahko takšne aplikacije tudi zgradili. Upamo, da bo Common Voice dal razvijalcem to, kar potrebujejo za inoviranje.
faq-get-q = Kako lahko dobim podatke Common Voice?
faq-get-a = Nabor podatkov je na voljo na naši <downloadLink>strani za prenos</downloadLink> pod licenco <licenseLink>CC-0</licenseLink>.
faq-mission-q = Zakaj je Common Voice del Mozillinega poslanstva?
faq-mission-a = Mozilla se zavzema za splet, ki je odprt in dostopen vsem. Za to želimo opolnomočiti ustvarjalce spleta s pomočjo projektov, kot je Common Voice. Medtem ko se govorne tehnologije širijo preko meja nišnih aplikacij, si prizadevamo, da bi vsem uporabnikom služile enako dobro. Pri razvoju in testiranju govorne tehnologije tako vidimo potrebo po vključevanju čim več jezikov, naglasov in demografskih skupin . Mozilla se zavzema za zdrav in dinamičen internet. To želimo doseči tako, da damo novim ustvarjalcem dostop do govornih podatkov za namen gradnje novih, neobičajnih projektov. Common Voice bo javni prostodostopni vir govornih podatkov, ki bo pomagal tako ekipam Mozille, kot tudi razvijalcem po celem svetu.
faq-native-q = { $lang } ni moj materni jezik in govorim z naglasom. Vseeno želite moj govor?
faq-native-a = Da, tudi vaš glas potrebujemo! Del namena projekta Common Voice je zbrati karseda veliko naglasov, tako da bodo računalniki bolje razumeli govor <bold>vseh</bold> ljudi.
faq-firefox-q = Bo pretvorba govora v besedilo preko Common Voice v prihodnosti postala del Firefoxa?
faq-firefox-a = Common Voice ima brezmejen potencial in resnično raziskujemo možnosti govornih vmesnikov v številnih Mozillinih izdelkih, tudi v Firefoxu.
faq-quality-q = Kako kakovostni morajo biti posnetki, da bodo uporabni?
faq-quality-a = Želimo si, da bi kakovost zvočnih posnetkov odražala kakovost zvoka pri običajni uporabi programov za pretvorbo govora v besedilo. Želimo si raznolikosti. Le tako se bo algoritem za pretvorbo govora v besedilo naučil prepoznati različne situacije – govor v ozadju, hrup avtomobilov, hrup ventilatorjev – brez napak.
faq-hours-q = Zakaj je cilj 10 000 ur posnetkov?
faq-hours-a = To je približno število ur, ki jih sistem za pretvorbo govora v besedilo potrebuje za učenje.
faq-source-q = Od kod izvirajo besedila?
faq-source-a1 = Obstoječi stavki so prispevki sodelavcev ter dialogi iz scenarijev filmov v javni domeni, npr. <italic>Čudovito življenje</italic>.
faq-source-a2 = Izvorne stavke si lahko ogledate v <dataLink>mapi na GitHubu</dataLink>.

## Profile

profile-why-title = Zakaj profil?
profile-why-content = Objavljeni govorni podatki bodo s pomočjo vaših osebnih podatkov bolj uporabni pri projektu Common Voice, saj bodo uporabljeni za zagotavljanje večje natančnosti pri učenju razpoznave govora.

## NotFound

notfound-title = Ni zadetkov
notfound-content = Na žalost tega, kar iščete, ne najdemo.

## Data

data-download-button = Prenesite podatke Common Voice
data-download-yes = Da
data-download-deny = Ne
data-download-license = Licenca: <licenseLink>CC-0</licenseLink>
data-download-modal = Začel se bo prenos datoteke, velike <size>{ $size } GB</size>, nadaljujemo?
data-subtitle = Gradimo odprt in javno dostopen nabor govorjenih podatkov, ki ga bo lahko vsakdo uporabil za učenje govorno podprtih aplikacij.
data-explanatory-text = Verjamemo, da veliki in javno dostopni nabori podatkov spodbujajo inovacije in zdravo tekmovalnost pri implementaciji strojnega učenja v govorno podprtih aplikacijah. Za to si prizadevamo po celem svetu in vabimo k sodelovanju vse zainteresirane. Naš namen je, da naredimo govorno tehnologijo bolj vključujočo, da bo odražala raznolikost govorjene besede po celem svetu.
data-get-started = <speechBlogLink>Začnite s prepoznavo govora</speechBlogLink>
data-other-title = Drugi govorni nabori podatkov ...
data-other-goto = Pojdi na { $name }
data-other-download = Prenesi podatke
data-other-librispeech-description = LibriSpeech je korpus, sestavljen iz približno 1000 ur branih angleških besedil (pri 16 kHz), pridobljen iz zvočnih knjig projekta LibriVox.
data-other-ted-name = Korpus TED-LIUM
data-other-ted-description = TED-LIUM je korpus, ki ga sestavljajo zvočni posnetki predstavitev in njihovi prepisi, dostopni na spletni strani TED.com.
data-other-voxforge-description = VoxForge je bil ustanovljen za zbiranje prepisov govorov za uporabo v odprtokodnih in prosto dostopnih sistemih za prepoznavanje govora. 
data-other-tatoeba-description = Tatoeba je velika baza stavkov, prevodov in govorjenih zvočnih datotek za uporabo pri učenju jezikov. Tukaj lahko prenesete pogovorno angleščino, posneto v njihovi skupnosti.
data-bundle-button = Prenesi nabor podatkov
data-bundle-description = Podatki Common Voice in vsi zgornji govorni nabori podatkov.
license = Licenca: <licenseLink>{ $license }</licenseLink>
license-mixed = Mešana

## Record Page

record-platform-not-supported = Žal nam je, vendar vaše platforme trenutno ne podpiramo.
record-platform-not-supported-desktop = Na namiznih in prenosnih računalnikih lahko prenesete najnovejše:
record-platform-not-supported-ios = Uporabniki <bold>iOS</bold> lahko prenesejo našo brezplačno aplikacijo:
record-must-allow-microphone = Dovoliti morate dostop do mikrofona.
record-retry = Poizkusi znova
record-no-mic-found = Ni najdenega mikrofona.
record-error-too-short = Posnetek je prekratek.
record-error-too-long = Posnetek je predolg.
record-error-too-quiet = Posnetek je pretih.
record-submit-success = Uspešno posneto! Želite posneti znova?
record-help = Začnite snemati in naglas preberite zgornji stavek.
record-cancel = Prekliči ponovno snemanje
review-terms = Z uporabo Common Voice se strinjate z našimi <termsLink>pogoji</termsLink> in z <privacyLink>obvestilom o zasebnosti</privacyLink>
terms-agree = Strinjam se
terms-disagree = Ne strinjam se
review-aborted = Pošiljanje je preklicano. Želite svoje posnetke izbrisati?
review-submit-title = Poslušajte in pošljite
review-submit-msg = Hvala za posnetek!<lineBreak></lineBreak>Zdaj svoje spodnje posnetke še enkrat poslušajte in nam jih pošljite. 
review-recording = Poslušajte
review-rerecord = Posnemite ponovno
review-cancel = Prekliči pošiljanje
review-keep-recordings = Ohrani posnetke
review-delete-recordings = Izbriši moje posnetke

## Download Modal

download-title = Vaš prenos se je pričel.
download-helpus = Pomagajte nam zgraditi skupnost okoli govorne tehnologije. Ostanimo v stiku preko e-pošte. 
download-form-email =
    .label = Vpišite svoj e-poštni naslov
    .value = Hvala, ostali bomo v stiku. 
download-back = Nazaj na nabore podatkov Common Voice
download-no = Ne, hvala

## Contact Modal

contact-title = Kontaktni obrazec
contact-form-name =
    .label = Ime
contact-form-message =
    .label = Sporočilo
contact-required = *obvezno polje

## Request Language Modal

request-language-title = Predlagaj jezik
request-language-form-language =
    .label = Jezik
request-language-success-title = Predlog za jezik je bil uspešno poslan, hvala.
request-language-success-content = V kratkem se vam bomo oglasili z več informacijami o tem kako dodati vaš jezik v Common Voice. 

## Languages Overview

language-section-in-progress = V nastajanju
language-section-in-progress-description = Jezike, ki so trenutno v fazi nastajanja, naše skupnosti še pripravljajo za nadaljnje faze projekta Common Voice; napredek jezika tako odraža napredek pri prevajanju spletne strani in količino zbranih stavkov.
language-section-launched = V teku
language-section-launched-description = Za te objavljene jezike je bila spletna stran popolnoma prevedena in je zbrala dovolj stavkov za omogočanje nadaljnjega delo preko <italic>{ speak }</italic> in <italic>{ listen }</italic> .
languages-show-more = Več
languages-show-less = Manj
language-speakers = Govorcev
language-meter-in-progress = Napredek
language-total-progress = Skupaj
language-search-input =
    .placeholder = Iskanje
language-speakers = Govorcev
total-hours = Skupaj ur

## New Contribution

action-click = Kliknite
action-tap = Tapnite
contribute = Prispevaj
listen = Poslušaj
skip = Preskoči
shortcuts = Bližnjice
clips = Posnetki
goal-help-recording = Projektu Common Voice ste pomagali doseči <goalPercentage></goalPercentage> od našega dnevnega cilja, ki znaša { $goalValue } posnetkov.
goal-help-validation = Projektu Common Voice ste pomagali doseči <goalPercentage></goalPercentage> od našega dnevnega cilja, ki znaša { $goalValue } preverjenih posnetkov.
contribute-more =
    { $count ->
        [one] Ste pripravljeni narediti še enega?
        [two] Ste pripravljeni narediti še dva?
        [few] Ste pripravljeni narediti še { $count }?
       *[other] Ste pripravljeni narediti še kakšnega, npr. { $count }?
    }
record-cta = Začni snemati
record-instruction = { $actionType } <recordIcon></recordIcon> in nato naglas preberite stavek
record-stop-instruction = { $actionType }<stopIcon></stopIcon> ob zaključku
record-three-more-instruction = Še tri!
record-again-instruction = Odlično! <recordIcon></recordIcon> Posnemite naslednji posnetek
record-again-instruction2 = Odlično napredujete, začnite ponovno snemati <recordIcon></recordIcon>
record-last-instruction = <recordIcon></recordIcon> Zadnji!
review-tooltip = Tukaj lahko pregledate posnetke in jih ponovno posnamete.
unable-speak = Ali trenutno ne morete govoriti?
review-instruction = Če je potrebno, lahko posnetke pregledate in ponovno posnamete
record-submit-tooltip = { $actionType } Pošlji, ko ste pripravljeni
clips-uploaded = Posnetki naloženi
record-abort-title = Želite najprej končati s snemanjem?
record-abort-text = Ob izhodu boste izgubili svoj napredek.
record-abort-submit = Pošlji posnetke
record-abort-continue = Končaj snemanje
record-abort-delete = Izhod in brisanje posnetkov
listen-instruction = { $actionType } <playIcon></playIcon> ali je bil stavek pravilno izgovorjen?
listen-again-instruction = Odlično opravljeno!<playIcon></playIcon> Poslušajte znova, ko boste pripravljeni.
listen-3rd-time-instruction = Samo še 2, kar tako naprej! <playIcon></playIcon>
listen-last-time-instruction = <playIcon></playIcon> Še zadnji!
record-button-label = Posnemite svoj glas
share-title-new = <bold>Pomagajte nam</bold> najti več glasov
