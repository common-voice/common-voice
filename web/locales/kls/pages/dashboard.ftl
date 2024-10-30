## Dashboard

your-languages = Tay zuban
toward-next-goal = warek jaigas pishtaw
goal-reached = Nishan una zalik
clips-you-recorded = Tay recard  kada che'lak
clips-you-validated = Tay sahi kada che'lak
todays-recorded-progress = Onjao sawin awaz  recard an thara hin day
todays-validated-progress = onjaw sawin awazas tezi aa thara che'lak hin day
stats = Jonel
awards = Silah
you = Tu
everyone = saw
contribution-activity = phazikas krom
top-contributors = Ghona phazaw
recorded-clips = Recard che'lak
validated-clips = Ujak clips( Video, Che'lak)
total-approved = Saw kai kabul karik
overall-accuracy = Emiti ujak
set-visibility = Jonaikas tharika
visibility-explainer = shia settings tay saw pashikas phon pashawaw kabu kariu. Lawai pe ashis haw, taraki private hiu. esa matlab shia ki, tay istimal as Nom, tharaki, tara phon pashawni board una ne pashel. shama Note kari ki ama phon pahawni board refresh(geri ari) haw, takriban ek milat' una warek hiu, tabdil hiu
visibility-overlay-note = Khial: (Note): jab pashikas, (visible), ari haw, shemi setting, profile page una pay tabdil kari
show-ranking = My Nishan pashai

## Custom Goals

get-started-goals = Shurukh kari, kawaki zale'li
create-custom-goal = Zali'kas bati, nisha sawzai
goal-type = Khe'n nishan, ya o goal sawza's day?
both-speak-and-listen = Awdu
both-speak-and-listen-long = Dawdu (Mon dek ze ko'n' karik)
daily-goal = Har aduaw Goal
weekly-goal = Haftawar goal
easy-difficulty = Asan
average-difficulty = Tichak
difficult-difficulty = Mishkil/geran
pro-difficulty = Tez
lose-goal-progress-warning = Zalikas nishan pe warek kay newishiman ai haw, kia ki krom kai as shate, wanago d'um hin
want-to-continue = Karik khojis day e?
finish-editing = Awel warek kay kari khulai?
lose-changes-warning = Shonja pe ahisti haw, kia ki tabdili kay as, te d'um hin
build-custom-goal = Tay mi marzi una warek nishan kari
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Ek
       *[other] Warek
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Ek
       *[other] warek
    }
set-a-goal = Nishan, Goal sawzai
cant-decide = Faisala ne ari?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { "" }
                               *[other] { "" }
                            }
                    }
            }
    }
how-many-per-day = Bo prus't! kimon clib, (video che'lak) har adua?
how-many-a-week = Bo prus't! kimon clips (video che'lak) ek haftan
which-goal-type = Tu mon dek, ya o ko'n' karik khojis day e, yao awdu?
receiving-emails-info = Email zalik, mushkilat, taklif, yat karikas, no'a min, khabar en sawin awaz una
not-receiving-emails-info = A bo khoshan thi kia ki yat dihani shian, taraki shian, no'a mon, khabar, asta pe shian haw sawin awaz
n-clips-pluralized =
    { NUMBER($count) ->
        [one] Ek
       *[other] warek
    }
help-share-goal = Homa madat kara, waregas awaz khojikas bati, tan goal phazi
confirm-goal = tasali Goal
goal-interval-weekly = Haftan
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Phazi tan har aduaw video che'lak an goal
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = tan video (che'lak) goal haftan phazi
share-goal-type-speak = Mondr dek
share-goal-type-listen = Ko'n' kari
share-goal-type-both = Mondr dek ze Ko'n' karik
# LINK will be replaced with the current URL
goal-share-text = A shonja tan mi goalas awaz sawai am, tan awaz mich dek bahas, #sawin awaz may som nisi madat kari che'c'aikas bati, machine una, khe'n sahi moch mon den day
weekly-goal-created = Tay haftawar goal(target) sawuz hawaw
daily-goal-created = Tay har aduaw goal sawuz hawaw
track-progress = Khoji tan tharaki, tay shuruk page una
return-to-edit-goal = Oishtyak e, tan goal una kay asta tabdil karis
share-goal = My goal phazi

## Goals

streaks = Gona nishan
days =
    { $count ->
        [one] Aduaw
       *[other] bo wat
    }
recordings =
    { $count ->
        [one] Recard
       *[other] recard kada
    }
validations =
    { $count ->
        [one] sahi karik
       *[other] sahi kay seda karik
    }
