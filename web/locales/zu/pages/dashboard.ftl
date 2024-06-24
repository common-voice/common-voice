## Dashboard

your-languages = Izilimi Zakho
toward-next-goal = Ibheke enhlosweni elilandelayo
goal-reached = Inhloso ifezekile
clips-you-recorded = Iziqeshana Oziqophile
clips-you-validated = Iziqeshana oziqinisekisile
todays-recorded-progress = Inqubekelaphambili yanamuhla yeCommon Voice kuziqeshana eziqoshiwe
todays-validated-progress = Inqubekelaphambili yanamuhla yeCommon Voice kuziqeshana iqinisekisiwe
stats = Izibalo
awards = Imiklomelo
you = Wena
everyone = Wonke umuntu
contribution-activity = Umsebenzi Wokufaka isandla
top-contributors = Abanikeli Abaphezulu
recorded-clips = Iziqeshana eziqoshiwe
validated-clips = Iziqeshana Eziqinisekisiwe
total-approved = Isamba Esigunyaziwe
overall-accuracy = Ukunemba Sekukonke
set-visibility = Hlela ukubonakala kwami
visibility-explainer = Le silungiselelo silawula ukubonakala kwebhodi labaphambili. Uma kufihliwe, inqubekelaphambili yakho izofihleka. Lokhu kusho ukuthi isithombe sakho, igama lakho olisebenzisayo nenqubekelaphambili yakho ngeke ivele kwibhodi labaphambili. Qaphela, ibhodi labaphambili livuselelwa ~{ $minutes }min ukuveza izinguquko.
visibility-overlay-note = Qaphela: Uma kusethelwe kokuthi 'Kuyabonakala', lesi silungiselelo singashintshwa sisuka <profileLink>Ikhasi Lephrofayela</profileLink>
show-ranking = Bonisa izinga lami

## Custom Goals

get-started-goals = Qalisa ngemigomo
create-custom-goal = Yakha umgomo wangokwezifiso
goal-type = Hlobo luni lomgomo ofuna ukulakha?
both-speak-and-listen = Kokubili
both-speak-and-listen-long = Kokubili (Khuluma futhi Ulalele)
daily-goal = Inhloso Yansuku Zonke
weekly-goal = Injongo Yamaviki Onke
easy-difficulty = Kulula
average-difficulty = Okulingene
difficult-difficulty = Kunzima
pro-difficulty = Chwephese
lose-goal-progress-warning = Ngokushintsha injongo yakho, ungase ulahlekelwe inqubekelaphambili okukhona.
want-to-continue = Ufuna ukuqhubeka?
finish-editing = Qedela ukuhlela kuqala?
lose-changes-warning = Ukuhamba manje kusho ukuthi uzolahlekelwa izinguquko zakho
build-custom-goal = Yakha umgomo wangokwezifiso
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Siza kufinyelele kwi { $hours } hora { $language } nenjongo womuntu siqu
       *[other] Siza kufinyelele ku { $hours } mahora { $language } nenjongo womuntu siqu
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Siza iCommon Voice ifinyelele { $hours } ihora ngolimi olunomgomo womuntu siqu
       *[other] Siza iCommon Voice ifinyelele { $hours } amahora ngolimi olunomgomo womuntu siqu
    }
set-a-goal = Zibekele umgomo
cant-decide = Awukwazi ukuthatha isinqumo
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } ihora lifinyeleleka esikhathini esingaphezudlwana nje kuka
       *[other] { $totalHours } amahora ifinyeleleka esikhathini esingaphezudlwana kuka
    }{ NUMBER($periodMonths) ->
        [one] { $periodMonths } ​​inyanga uma
       *[other] { $periodMonths } ​​izinyanga uma
    } { NUMBER($people) ->
        [one] { $people } umuntu orekhodayo
       *[other] abantu abangu-{ $people } abarekhodayo
    } { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } isiqeshana ngosuku.
       *[other] iziqeshana ezingu-{ $clipsPerDay } ngosuku.
    }
how-many-per-day = Kuhle! Zingaki iziqeshana ngosuku?
how-many-a-week = Kuhle! Zingaki iziqeshana ngeviki?
which-goal-type = Uyafuna Ukukhuluma, Ukulalela noma kokubili?
receiving-emails-info =
    Okwamanje umiselwe ukuthola ama-imeyili afana nezikhumbuzi zegoli, 
    izibuyekezo zenqubekelaphambili zami kanye nezincwadi zezindaba mayelana ne-Common Voice
not-receiving-emails-info = Okwamanje usethelwe <bold>CHA</bold> ukuthola ama-imeyili afana nezikhumbuzi zegoli, mina izibuyekezo zenqubekelaphambili kanye nezincwadi zezindaba mayelana ne-Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } isiqeshana
       *[other] { $count } iziqeshana
    }
help-share-goal = Sisize sithole amazwi engeziwe, wabelane ngenjongo yakho
confirm-goal = Qinisekisa Inhloso
goal-interval-weekly = Njalo ngeviki
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Yabelana nge-{ $count } Inhloso yakho Yansuku Zonke Yeziqeshana we-{ $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Yabelana nge-{ $count } Inhloso yakho Yamaviki Onke Yeziqeshana we-{ $type }
share-goal-type-speak = Ukukhuluma
share-goal-type-listen = Ukulalela
share-goal-type-both = Ukukhuluma Nokulalela
# LINK will be replaced with the current URL
goal-share-text = Ngisanda kwakheka umgomo womuntu siqu wokunikela ngezwi ku-#CommonVoice -- ngijoyine futhi usize ukufundisa imishini ukuthi abantu bangempela bakhuluma kanjani { $link }
weekly-goal-created = Injongo yakho yeviki idaliwe
daily-goal-created = Injongo yakho yansuku zonke isiyakhiwe
track-progress = Landela inqubekelaphambili yakho la nasekhasini lakho lama-stat.
return-to-edit-goal = Buyela lapha ukuze ushintshe injongo yakho noma nini.
share-goal = Yabelana ngomgomo wami

## Goals

streaks = Ama-streak
days =
    { $count ->
        [one] Usuku
       *[other] Izinsuku
    }
recordings =
    { $count ->
        [one] Okuqoshiwe
       *[other] Okuqoshiwe
    }
validations =
    { $count ->
        [one] Isiqinisekiso
       *[other] Iziqinisekiso
    }

