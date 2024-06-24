## Dashboard

your-languages = Jūsu valodas
toward-next-goal = Ceļā uz nākamo mērķi
goal-reached = Mērķis sasniegts
clips-you-recorded = Ieraksti, kurus jūs esat ierakstījuši
clips-you-validated = Ieraksti, kurus jūs esat pārbaudījuši
todays-recorded-progress = Šodienas Common Voice progress ierakstu ierakstīšanā
todays-validated-progress = Šodienas Common Voice progress ierakstu pārbaudīšanā
stats = Statistika
awards = Apbalvojumi
you = Jūs
everyone = Citi
contribution-activity = Ieguldījumu aktivitāte
top-contributors = Aktīvākie dalībnieki
recorded-clips = Ierakstītie ieraksti
validated-clips = Pārbaudītie ieraksti
total-approved = Kopā apstiprinātie
overall-accuracy = Kopējā precizitāte
set-visibility = Iestatiet manu redzamību
visibility-explainer = Šis iestatījums kontrolē jūsu redzamību rezultātu topā. Slēpjot, jūsu progress būs privāts. Tas nozīmē, ka jūsu attēls, lietotājvārds un progress netiks parādīts rezultātu topā. Ņemiet vērā, ka uzvarētāju saraksta atsvaidzināšana prasa ~ { $minutes } minūtes.
visibility-overlay-note = Piezīme: ja tas ir iestatīts uz “Redzams”, šo iestatījumu var mainīt <profileLink> profila lapā </profileLink>.
show-ranking = Rādīt manu rangu

## Custom Goals

get-started-goals = Sāciet ar mērķiem
create-custom-goal = Izveidojiet pielāgotu mērķi
goal-type = Kādu mērķi vēlaties izveidot?
both-speak-and-listen = Abi
both-speak-and-listen-long = Abi (runāšanas un klausīšanās)
daily-goal = Dienas mērķis
weekly-goal = Nedēļas mērķis
easy-difficulty = Vienkāršais
average-difficulty = Vidējais
difficult-difficulty = Grūtais
pro-difficulty = Profesionālais
lose-goal-progress-warning = Rediģējot mērķi, jūs varat zaudēt esošo progresu.
want-to-continue = Vai vēlaties turpināt?
finish-editing = Vai vispirms pabeigt rediģēšanu?
lose-changes-warning = Ja aiziesiet tagad, jūs zaudēsit izmaiņas
build-custom-goal = Izveidojiet pielāgotu mērķi
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [zero] Palīdziet sasniegt { $hours } stundu { $language } valodā ar savu mērķi
        [one] Palīdziet sasniegt { $hours } stundas { $language } valodā ar savu mērķi
       *[other] Palīdziet sasniegt { $hours } stundas { $language } valodā ar savu mērķi
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [zero] Palīdziet sasniegt { $hours } stundas šajā valodā ar savu mērķi
        [one] Palīdziet sasniegt { $hours } stundas šajā valodā ar savu mērķi
       *[other] Palīdziet sasniegt { $hours } stundas šajā valodā ar savu mērķi
    }
set-a-goal = Izvirziet mērķi
cant-decide = Nevar izlemt?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [zero]
            { NUMBER($periodMonths) ->
                [zero]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
                [one]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
            }
        [one]
            { NUMBER($periodMonths) ->
                [zero]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
                [one]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stunda ir sasniedzama { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [zero]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
                [one]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnesī, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [zero]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēku ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēks ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [zero] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                                [one] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstu dienā.
                               *[other] { $totalHours } stundas ir sasniedzamas { $periodMonths } mēnešos, ja { $people } cilvēki ierakstītu { $clipsPerDay } ierakstus dienā.
                            }
                    }
            }
    }
how-many-per-day = Lieliski! Cik ierakstu dienā?
how-many-a-week = Lieliski! Cik ierakstu nedēļā?
which-goal-type = Vai vēlaties runāt, klausīties vai abus?
receiving-emails-info = Es vēlos saņemt e-pasta ziņojumus, piemēram, mērķa atgādinājumus, progresa atjauninājumus un informatīvos biļetenus par šo projektu.
not-receiving-emails-info =
    Pašlaik jums ir iestatīts <bold> NESAŅEMT </bold> e-pastus, piemēram, atgādinājumus par mērķiem, 
    progresa atjauninājumus un informatīvos izdevumus par Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [zero] { $count } ieraksts
        [one] { $count } ieraksti
       *[other] { $count } ierakstu
    }
help-share-goal = Palīdziet mums atrast vairāk balsu, dalieties ar savu mērķi
confirm-goal = Apstipriniet mērķi
goal-interval-weekly = Reizi nedēļā
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Dalieties ar savu { $count } ierakstu ikdienas mērķi { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Dalieties ar savu { $count } ierakstu iknedēļas mērķi { $type }
share-goal-type-speak = Runāšana
share-goal-type-listen = Klausīšanās
share-goal-type-both = Runāšana un klausīšanās
# LINK will be replaced with the current URL
goal-share-text = Es tikko izveidoju savu balss talkas mērķi #CommonVoice - pievienojieties man un palīdziet iekārtām iemācīt saprast latviešu valodu { $link }
weekly-goal-created = Jūsu nedēļas mērķis ir izveidots
daily-goal-created = Jūsu ikdienas mērķis ir izveidots
track-progress = Sekojiet progresam šeit statistikas lapā.
return-to-edit-goal = Atgriezieties šeit, lai jebkurā laikā rediģētu mērķi.
share-goal = Dalies ar savu mērķi

## Goals

streaks = Sērijas
days =
    { $count ->
        [zero] Dienas
        [one] Diena
       *[other] Dienas
    }
recordings =
    { $count ->
        [zero] Ieraksti
        [one] Ieraksts
       *[other] Ieraksti
    }
validations =
    { $count ->
        [zero] Pārbaude
        [one] Pārbaudes
       *[other] Pārbaudes
    }

