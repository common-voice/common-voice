## Dashboard

your-languages = Gjuhët Tuaja
toward-next-goal = Drejt objektivit të ardhshëm
goal-reached = U arrit objektivi
clips-you-recorded = Copëza Që Keni Incizuar
clips-you-validated = Copëza Që Keni Vleftësuar
todays-recorded-progress = Ecuria e sotme për copëza Common Voice të incizuara
todays-validated-progress = Ecuria e sotme për copëza Common Voice të vlerësuara
stats = Statistika
awards = Çmime
you = Ju
everyone = Kushdo
contribution-activity = Veprimtari Kontributi
top-contributors = Pjesëmarrësit Kryesues
recorded-clips = Copëza të Incizuara
validated-clips = Copëza të Vlerësuara
total-approved = Të miratuara Gjithsej
overall-accuracy = Saktësia Në Përgjithësi
set-visibility = Cakto dukshmërinë time
visibility-explainer = Ky rregullim ujdis dukshmërinë e tabelës tuaj. Kur është e fshehur, ecuria juaj do të jetë private. Kjo do të thotë se figura juaj, emri i përdoruesit dhe ecuria nuk do të shfaqen te tabela. Kni parasysh se rifreskimi i tabelës do ~{ $minutes }min që të shfaqen ndryshimet.
visibility-overlay-note = Shënim: Kur caktohet si 'E dukshme', ky rregullim mund të ndryshohet që prej <profileLink>faqes së Profilit</profileLink>
show-ranking = Shfaq renditjen time

## Custom Goals

get-started-goals = Filloni me objektiva
create-custom-goal = Krijoni një Objektiv Vetjak
goal-type = Ç’lloj objektivi doni të krijoni?
both-speak-and-listen = Të dy
both-speak-and-listen-long = Të dy (Folje dhe Dëgjim)
daily-goal = Objektiv Ditor
weekly-goal = Objektiv Javor
easy-difficulty = I lehtë
average-difficulty = Mesatar
difficult-difficulty = I Vështirë
pro-difficulty = Pro
lose-goal-progress-warning = Duke përpunuar objektivin tuaj, mund të humbni ecurinë e deritanishme.
want-to-continue = Doni të vazhdohet?
finish-editing = Të përfundohet përpunimi së pari?
lose-changes-warning = Largimi tani do të thotë se do të humbni ndryshimet tuaja
build-custom-goal = krijoni një objektiv vetjak
help-reach-hours-pluralized =
    Ndihmonani të arrijmë{ NUMBER($hours) ->
        [one] { $hours } orë
       *[other] { $hours } orë
    } në { $language }, përmes një objektivi personal
help-reach-hours-general-pluralized =
    Ndihmojeni Common Voice-in të arrijë{ NUMBER($hours) ->
        [one] { $hours } orë
       *[other] { $hours } orë
    } për një gjuhë, përmes një objektivi personal.
set-a-goal = Caktoni një objektiv
cant-decide = S’vendosni dot?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } orë
       *[other] { $totalHours } orë
    } mund të plotësohen në thjesht{ NUMBER($periodMonths) ->
        [one] { $periodMonths } muaj
       *[other] { $periodMonths } muaj
    } nëse{ NUMBER($people) ->
        [one] { $people } person
       *[other] { $people } vetë
    } incizojnë { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } copë
       *[other] { $clipsPerDay } copa
    } në ditë.
how-many-per-day = Bukur! Sa copëza në ditë?
how-many-a-week = Bukur! Sa copëza në javë?
which-goal-type = Doni të Flisni, të Dëgjoni apo të dyja bashkë?
receiving-emails-info = Keni caktuar të merrni email-e të tillë si kujtues objektivash, përditësime rreth ecurisë tuaj dhe buletine mbi Common Voice-in.
not-receiving-emails-info = Keni caktuar të <bold>MOS</bold> merrni email-e të tillë si kujtues objektivash, përditësime rreth ecurisë tuaj dhe buletine mbi Common Voice-in.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } copëz
       *[other] { $count } copëza
    }
help-share-goal = Ndihmonani të gjejmë më shumë zëra, ndani me të tjerët objektivin tuaj
confirm-goal = Ripohojeni Objektivin
goal-interval-weekly = Në javë
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Ndajeni me të tjerët Objektivin tuaj të { $count } Copëzash Në Ditë për { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Ndajeni me të tjerët Objektivin tuaj të { $count } Copëzash Në Javë për { $type }
share-goal-type-speak = Folje
share-goal-type-listen = Dëgjim
share-goal-type-both = Folje dhe Dëgjim
# LINK will be replaced with the current URL
goal-share-text = Sapo krijova një objektiv personal për dhurim zëri te #CommonVoice -- ejani me mua dhe ndihmoni t’u mësohet makinave se si flasin njerëz të njëmendtë { $link }
weekly-goal-created = Objektivi juaj javor u krijua
daily-goal-created = Objektivi juaj ditor u krijua
track-progress = Ndiqeni ecurinë tuaj këtu dhe faqja e statistikave tuaja.
return-to-edit-goal = Kthehuni këtu, kur të doni, për të përpunuar objektivin tuaj.
share-goal = Ndaje me të tjerët objektivin tim

## Goals

days =
    { $count ->
        [one] Ditë
       *[other] Ditë
    }
recordings =
    { $count ->
        [one] Incizim
       *[other] Incizime
    }
validations =
    { $count ->
        [one] Vleftësim
       *[other] Vleftësime
    }
