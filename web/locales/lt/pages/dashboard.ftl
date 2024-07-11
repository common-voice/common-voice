## Dashboard

your-languages = Tavo kalbos
toward-next-goal = Link kito tikslo
goal-reached = Tikslas pasiektas
clips-you-recorded = Tavo pateikti garso įrašai
clips-you-validated = Tavo patvirtinti garso įrašai
todays-recorded-progress = Šiandienos „Common Voice“ pateiktų įrašų progresas
todays-validated-progress = Šiandienos „Common voice“ patvirtintų įrašų progresas
stats = Statistika
awards = Apdovanojimai
you = Tu
everyone = Visi
contribution-activity = Talkininkų veikla
top-contributors = Top talkininkai
recorded-clips = Pateikti įrašai
validated-clips = Patvirtinti įrašai
total-approved = Iš viso patvirtinta
overall-accuracy = Bendras tikslumas
set-visibility = Nustatyti mano matomumą
visibility-explainer = Ši parinktis kontroliuoja Tavo matomumą lyderių lentelėje. Pasirinkus „nerodyti“, Tavo pasiekimai nebus matomi kitiems. Tai reiškia, jog Tavo naudotojo vardas, pseudoportretas ir pažanga niekada nebus rodomi lyderių lentelėje. Atkreipiame dėmesį, jog lyderių lentelės atnaujinimas gali užtrukti apie { $minutes } min.
visibility-overlay-note = Pastaba: savo sprendimą galėsi bet kada pakeisti <profileLink>savo profilyje</profileLink>
show-ranking = Rodyti mano reitingą

## Custom Goals

get-started-goals = Išsikelti tikslą
create-custom-goal = Susikurk tikslą
goal-type = Kokį tikslą nori pasiekti?
both-speak-and-listen = Ir tai, ir tai
both-speak-and-listen-long = Ir kalbėti, ir klausyti
daily-goal = Dienos tikslas
weekly-goal = Savaitės tikslas
easy-difficulty = Lengva
average-difficulty = Vidutiniška
difficult-difficulty = Sunku
pro-difficulty = Pro
lose-goal-progress-warning = Keičiant išsikeltą tikslą, galima prarasti esamą pažangą.
want-to-continue = Ar nori tęsti?
finish-editing = Pirma baigti redaguoti?
lose-changes-warning = Jeigu išeisi dabar, prarasi ką tik įrašytas frazes
build-custom-goal = Susikurk savo tikslą
help-reach-hours-pluralized =
    Padėk pasiekti { NUMBER($hours) ->
        [one] { $hours } valandą
        [few] { $hours } valandas
       *[other] { $hours } valandų
    } įrašų { $language } kalba – susikurk asmeninį tikslą
help-reach-hours-general-pluralized =
    Padėk „Common Voice“ pasiekti { NUMBER($hours) ->
        [one] { $hours } valandą
        [few] { $hours } valandas
       *[other] { $hours } valandų
    } įrašų norima kalba – susikurk asmeninį tikslą
set-a-goal = Užsibrėžti tikslą
cant-decide = Negali apsispręsti?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } valandą
        [few] { $totalHours } valandas
       *[other] { $totalHours } valandų
    } galima pasiekti vos per { NUMBER($periodMonths) ->
        [one] { $periodMonths } mėnesį
        [few] { $periodMonths } menesius
       *[other] { $periodMonths } menesių
    }, { NUMBER($people) ->
        [one] { $people } asmeniui
        [few] { $people } asmenims
       *[other] { $people } asmenų
    } padarant po { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } įrašą
        [few] { $clipsPerDay } įrašus
       *[other] { $clipsPerDay } įrašų
    } per dieną.
how-many-per-day = Puiku! Kiek įrašų per dieną?
how-many-a-week = Puiku! Kiek įrašų per savaitę?
which-goal-type = Nori kalbėti, klausytis ar daryti abu?
receiving-emails-info = Šiuo metu esi pasirinkęs (-usi) gauti tikslų priminimus, savo progreso ataskaitas ir „Common Voice“ naujienlaiškius el. paštu
not-receiving-emails-info = Šiuo metu esi pasirinkęs (-usi) <bold>NEGAUTI</bold> tikslų priminimų, savo progreso ataskaitų ir „Common Voice“ naujienlaiškių el. paštu
help-share-goal = Padėk mums rasti daugiau balsų, pasidalink savo tikslu
confirm-goal = Patvirtink tikslą
goal-interval-weekly = Kas savaitę
# $type is one of share-goal-type-*
share-n-daily-contribution-goal =
    { $count ->
        [one] Pasidalink savo { $count } { $type } įrašo per dieną tikslu
        [few] Pasidalink savo { $count } { $type } įrašų per dieną tikslu
       *[other] Pasidalink savo { $count } { $type } įrašų per dieną tikslu
    }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal =
    { $count ->
        [one] Pasidalink savo { $count } { $type } įrašo per savaitę tikslu
        [few] Pasidalink savo { $count } { $type } įrašų per savaitę tikslu
       *[other] Pasidalink savo { $count } { $type } įrašų per savaitę tikslu
    }
share-goal-type-speak = Kalbėjimas
share-goal-type-listen = Klausymas
share-goal-type-both = Kalbėjimas ir klausymas
# LINK will be replaced with the current URL
goal-share-text = Aš ką tik susikūriau asmeninį tikslą pasidalinti savo balsu su #CommonVoice – prisijunk prie manęs ir padėk išmokyti kompiuterius tikrų žmonių kalbos! { $link }
weekly-goal-created = Savaitinis tikslas sukurtas
daily-goal-created = Kasdieninis tikslas sukurtas
track-progress = Stebėk pažangą čia ir savo statistikos skydelyje.
return-to-edit-goal = Bet kada gali čia grįžti ir pakeisti savo tikslus.
share-goal = Dalintis tikslu

## Goals

streaks = Serijos
days =
    { $count ->
        [one] diena
        [few] dienos
       *[other] dienų
    }
recordings =
    { $count ->
        [one] įrašas
        [few] įrašai
       *[other] įrašų
    }
validations =
    { $count ->
        [one] patikra
        [few] patikros
       *[other] patikrų
    }
