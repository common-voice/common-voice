## Dashboard

your-languages = የእርስዎ ቋንቋዎች
toward-next-goal = ወደ ቀጣዩ ግብ
goal-reached = ግብ ላይ ደርሷል
clips-you-recorded = የቀረጿቸው ቅንጥቦች
clips-you-validated = ያረጋገጡዋቸው ቅንጥቦች
todays-recorded-progress = የጋራ ልሳን ላይ ዛሬ የተቀረጹ ቅንጥቦች ሂደት
todays-validated-progress = የዛሬው የጋራ ልሳን ቅንጥቦች ላይ ያለው ሂደት ተረጋግጧል
stats = ስታትስቲክስ
awards = ሽልማቶች
you = እርስዎ
everyone = ሁሉም ሰው
contribution-activity = የአስተዋጽኦ እንቅስቃሴ
top-contributors = ከፍተኛ አስተዋጽዖ አበርካቾች
recorded-clips = የተቀረፁ ቅንጥቦች
validated-clips = የተረጋገጡ ቅንጥቦች
total-approved = ጠቅላላ የጸደቀ
overall-accuracy = አጠቃላይ ትክክለኛነት
set-visibility = የእኔን ታይታነት አዘጋጅ
visibility-explainer = ይህ ቅንብር የመሪዎች ሰሌዳዎን ታይታነት ይቆጣጠራል። ሲደበቅ፣ እድገትህ ግላዊ ይሆናል። ይህ ማለት የእርስዎ ምስል፣ የተጠቃሚ ስም እና እድገት በመሪዎች ሰሌዳው ላይ አይታይም። የመሪዎች ሰሌዳ እድሳት ለውጦቹን ለመሙላት ~{ $minutes } ደቂቃ እንደሚፈጅ ልብ ይበሉ።
visibility-overlay-note = ማስታወሻ፡ ወደ 'የሚታይ' ሲዋቀር ይህ ቅንብር ከ<profileLink>የመገለጫ ገጽ</profileLink> ሊቀየር ይችላል።
show-ranking = ደረጃዬን አሳይ

## Custom Goals

get-started-goals = በግብ ጀምር
create-custom-goal = ብጁ ግብ ፍጠር
goal-type = ምን ዓይነት ግብ መገንባት ይፈልጋሉ?
both-speak-and-listen = ሁለቱም
both-speak-and-listen-long = ሁለቱም (ይናገሩ እና ያዳምጡ)
daily-goal = ዕለታዊ ግብ
weekly-goal = ሳምንታዊ ግብ
easy-difficulty = ቀላል
average-difficulty = አማካይ
difficult-difficulty = አስቸጋሪ
pro-difficulty = ፕሮ
lose-goal-progress-warning = ግብዎት ላይ አርትኦት ከፈፀሙ፣ ያለዎትን ሂደት ሊያጡ ይችላሉ።
want-to-continue = መቀጠል ይፈልጋሉ?
finish-editing = መጀመሪያ አርትኦት ይጨርሱ?
lose-changes-warning = አሁን መተው ማለት ለውጦችዎን ያጣሉ ማለት ነው።
build-custom-goal = ብጁ ግብ ይገንቡ
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] ከግል ግብ ጋር በ{ $language } ውስጥ { $hours } ሰዓት ለመድረስ ያግዙ
       *[other] ከግል ግብ ጋር በ{ $language } ውስጥ { $hours } ሰዓቶችን ለመድረስ ያግዙ
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] የጋራ ልሳን ግላዊ ግብ ባለው ቋንቋ { $hours } ሰዓት እንዲደርስ ይርዱ
       *[other] የጋራ ልሳን ግላዊ ግብ ባለው ቋንቋ { $hours } ሰዓቶችን እንዲደርስ ይርዱ
    }
set-a-goal = ግብ አዘጋጅ
cant-decide = መወሰን አልቻሉም?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
            }
    }
how-many-per-day = በጣም ጥሩ! በቀን ስንት ቅንጥቦች?
how-many-a-week = በጣም ጥሩ! በሳምንት ስንት ቅንጥቦች?
which-goal-type = መናገር፣ ማዳመጥ ይፈልጋሉ ወይስ ሁለቱንም?
receiving-emails-info = እንደ የአላማ ማስታወሻ፣ ስለራሴ የለውጥ ሂደቶች እና ስለ የጋራ ልሳኖች አጫጭር ዜናዎች፤ የኢሜይል መልእክቶችን ለመቀበል ተፈቅዷል።
not-receiving-emails-info = በአሁኑ ጊዜ እንደ ግብ አስታዋሾች፣ የእኔ የመሳሰሉ ኢሜይሎችን፣ ስለ የጋራ ልሳን የሂደት ዝመናዎች እና ጋዜጣዎች <bold>እንዳይቀበሉ</bold>ተደርገዋል።
n-clips-pluralized =
    { NUMBER($count) ->
        [one] ቅንጥብ
       *[other] ቅንጥቦች
    }
help-share-goal = ተጨማሪ ድምጾችን እንድናገኝ ይርዱን፣ ግብዎን ያጋሩ
confirm-goal = ግብ ያረጋግጡ
goal-interval-weekly = ሳምንታዊ
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = የእርስዎን { $count } ቅንጥብ ዕለታዊ ግብ ለ{ $type } ያጋሩ
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = የእርስዎን { $count } ቅንጥብ ሳምንታዊ ግብ ለ{ $type } ያጋሩ
share-goal-type-speak = በመናገር ላይ
share-goal-type-listen = በማድመጥ ላይ
share-goal-type-both = በመናገር እና በማዳመጥ ላይ
# LINK will be replaced with the current URL
goal-share-text = ለድምጽ ልገሳ የግል ግብ ለ #CommonVoice ፈጠሪያለሁ -- እባክዎ ተቀላቀሉኝ እና ማሽኖቹን ሰዎች እንዴት እንደሚናገሩ አስተምሩ { $link }
weekly-goal-created = ሳምንታዊ ግብዎ ተፈጥሯል።
daily-goal-created = ዕለታዊ ግብዎ ተፈጥሯል።
track-progress = ግስጋሴውን እዚህ እና በስታቲስቲክስ ገጽዎ ላይ ይከታተሉ።
return-to-edit-goal = ግብዎን በማንኛውም ጊዜ ለማርትዕ ወደዚህ ይመለሱ።
share-goal = ግቤን አጋራ።

## Goals

streaks = ጭረቶች
days =
    { $count ->
        [one] Day
       *[other] Days
    }
recordings =
    { $count ->
        [one] ቀረፃ
       *[other] ቀረፃዎች
    }
validations =
    { $count ->
        [one] ማረጋገጫ
       *[other] ማረጋገጫዎች
    }

