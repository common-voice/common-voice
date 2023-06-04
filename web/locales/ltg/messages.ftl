## General


# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

pl = Pūļu
ps = Puštu
pt = Portugaļu

# [/]


## Layout


## Home Page

today = Šudiņ

## Account Benefits


## What's public


## Speak & Listen Shortcuts


## Listen Shortcuts


## Speak Shortcuts

request-language-button = Pīpraseit volūdys

## ProjectStatus

english = Angļu volūda

## ProfileForm

profile-form-username =
    .label = Lītuotuoja vuords
profile-form-native-language =
    .label = Dzymtuo volūda
profile-form-additional-language =
    .label = Papyldu volūda
profile-form-language =
    .label = Volūda
profile-form-variant =
    .label = Kurā { $language } volūdys paveidā jius runojit?
profile-form-variant-default-value = Variants nav izavālāts
profile-form-accent =
    .label = Akcents
profile-form-age =
    .label = Vacums
profile-form-gender-2 =
    .label = Dzymums
profile-form-submit-save = Saglobuot
profile-form-submit-saved = Saglobuots
male = Veirīts
female = Sīvīte
# Gender
other = Cyts
why-profile-title = Deļkuo taiseit profilu?

## Profile - Email


## Profile - Email


## FAQ

faq-is-account-public-q = Voi muna konta informaceja ir publiski daīmama?

## ABOUT US


## How does it work section

about-nav-why-common-voice = Deļkuo?
about-nav-how-it-works = Kai?
about-nav-partners = Partneri
about-nav-get-involved = Īsasaisti
about-nav-how-it-works-2 = Kai dorbojās Common Voice?
about-nav-playbook = Izzynoj, kai pīsadaleit

## Community Playbook Content
## What is a language

about-playbook-what-is-language = Kas ir volūda Common Voice sistemā?

## How do I add a language

about-playbook-how-add-language-collecting-sentences-heading = Teikumu apkūpuošona

## How does localization work


## How to add sentences


## How to record quality


## How to grow language

about-playbook-how-grow-language-content-2 = Nūtikšonys

## How to validate


## How to access dataset


## How are decisions made


## Glossary


## Error pages


## Data


## Datasets Page

more = Vairuok
close = Aiztaiseit
download = Lejupluodēt
dataset-version = Verseja
sha256-checksum-copied = SHA256 kontrolsumma nūkopēta!
sha256-checksum-copied-error = Naizadeve nūkopēt SHA256 kontrolsummu

## Download Modal

download-form-email =
    .label = Īvodi sovu e-postu
    .value = Paļdis, mes sasazynuosim.
download-back = Atsagrīzt pi Common Voice datu kūpys
download-no = Nā, paļdis

## Contact Modal

contact-title = Kontaktu forma
contact-form-name =
    .label = Nūsaukums
contact-form-message =
    .label = Ziņa
contact-required = *obligats

## Request Language Modal

request-language-title = Volūdys pīprasejums
request-language-form-language =
    .label = Volūda
request-language-success-title = Volūdys pīprasejums veiksmeigi īsnīgts, paļdis.

## Request Language Pages

request-language-form-email =
    .label = Tova e-posta adrese
request-language-form-info =
    .label = Informaceja par volūdu

## Languages Overview

languages-show-more = Ruodeit vaira
languages-show-less = Ruodeit mozuok
language-meter-in-progress = Progress
language-total-progress = Kūpā
language-search-input =
    .placeholder = Meklēt
language-speakers = Runuotuoji
localized = Lokalizāts
sentences = Teikumi
language-validation-hours = Stuņdis
language-validation-progress = Puorbaudis progress

## Contribution

action-click = Klikškis
action-tap = Pīsaskar
contribute = Dūt īguļdejumu
listen = Klausīs
write = Roksti
review = Puorbaudi
skip = Izlaist
shortcuts = Eisceli
clips-with-count-pluralized =
    { $count ->
        [zero] <bold>{ $count }</bold> īrokstu
        [one] { "" }
       *[other] { "" }
    }

## Contribution Nav Items


## Reporting


## Goals


## Dashboard


## Custom Goals


## Profile Delete


## Profile Download


## Landing


## DemoLayout


## Demo Datasets


## Demo Account


## Demo Contribute


## Demo Dashboard


## Validation criteria

contribution-volume-title = Skaļums

# Don't rename the following section, its contents are auto-inserted based on the name. These strings are
# automatically exported from Sentence Collector.
# [SentenceCollector]


## HEADER/FOOTER

