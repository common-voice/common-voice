## Dashboard

your-languages = toki sina
toward-next-goal = tawa wile pali sin
goal-reached = sina pini!
clips-you-recorded = sina pana e kalama pi mute ni
clips-you-validated = sina kute e kalama pi mute ni
todays-recorded-progress = tenpo suno ni la kalama awen
todays-validated-progress = tenpo suno ni la kalama awen pona
stats = pali
awards = ijo tan pali pona
you = sina
everyone = jan ale
contribution-activity = pali
top-contributors = jan pi pali suli
recorded-clips = kalama awen
validated-clips = kalama awen pona
total-approved = mute pona
overall-accuracy = pona ale
set-visibility = len ala len
visibility-explainer = nasin ni li ante e len lon lipu pi pali suli. sina len la jan ante li ken ala lukin e pali sina. ni la sitelen sina en nimi sina en pali sina li lon ala lipu pali. o lukin e ni: sina ante la lipu pali li ante lon tenpo kama { $minutes }.
visibility-overlay-note = o lukin e ni: sina len ala la sina ken ante lon <profileLink>lipu jan</profileLink>
show-ranking = o len ala e pali mute mi

## Custom Goals

get-started-goals = o pana e wile pali sina
create-custom-goal = o pana e wile pali sina
goal-type = sina wile pali e seme?
both-speak-and-listen = tu
both-speak-and-listen-long = tu (o toki, o kute)
daily-goal = wile pali pi tenpo suno ale
weekly-goal = wile pali pi tenpo suno 7 ale
easy-difficulty = pona
average-difficulty = pona ala, ike ala
difficult-difficulty = ike
pro-difficulty = ike suli
lose-goal-progress-warning = sina ante e wile pali sina la, ijo ale pi wile pali li weka tan ni.
want-to-continue = sina wile ala wile pini?
finish-editing = ante sina li pini ala. o awen pali anu seme?
lose-changes-warning = sina weka la, ante sina li weka
build-custom-goal = o wile pali mute
help-reach-hours-pluralized = wile mi la kalama pi tenpo suli { $hours } o lon { $language }. tawa ni la o pana e wile pali sina!
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
       *[other] kepeken wile pali sina la, o pali e tenpo suli { $hours } lon ilo Common Voice, lon toki.
    }
set-a-goal = o wile pali
cant-decide = sina wile anu seme?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
       *[other] jan { $people }
    } { NUMBER($periodMonths) ->
       *[other] li awen e kalama { $clipsPerDay } la,
    } { NUMBER($people) ->
       *[other] ona li ken pali e tenpo suli { $totalHours }
    } { NUMBER($clipsPerDay) ->
       *[other] lon tenpo mun { $periodMonths }.
    }
how-many-per-day = pona! tenpo suno wan la sina pali e kalama awen pi nanpa seme?
how-many-a-week = pona! tenpo esun wan la sina pali e kalama awen pi nanpa seme?
which-goal-type = sina wile toki, anu kute, anu ni tu?
receiving-emails-info = sina kama jo e lipu ni: sona pi wile pali en sona pi pali mi en ijo sin pi ilo Common Voice.
not-receiving-emails-info = sina kama jo <bold>ala</bold> e lipu ni: sona pi wile pali en sona pi pali mi en ijo sin pi ilo Common Voice.
n-clips-pluralized =
    { NUMBER($count) ->
       *[other] kalama awen { $count }
    }
help-share-goal = o alasa e jan toki, o pana e pali suli sina
confirm-goal = o pona e wile pali
goal-interval-weekly = tenpo esun
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = o pana e pali suli pi kalama awen { $count } tawa { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = o pana e kalama awen sina { $count } pi tenpo esun, tan pali { $type }
share-goal-type-speak = toki
share-goal-type-listen = kute
share-goal-type-both = toki en kute
# LINK will be replaced with the current URL
goal-share-text = mi pali e wile pali ni: mi pana e toki uta mi tawa #CommonVoice. o kama, o pana e sona toki tawa ilo. { $link }
weekly-goal-created = sina pali e wile pali pi tenpo esun ale!
daily-goal-created = sina pali e wile pali pi tenpo suno ale!
track-progress = o lukin e suli pi pali sina lon ni, lon lipu pali sina.
return-to-edit-goal = o tawa ni la sina ken ante e wile pali sina.
share-goal = o pana e wile pali

## Goals

streaks = tenpo pi kulupu pali
days =
    { $count ->
       *[other] tenpo suno
    }
recordings =
    { $count ->
       *[other] kalama awen
    }
validations =
    { $count ->
       *[other] kalama awen pona
    }
