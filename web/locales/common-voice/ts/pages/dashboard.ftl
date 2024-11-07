## Dashboard

your-languages = Tindzimi ta wena
toward-next-goal = Ku ya eka pakani leyi landzelaka
goal-reached = Pakani yi fikeleriwile
clips-you-recorded = Swiphemu Leswi U swi Rekhodeke
clips-you-validated = Swiphemu Leswi U nga swi Tiyisisa
todays-recorded-progress = Common Voice ya namuntlha yi ya emahlweni eka swiphemu leswi rhekhodiweke
todays-validated-progress = Nhluvuko wa namuntlha wa Common Voice eka swiphemu wu tiyisisiwile
stats = Tinhlayo
awards = Masagwadi
you = Wena
everyone = Un’wana ni un’wana
contribution-activity = Ntirho wa ku Hoxa xandla
top-contributors = Vahoxaxandla va le Henhla
recorded-clips = Swiphemu leswi rhekhodiweke
validated-clips = Swiphemu leswi Tiyisisiweke
total-approved = Nhlayo hinkwayo leyi pfumeleriweke
overall-accuracy = Ku pakanisa hi ku angarhela
set-visibility = Vekela ku vonakala ka mina
visibility-explainer = Xiyimiso lexi xi lawula ku vonakala ka huvo ya varhangeri ya wena. Loko u tumbetiwe, nhluvuko wa wena wu ta va wa xihundla. Leswi swi vula leswaku xifaniso xa wena, vito ra mutirhisi na nhluvuko a swi nge humeleli eka bodo ya varhangeri. Xiya leswaku ku pfuxetiwa ka huvo ya varhangeri swi teka ~{ $minutes }min ku tata ku cinca.
visibility-overlay-note = Xiya: Loko yi vekiwile eka 'Visible', xiyimiso lexi xi nga cinciwa ku suka eka <profileLink>Tluka ra xivumbeko</profileLink>
show-ranking = Kombisa xiyimo xa mina

## Custom Goals

get-started-goals = Sungula hi tipakani
create-custom-goal = Endla Pakani Ya Xihlawuhlawu
goal-type = Xana u lava ku aka pakani ya njhani?
both-speak-and-listen = Hivumbirhi
both-speak-and-listen-long = Havumbirhi bya swona (Vulavula U Yingisela)
daily-goal = Pakani ya Siku na Siku
weekly-goal = Pakani ya Vhiki na Vhiki
easy-difficulty = Olovaka
average-difficulty = Avhareji
difficult-difficulty = Tikela
pro-difficulty = Pro
lose-goal-progress-warning = Hi ku hlela pakani ya wena, u nga ha lahlekeriwa hi nhluvuko wa wena lowu nga kona.
want-to-continue = Xana u lava ku ya emahlweni?
finish-editing = Hetisa ku hlela kusungula?
lose-changes-warning = Ku famba sweswi swi vula leswaku u ta lahlekeriwa hi ku cinca ka wena
build-custom-goal = Aka pakani ya ntolovelo
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] { $hours } awara eka { $language } hi xikongomelo xa munhu hi xiyexe
       *[other] { $hours } tiawara eka { $language } hi xikongomelo xa munhu hi xiyexe
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Pfuna Common Voice Ku fikelela { $hours } awara hi ririmi leri nga na xikongomelo xa munhu hi xiyexe
       *[other] Pfuna Common Voice Ku fikelela { $hours } tiawara hi ririmi leri nga na xikongomelo xa munhu hi xiyexe
    }
set-a-goal = Vekela pakani
cant-decide = A wu swi koti ku endla xiboho?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } awara yi fikeleleka hi ku tlulanyana
       *[other] { $totalHours } tiawara ti fikeleleka hi ku tlulanyana
    } { NUMBER($periodMonths) ->
        [one] { $periodMonths } n'hweti loko
       *[other] { $periodMonths } tin’hweti loko
    } { NUMBER($people) ->
        [one] { $people } rhekhodo ya munhu
       *[other] { $people } ti rhekhodo ta vanhu
    } { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } swiphemu hi siku.
       *[other] { $clipsPerDay } swiphemu hi siku.
    }
how-many-per-day = Swikulu! Xana i swiphemu swingani hi siku?
how-many-a-week = Swikulu! Xana i swiphemu swingani  hi vhiki?
which-goal-type = Xana u lava ku Vulavula, Ku Yingisela kumbe hi vumbirhi bya swona?
receiving-emails-info =
    Sweswi u vekiwile ku amukela ti imeyili to fana na switsundzuxo swa pakani,
    swintshuxo swa nhluvuko ya mina na swiphephana swa mahungu mayelana na Common Voice.
not-receiving-emails-info = Sweswi u vekiwile leswaku<bold>U NGA</bold> amukeli ti imeyili to fana na switsundzuxo swa pakani, na swintshuxo swa nhluvuko na swiphephana swa mahungu mayelana na Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } xiphemu
       *[other] { $count } swiphemu
    }
help-share-goal = Hi pfuneni ku kuma marito yo tala, avelana pakani ya wena
confirm-goal = Tiyisisa Pakani
goal-interval-weekly = Vhiki na vhiki
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Avelana hi { $count } Xiphemu xa Pakani ya Siku na Siku ya { $type } .
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Avelana hi { $count } Xiphemu xa Pakani ya Vhiki na Vhiki ya { $type } .
share-goal-type-speak = Ku vulavula
share-goal-type-listen = Yingisela
share-goal-type-both = Ku Vulavula Ni Ku Yingisela
# LINK will be replaced with the current URL
goal-share-text = Ndza ha ku endla pakani ya munhu hi xiyexe ya munyikelo wa rito eka #CommonVoice -- famba na mina ni ku pfuna ku dyondzisa michini ndlela leyi vanhu va xiviri va vulavulaka hi yona { $link }
weekly-goal-created = Pakani ya wena ya vhiki na vhiki yi tumbuluxiwile
daily-goal-created = Pakani ya wena ya siku na siku yi tumbuluxiwile
track-progress = Landzelela nhluvuko laha na le ka tluka ra wena ra tinhlayohlayo.
return-to-edit-goal = Vuya laha ku hlela pakani ya wena nkarhi wihi na wihi.
share-goal = Avelana hi pakani ya mina

## Goals

streaks = Swirhendzevutana
days =
    { $count ->
        [one] Siku
       *[other] Masiku
    }
recordings =
    { $count ->
        [one] Ku rhekhoda
       *[other] Leswi rhekhodiweke
    }
validations =
    { $count ->
        [one] Ku tiyisisiwa
       *[other] Switiyisiso
    }
