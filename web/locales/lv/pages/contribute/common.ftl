## Contribution

action-click = Klikšķini
action-tap = Pieskaries
## Languages

contribute = Piedalies
review = Pārbaudi
skip = Izlaist
shortcuts = Īsceļi
clips-with-count-pluralized =
    { $count ->
        [zero] <bold>{ $count }</bold> ieraksts
        [one] <bold>{ $count }</bold> ieraksti
       *[other] <bold>{ $count }</bold> ierakstu
    }
goal-help-recording = Jūs esat palīdzējuši sasniegt <goalPercentage> </goalPercentage> no mūsu mērķa - { $goalValue } ierakstu dienā!
goal-help-validation = Jūs esat palīdzējuši sasniegt <goalPercentage> </goalPercentage> no mūsu mērķa - { $goalValue } pārbaudīto ierakstu dienā!
contribute-more =
    { $count ->
        [zero] Vai esat gatavi vēl { $count }?
        [one] Vai esat gatavi vēl { $count }?
       *[other] Vai esat gatavi vēl { $count }?
    }
speak-empty-state = Mums ir beigušies teikumi, ko ierakstīt šajā valodā...
speak-empty-state-cta = Pievienojiet teikumus
speak-loading-error =
    Mēs nevarējām iegūt nevienu teikumu, lai jūs varētu ierunāt.
    Lūdzu, mēģiniet vēlreiz nedaudz vēlāk.
record-button-label = Ierakstiet savu balsi
share-title-new = <bold> Palīdziet mums </bold> atrast vairāk balsu
keep-track-profile = Sekojiet līdzi progresam, izmantojot profilu
login-to-get-started = Piesakieties vai reģistrējieties, lai sāktu
target-segment-first-card = Jūs sniedzat ieguldījumu mūsu pirmajā mērķa segmentā
target-segment-generic-card = Jūs sniedzat ieguldījumu mērķa segmentā
target-segment-first-banner = Palīdziet izveidot Common Voice pirmo mērķa segmentu { $locale } valodā
target-segment-add-voice = Pievienojiet savu balsi
target-segment-learn-more = Uzzināt vairāk

## Contribution Nav Items

contribute-voice-collection-nav-header = Balsu kolekcija
contribute-sentence-collection-nav-header = Teikumu apkopotājs

## Reporting

report = Ziņot
report-title = Iesniedziet ziņojumu
report-ask = Kādas problēmas jums rodas ar šo teikumu?
report-offensive-language = Aizvainojoša valoda
report-offensive-language-detail = Teikuma valoda ir necienīga vai aizskaroša.
report-grammar-or-spelling = Gramatiska / pareizrakstības kļūda
report-grammar-or-spelling-detail = Teikumā ir gramatiska vai pareizrakstības kļūda.
report-different-language = Nepareiza valoda
report-different-language-detail = Tas ir uzrakstīts valodā, kas atšķiras no tās, ko runāju.
report-difficult-pronounce = Grūti izrunāt
report-difficult-pronounce-detail = Tajā ir vārdi vai frāzes, kurus ir grūti lasīt vai izrunāt.
report-offensive-speech = Aizvainojoša runa
report-offensive-speech-detail = Ierakstā izmantota necienīga vai aizskaroša valoda.
report-other-comment =
    .placeholder = Komentēt