sc-header-home = Suokums
sc-header-how-to = Padūmi
sc-header-add = Pīvīnuot
sc-header-review = Puorbaudit
sc-header-rejected = Nūraideitī teikumi
sc-header-my = Muni teikumi
sc-header-statistics = Statistika
sc-header-profile = Profils
sc-footer-discourse = Diskurss
sc-footer-report-bugs = Ziņuot par klaidom
sc-footer-translate = Tulkuot itū lopu
sc-footer-report-copyright = Ziņuot par autortīseibu problemom
sc-footer-privacy = Privatums
sc-footer-terms = Lītuošonys nūsacejumi
sc-footer-cookies = Seikdatnis

## HOME


## GENERAL


## HOW-TO


## MY SENTENCES


## REJECTED


## STATS

sc-stats-title = Statistika

## ADD

sc-submit-err-select-lang = Lyudzu, izalosit volūdu.
sc-submit-err-add-sentences = Lyudzu, davīnojit teikumus.
sc-submit-err-add-source = Lyudzu, davīnojit olūtu.
sc-submit-ph-one-per-line =
    .placeholder = Vīns teikums kotrā ryndā

## ADD LANGUAGE


## ADD SENTENCES CONFIRMATION


## LANGUAGE INFO

sc-lang-info-title-total = Kūpā
sc-lang-info-add-more = <addLink>Davīnojit teikumus!</addLink>
# Variables:
#   $validatedSentences (Number) - Number of sentences which have been approved for this language
sc-lang-info-validated =
    { $validatedSentences ->
        [0] { $validatedSentences } puorbaudeiti teikumi.
        [zero] { "" }
        [one] { "" }
       *[other] { "" }
    }
# Variables:
#   $rejectedSentences (Number) - Number of sentences which have been rejected for this language
sc-lang-info-rejected =
    { $rejectedSentences ->
        [0] { $rejectedSentences } nūraideiti teikumi.
        [zero] { "" }
        [one] { "" }
       *[other] { "" }
    }

## LOGIN

sc-login-err-failed = Dasasliegšona naizadeve
sc-login-err-try-again = Lyudzu, raugi vēļreiz.

## PROFILE

# Variables:
#   $username (String) - eMail address of the logged in user
sc-profile-title = Profils: { $username }
sc-personal-err-lang-not-found = Navarēja nūjimt volūdu: volūda nav atrosta
sc-personal-err-remove = Navarēja nūjimt volūdu
sc-personal-your-languages = Jiusu volūdys:
sc-personal-remove-button = nūjimt
# Variables:
#   $sentences (Number) - Number of sentences that were added by the currently logged in user for this language
sc-personal-added-by-you = Jius dalykot { $sentences }

## REVIEW CRITERIA


## REVIEW

sc-review-title = Teikumu puorbaude
sc-review-loading = Nūteik teikumu īluode...
sc-review-form-button-reject = Nūraideit
sc-review-form-button-skip = Izlaist
sc-review-form-button-approve = Apstyprynuot
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Varit ari lītuot eisynuojumtausteņus: { sc-review-form-button-approve-shortcut }, lai apstyprynuotu, { sc-review-form-button-reject-shortcut }, lai nūraideitu, { sc-review-form-button-skip-shortcut }, lai izlaistu
sc-review-form-button-submit =
    .submitText = Pabeigt puorsavieršonu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Puorbaudeiti { $sentences } teikumi
        [zero] { "" }
        [one] { "" }
       *[other] { "" }
    }
sc-review-form-review-failure = Puorbaudis rezultatu navarēja saglobuot. Lyudzu, paraugit vēļreiz vāluok.
sc-review-link = Puorbaudit

## SETTINGS

sc-settings-title = Īstatejumi
sc-settings-ui-language = Saskarnis volūda

# [/SentenceCollector]

