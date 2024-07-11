## Dashboard

your-languages = Zure hizkuntzak
toward-next-goal = Hurrengo helbururantz
goal-reached = Helburua lortuta
clips-you-recorded = Egin dituzun grabazioak
clips-you-validated = Balioztatu dituzun grabazioak
todays-recorded-progress = Common Voicen gaurko aurrerapena egindako grabazioetan
todays-validated-progress = Common Voicen gaurko aurrerapena balioztatutako grabazioetan
stats = Estatistikak
awards = Sariak
you = zu
everyone = Denek
contribution-activity = Gaurko jarduera
top-contributors = Laguntzaile gogotsuenak
recorded-clips = Egindako grabazioak
validated-clips = Balioztatutako grabazioak
total-approved = Onartuak guztira
overall-accuracy = Zehaztasun orokorra
set-visibility = Ezarri nire ikusgarritasuna
visibility-overlay-note = Oharra: 'Ikusgai' ezartzen denean, ezarpen hau <profileLink>Profil web-orrian</profileLink> aldatu daiteke
show-ranking = Erakutsi nire rankinga

## Custom Goals

get-started-goals = Hasi helburuekin
create-custom-goal = Sortu helburu pertsonalizatua
goal-type = Zein motatako helburua nahi duzu ezarri?
both-speak-and-listen = Biak
both-speak-and-listen-long = Biak (hitz egin eta entzun)
daily-goal = Eguneko helburua
weekly-goal = Asteko helburua
easy-difficulty = Erraza
average-difficulty = Ertaina
difficult-difficulty = Zaila
pro-difficulty = Profesionala
lose-goal-progress-warning = Zure helburua aldatzean, orain arteko zure aurrerapena gal dezakezu.
want-to-continue = Jarraitu egin nahi duzu?
finish-editing = Editatzea amaitu lehenengo?
lose-changes-warning = Orain utziz gero zure aldaketak galduko dituzu
build-custom-goal = Sortu helburu pertsonalizatua
help-reach-hours-pluralized =
    Lagundu{ NUMBER($hours) ->
        [one] { $hours } ordu
       *[other] { $hours } ordu
    } lortzen { $language } hizkuntzan helburu pertsonal batekin
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Lagundu Common Voice-ri { $hours } ordu lortzen hizkuntza batean helburu pertsonal batekin
       *[other] Lagundu Common Voice-ri { $hours } ordu lortzen hizkuntza batean helburu pertsonal batekin
    }
set-a-goal = Ezarri helburu bat
cant-decide = Ezin duzu erabaki?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] ordu { $totalHours } lorgarria da hilabete { $periodMonths }ez pertsona { $people }ek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] ordu { $totalHours } lorgarria da hilabete { $periodMonths }ez pertsona { $people }ek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] ordu { $totalHours } lorgarria da hilabete { $periodMonths }ez { $people } pertsonek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] ordu { $totalHours } lorgarria da hilabete { $periodMonths }ez { $people } pertsonek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] ordu { $totalHours } lorgarria da { $periodMonths } hilabetez pertsona { $people }ek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] ordu { $totalHours } lorgarria da { $periodMonths } hilabetez pertsona { $people }ek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] ordu { $totalHours } lorgarria da { $periodMonths } hilabetez { $people } pertsonek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] ordu { $totalHours } lorgarria da { $periodMonths } hilabetez { $people } pertsonek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ordu lorgarria da hilabete { $periodMonths }ez pertsona { $people }ek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] { $totalHours } ordu lorgarria da hilabete { $periodMonths }ez pertsona { $people }ek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ordu lorgarria da hilabete { $periodMonths }ez { $people } pertsonek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] { $totalHours } ordu lorgarria da hilabete { $periodMonths }ez { $people } pertsonek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ordu lorgarria da { $periodMonths } hilabetez pertsona { $people }ek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] { $totalHours } ordu lorgarria da { $periodMonths } hilabetez pertsona { $people }ek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ordu lorgarria da { $periodMonths } hilabetez { $people } pertsonek grabazio { $clipsPerDay } egiten badu egunero.
                               *[other] { $totalHours } ordu lorgarria da { $periodMonths } hilabetez { $people } pertsonek { $clipsPerDay } grabazio egiten badituzte egunero.
                            }
                    }
            }
    }
how-many-per-day = Primeran! Zenbat grabazio egunean?
how-many-a-week = Primeran! Zenbat grabazio astean?
which-goal-type = Hitz egin, entzun edo biak egin nahi dituzu?
receiving-emails-info =
    Common Voice-ri buruzko helburuen abisuak, nire aurrerapenaren
    eguneraketak eta buletinak posta elektroniko bidez jasotzeko aukera ezarrita duzu
not-receiving-emails-info =
    Common Voice-ri buruzko helburuen abisuak, nire aurrerapenaren
    eguneraketak eta buletinak posta elektroniko bidez jasotzeko aukera <bold>EZ</bold> duzu ezarrita
n-clips-pluralized =
    { NUMBER($count) ->
        [one] Grabazio { $count }
       *[other] { $count } grabazio
    }
help-share-goal = Lagundu ahots gehiago lortzen, partekatu zure helburua
confirm-goal = Berretsi helburua
goal-interval-weekly = Astero
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Partekatu zure { $type } motako { $count } grabazio egunero lortzeko helburua
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Partekatu zure { $type } motako { $count } grabazio astero lortzeko helburua
share-goal-type-speak = Hitz egiten
share-goal-type-listen = Entzuten
share-goal-type-both = Hitz egiten eta entzuten
# LINK will be replaced with the current URL
goal-share-text = Helburu pertsonal bat sortu berri dut #CommonVoice-ri ahotsa emateko -- zatoz nirekin eta lagundu makinei erakusten benetako pertsonek nola hitz egiten duten { $link }
weekly-goal-created = Zure asteroko helburua sortu da
daily-goal-created = Zure eguneroko helburua sortu da
track-progress = Jarraitu aurrerapena hemen eta zure estatistiken web-orrian.
return-to-edit-goal = Itzul zaitez hona zure helburua noiznahi aldatzeko.
share-goal = Partekatu nire helburua

## Goals

streaks = Haizekadak
days =
    { $count ->
        [one] egun
       *[other] egun
    }
recordings =
    { $count ->
        [one] grabazio
       *[other] grabazio
    }
validations =
    { $count ->
        [one] baliozkotze
       *[other] baliozkotze
    }