success = Veiksmīgi
continue = Turpināt
report-success = Ziņojums sekmīgi nosūtīts!

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Ierakstīt/Apturēt
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Atkārtoti ierakstīt
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Atmest pašreizējo ierakstu
shortcut-submit = Enter
shortcut-submit-label = Iesniegt ierakstus
request-language-text = Vai vēl neredzat savu valodu Common Voice projektā?
request-language-button = Pieprasīt valodu

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Atskaņot/Apturēt
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriteriji
contribution-criteria-link = Ierakstu kvalitātes kritēriji
contribution-criteria-page-title = Ieguldījuma kritēriji
contribution-criteria-page-description = Izprotiet, kam jāpievērš uzmanība, klausoties ierakstus, un ziniet kā padarīt arī savus ierakstus labākus!
contribution-for-example = piemēram
contribution-misreadings-title = Kļūdaini lasījumi
contribution-misreadings-description = Klausoties ļoti rūpīgi pārbaudiet, vai ierakstītais ir tieši tas, kas uzrakstīts; noraidiet, ja ir pat nelielas kļūdas. <br />Biežākās kļūdas ir šādas:
contribution-misreadings-description-extended-list-1 = Izlaisti vārdi, piemēram, trūkst <strong>'ja'</strong> vai <strong>'es'</strong>, piemēram, 'es esmu' vietā ierunāts tikai 'esmu'.
contribution-misreadings-description-extended-list-2 = Norautas vārdu galotnes, piemēram, <strong>'s'</strong> vārda beigās.
contribution-misreadings-description-extended-list-3 = Ierunāts vārds nepareizā locījumā.
contribution-misreadings-description-extended-list-4 = Trūkst vārda beigu, jo ieraksts ir izslēgts pārāk ātri
contribution-misreadings-description-extended-list-5 = Ierakstā dzirdami vairāki mēģinājumi ierakstīt vienu un to pašu frāzi
contribution-misreadings-example-1-title = Senā laikmeta dinozauri
contribution-misreadings-example-2-title = Senā laikmeta dinozaurs
contribution-misreadings-example-2-explanation = [Jābūt ‘dinozauri’]
contribution-misreadings-example-3-title = Senā laikmeta dinozaur-
contribution-misreadings-example-3-explanation = [Ieraksts pārtraukts pirms pēdējā vārda beigām]
contribution-misreadings-example-4-title = Senā laikmeta dinozauri. Jā.
contribution-misreadings-example-4-explanation = [Ir ierakstīts vairāk nekā bija rakstīts]
contribution-misreadings-example-5-title = Jā, es esmu liels kafijas mīļotājs
contribution-misreadings-example-6-title = Jā, esmu liels kafijas mīļotājs
contribution-misreadings-example-6-explanation = [Jābūt “es esmu”]
contribution-misreadings-example-7-title = Ja, es esmu liels kafijas mīļotājs
contribution-misreadings-example-7-explanation = [‘Ja‘ nav tas pats kas ‘jā‘]
contribution-misreadings-example-8-title = Bites ir čakli kukaiņi
contribution-misreadings-example-8-explanation = [Ierunāts nepareizs teikums]
contribution-varying-pronunciations-title = Dažādas izrunas
contribution-varying-pronunciations-description = Esiet piesardzīgi, pirms noraidāt ierakstu, pamatojoties uz to, ka lasītājs ir nepareizi izrunājis vārdu, ievietojis uzsvaru nepareizā vietā vai acīmredzami ignorējis jautājuma zīmi. Izrunas ir dažādas un dažas no tām jūs, iespējams, ikdienā nedzirdat sev apkārt. Novērtējiet to, ka cilvēki var runāt citādi nekā jūs.
contribution-varying-pronunciations-description-extended = No otras puses, ja izruna ir nepareiza vai kļūdaina, noraidiet ierakstu. Ja neesat pārliecināti, izmantojiet izlaišanas pogu.
contribution-varying-pronunciations-example-1-title = Man garšo desa.
contribution-varying-pronunciations-example-1-explanation = [‘desa’ ir pareizi ierunāta neatkarīgi no tā vai dažādos akcentos tiek lietots platais vai šaurais e]
contribution-varying-pronunciations-example-2-title = Viņa roka bija pacelta.
contribution-varying-pronunciations-example-2-explanation = [‘bija’ ir jāizrunā ar dzirdamu a burtu beigās, ja dzirdat tikai ‘bij’, ierunāts nepareizi]
contribution-background-noise-title = Fona troksnis
contribution-background-noise-description = Mēs vēlamies, lai mašīnmācīšanās algoritmi spētu apstrādāt dažādus fona trokšņus, un tiek pieņemti pat salīdzinoši skaļi trokšņi, ja tie netraucē dzirdēt visu tekstu. Klusa fona mūzika ir ok; mūzika, kas traucē skaidri sadzirdēt katru vārdu, nav ok.
contribution-background-noise-description-extended = Ja ieraksts raustās vai tajā ir sprakšķi, noraidiet, ja vien joprojām nav pilnībā dzirdams viss teksts.
contribution-background-noise-example-1-fixed-title = <strong>[Šķaudīšana]</strong>Triasa laikmeta <strong>[klepus]</strong> milzu dinozauri.
contribution-background-noise-example-2-fixed-title = Triasa laikmeta <strong>[klepus]</strong> milzu dinozauri.
contribution-background-noise-example-2-explanation = [Daļu no teksta nevar dzirdēt]
contribution-background-noise-example-3-fixed-title = <strong>[Čerkstoņa]</strong>-iasa laikmeta milzu dinozauri <strong>[čerkstoņa]</strong>.
contribution-background-voices-title = Balsis fonā
contribution-background-voices-description = Klusa murmināšana fonā ir pieņemama, taču mēs nevēlamies papildu balsis, kas varētu traucēt algoritmam pareizi noteikt vārdus, kas nav rakstītajā tekstā. Ja dzirdat vārdus, kas nav rakstīti tekstā, ieraksts ir jānoraida. Parasti tas notiek tad, ja ir atstāts ieslēgts televizors vai tuvumā notiek saruna.
contribution-background-voices-description-extended = Ja ieraksts raustās vai tajā ir sprakšķi, noraidiet, ja vien joprojām nav pilnībā dzirdams viss teksts.
contribution-background-voices-example-1-title = Triasa laikmeta milzu dinozauri. <strong>[lasa viena balss]</strong>
contribution-background-voices-example-1-explanation = Vai tu nāc? <strong>[saka kāds cits]</strong>
contribution-volume-title = Skaļums
contribution-volume-description = Starp lasītājiem būs dabiskas ieraksta skaļuma atšķirības. Noraidīt tikai tad, ja skaļums ir tik liels, ka ierakstā ir krakšķi vai tas pārtrūkst, vai arī, ja tas ir tik kluss, ka nevar saklausīt dzirdēt teikto bez atsauces uz rakstīto tekstu.
contribution-reader-effects-title = Ierunātāja izrunas īpatnības
contribution-reader-effects-description = Lielākā daļa ierakstu ir no cilvēkiem, kas runā savā dabiskajā balsī. Varat pieņemt nelielas atkāpes, piemēram, ja kāda frāze tiek pateikta skaļāk, klusāk vai tiek pasniegta ‘dramatiskā’ balsī. Lūdzu, noraidiet dziedātos ierakstus un tos, kas ierunāti robotiskā datora balsī.
contribution-just-unsure-title = Vienkārši neesat pārliecināti?
contribution-just-unsure-description = Ja saskaraties ar kaut ko, kas šajās vadlīnijās nav ietverts, lūdzu, balsojiet kā jums šķiet pareizi. Atcerieties, kvalitāte un precizitāte ir svarīgāka par ierakstu skaitu. Ja tiešām nevarat izlemt, izmantojiet izlaišanas pogu un pārejiet uz nākamo ierakstu.
see-more = <chevron></chevron>Rādīt vairāk
see-less = <chevron></chevron>Rādīt mazāk