volume = Skaļums
reader-effects = Īrunuotuoja izrunys eipatneibys
just-unsure = Vīnkuorši naesit puorlīcynuots?
example = Pīmārs
misreadings-explanation-2 = Bīžuokuos klaidys:
misreadings-explanation-3 = Nūrauts vuorda suokums, par pīmāru, "aņ garšoj dasa".
misreadings-explanation-4 = Nūrautys vuorda beigys, par pīmāru, "beja" vītā īrunuots "bej" voi teikumā izlaists vuords "ir".
misreadings-explanation-5 = Vuordi samaineiti vītom, par pīmāru, "voi es kū varu dareit?" vītā ir īrunuots "voi es varu kū dareit?".
misreadings-explanation-6 = Tryukst vuorda beigu, deļtuo ka īroksts ir izslāgts puoruok dreiži.
misreadings-explanation-7 = Īrokstā dzieržomi vairuoki raudzejumi īraksteit vajadzeigū frazi voi puorsasaceišona.
misreadings-example-1 = Kuņdze, voi es varu kū dareit?
misreadings-example-2 = Kuņdze, voi varu kū dareit?
misreadings-example-3 = Kuņdze, voi es varu koč kū dareit?
misreadings-example-4 = Bitis ir darbeigi kukaini.
misreadings-tip-1 = [pagaiss vuords “es”]
background-noise-example-1 = Senejuo laikmeta dinozauri.
background-noise-example-2 = [Škauda] Senejuo laikmeta [kuoss] dinozauri.
background-noise-example-3 = Senejuo laikmeta dino [dzierdams krakškis].
background-noise-example-4 = [klusums] senejuo laikmeta [dzierdams krakškis] -zauri.
background-noise-tip-1 = [Skaitejumu puortrauc fona trūksnis]
background-noise-tip-2 = [Daļu nu teksta navar dzierdēt]
background-voices-explanation = Nalels fona trūksnis ir pījamams, tok, ka dzierdit cytu personu runojam konkretus vuordus, klips ir juonūraida. Parasti tys nūteik gadīņūs, kod tyvumā ir atstuots īslāgts televizors voi runoj cyti cylvāki.
background-voices-example-1 = Senejuo laikmeta dinozauri. [skaita vīns bolss]
background-voices-tip-1 = Voi tu ej? [soka kaids cyts]
still-have-questions = Vys vēļ ir vaicuojumi?
contact-common-voice = Sasazinojit ar Common Voice komandu
public-domain = Publiskī dati
citing-sentences = Atsauce iz teikumu olūtu
adding-sentences = Teikumu davīnuošona
reviewing-sentences = Teikumu puorbaude
citation =
    .label = Atsauce
adding-sentences-subheader-length = Garums
adding-sentences-subheader-length-explanation = Teikumim juobyut eisuokim par 15 vuordim.
adding-sentences-subheader-spelling-punctuation = Pareizraksteiba i pīturzeimis
adding-sentences-subheader-spelling-punctuation-explanation = Teikumam juobyut pareizi uzraksteitam, vuordūs navar byut drukys klaidu.
adding-sentences-subheader-punctuation = Pīturzeimis
adding-sentences-subheader-special-characters = Cytu volūdu burti
adding-sentences-subheader-offensive-content = Aizskarūšs saturs
sentence =
    .label = Teikums
citation-input-value = Jiusu teikuma olūts
citation =
    .label = Atsauce
what-can-i-add = Kaidus teikumus es varu davīnuot?
new-sentence-rule-1 = <noCopyright>Nav autortīseibu</noCopyright> īrūbežuojumu (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Muozuok par 15 vuordim
new-sentence-rule-3 = Ir gramatiski pareizi
new-sentence-rule-4 = Bez drukys voi pīturzeimu klaidu
new-sentence-rule-5 = Bez ciparu voi specialu rokstu zeimu
new-sentence-rule-6 = Bez svešu volūdu burtu
new-sentence-rule-7 = Nūruodit teikuma olūtu
new-sentence-rule-8 = Dabiski sarunvolūdys teikumi (tim juobyut vīgli īrunuojamim)
how-to-cite = Kai nūruodeit olūtu?
how-to-cite-explanation-bold = Nūruodit sātyslopys adresi voi dorba pylnu nūsaukumu.
how-to-cite-explanation = Ka itys ir jiusu izdūmuots teikums, vīnkuorši nūruodit <italicizedText>“Pošatsauce”</italicizedText>. Mums ir juozyna teikumu olūti, lai mes varātu puorbaudeit, voi tys ir publiski daīmams i iz tū naatsatīc nikaidi autortīseibu īrūbežuojumi. Papyldu informaceju par atsaucem veritēs myusu <guidelinesLink>vadlineju lopā</guidelinesLink>.
guidelines = Vadlinejis
contact-us = Sasazynuot
add-sentence-success = Savuokts 1 teikums
add-sentence-error = Klaida davīnojūt teikumu
required-field = Lyudzu, aizpiļdit itū lauku.
# REVIEW PAGE
sc-review-instruction-first-part = Puorbaudi
sc-review-instruction-second-part = voi itys ir lingvistiski pareizs teikums?
sc-review-rules-title = Vai teikums atbylst vadlinejom?
sc-review-empty-state = Itūšaļt itamā volūdā nav teikumu, kū puorbaudeit.
report-sc-different-language = Napareiza volūda
report-sc-different-language-detail = Tys ir uzraksteits volūdā, kas atsaškir nu tuos, kū itūšaļt puorbaudu.
sentences-fetch-error = Īluodejūt teikumus, nūtykuse klaida
review-error = Puorsaverūt teikumu, nūtykuse klaida
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Mes veicam puors lelys izmainis
sc-redirect-page-subtitle-1 = Teikumu apkūpuošonys reiks puorīt iz Common Voice platformu. Tagad varit <writeURL>davīnuot</writeURL> i<reviewURL>puorbaudeit</reviewURL> teikumus Common Voice sistemā.
sc-redirect-page-subtitle-2 = Aizdūdit mums vaicuojumus <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> voi rokstūt <emailLink>e-postu</emailLink>.
