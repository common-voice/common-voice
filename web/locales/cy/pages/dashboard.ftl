## Dashboard

your-languages = Eich Ieithoedd
toward-next-goal = Ymlaen i'r targed nesaf
goal-reached = Wedi cyrraedd y nod
clips-you-recorded = Clipiau Rydych Wedi'u Recordio
clips-you-validated = Clipiau Rydych Wedi'u Dilysu
todays-recorded-progress = Cynnydd Common Voice heddiw ar glipiau wedi'u recordio
todays-validated-progress = Cynnydd Common Voice heddiw ar glipiau wedi'u dilysu
stats = Ystadegau
awards = Gwobrau
you = Chi
everyone = Pawb
contribution-activity = Gweithgaredd Cyfrannu
top-contributors = Prif Gyfrannwyr
recorded-clips = Clipiau wedi'u Recordio
validated-clips = Clipiau wedi'u Dilysu
total-approved = Cyfanswm Cymeradwy
overall-accuracy = Cywirdeb Cyffredinol
set-visibility = Gosod fy ngwelededd
visibility-explainer = Mae'r gosodiad hwn yn rheoli gwelededd eich bwrdd arwain. Pan fydd wedi ei guddio, bydd eich cynnydd yn breifat. Mae hyn yn golygu na fydd eich delwedd, enw defnyddiwr na'ch cynnydd yn ymddangos ar y bwrdd arwain. Sylwer bod adnewyddu'r bwrdd arwain yn cymryd ~ { $minutes } munud i ddangos y newidiadau.
visibility-overlay-note = Sylwer: Pan wedi ei osod i 'Gweladwy', mae modd newid y gosodiad hwn o'r <profileLink>Dudalen broffil</profileLink>
show-ranking = Dangoswch fy safle

## Custom Goals

get-started-goals = Cychwyn gyda thargedau
create-custom-goal = Creu Targed Personol
goal-type = Pa fath o darged ydych chi am ei osod?
both-speak-and-listen = Y Ddau
both-speak-and-listen-long = Y Ddau (Siarad a Gwrando)
daily-goal = Targed Dyddiol
weekly-goal = Targed Wythnosol
easy-difficulty = Hawdd
average-difficulty = Cymedrol
difficult-difficulty = Anodd
pro-difficulty = Uwch
lose-goal-progress-warning = Drwy olygu eich targed, efallai byddwch yn colli eich cynnydd presennol.
want-to-continue = Hoffech chi barhau?
finish-editing = Gorffen golygu yn gyntaf?
lose-changes-warning = Bydd gadael nawr yn golygu eich bod yn colli eich newidiadau
build-custom-goal = Adeiladu targed personol
help-reach-hours-pluralized =
    Helpu i gyrraedd { NUMBER($hours) ->
        [zero] { $hours } awr
        [one] { $hours } awr
        [two] { $hours } awr
        [few] { $hours } awr
        [many] { $hours } awr
       *[other] { $hours } awr
    } { $language } gyda tharged personol
help-reach-hours-general-pluralized =
    Helpu i gyrraedd { NUMBER($hours) ->
        [zero] { $hours } awr
        [one] { $hours } awr
        [two] { $hours } awr
        [few] { $hours } awr
        [many] { $hours } awr
       *[other] { $hours } awr
    } mewn iaith gyda tharged personol
set-a-goal = Gosod targed
cant-decide = Methu penderfynu?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [zero] { $totalHours } awr
        [one] { $totalHours } awr
        [two] { $totalHours } awr
        [few] { $totalHours } awr
        [many] { $totalHours } awr
       *[other] { $totalHours } awr
    } yn bosib mewn ychydig dros { NUMBER($periodMonths) ->
        [zero] { $periodMonths } mis
        [one] { $periodMonths } mis
        [two] { $periodMonths } fis
        [few] { $periodMonths } mis
        [many] { $periodMonths } mis
       *[other] { $periodMonths } mis
    } os fydd { NUMBER($people) ->
        [zero] { $people } person
        [one] { $people } person
        [two] { $people } berson
        [few] { $people } person
        [many] { $people } pherson
       *[other] { $people } person
    } yn recordio { NUMBER($clipsPerDay) ->
        [zero] { $clipsPerDay } clip
        [one] { $clipsPerDay } clip
        [two] { $clipsPerDay } glip
        [few] { $clipsPerDay } clip
        [many] { $clipsPerDay } chlip
       *[other] { $clipsPerDay } clip
    } bob dydd.
how-many-per-day = Gwych! Sawl clip y dydd?
how-many-a-week = Gwych! Sawl clip yr wythnos?
which-goal-type = Hoffech chi Siarad, Gwrando neu'r ddau?
receiving-emails-info = Ar hyn o bryd rydych wedi trefnu i dderbyn negeseuon e-bost i'ch atgoffa am eich targed, diweddariadau cynnydd a chylchlythyron am Common Voice
not-receiving-emails-info = Ar hyn o bryd, rydych wedi eich gosod i <bold>BEIDIO</bold> â derbyn e-byst i atgoffa am dargedau, diweddariadau cynnydd a newyddlenni am Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [zero] { $count } clip
        [one] { $count } clip
        [two] { $count } glip
        [few] { $count } clip
        [many] { $count } chlip
       *[other] { $count } clip
    }
help-share-goal = Helpwch ni i ddenu rhagor o leisiau, rhannwch eich targed
confirm-goal = Cadarnhau'r Targed
goal-interval-weekly = Wythnosol
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Rhannwch eich Targed o { $count } Clip Dyddiol  gyda { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Rhannwch eich Targed o { $count } Clip Wythnosol  gyda { $type }
share-goal-type-speak = Siarad
share-goal-type-listen = Gwrando
share-goal-type-both = Siarad a Gwrando
# LINK will be replaced with the current URL
goal-share-text = Rwyf newydd greu targed personol ar gyfer cyfrannu fy llais i #CommonVoice -- ymunwch â mi i helpu dysgu peiriannau sut mae pobl go iawn yn siarad { $link }
weekly-goal-created = Mae eich targed wythnosol wedi'i greu
daily-goal-created = Mae eich targed dyddiol wedi'i greu
track-progress = Dilyn eich cynnydd yma ac ar eich tudalen ystadegau.
return-to-edit-goal = Dewch nôl yma unrhyw bryd, i olygu eich targed
share-goal = Rhannu fy nharged

## Goals

streaks = Ymgyrchoedd
days =
    { $count ->
        [zero] Diwrnodau
        [one] Diwrnod
        [two] Ddiwrnod
        [few] Diwrnod
        [many] Diwrnod
       *[other] Diwrnod
    }
recordings =
    { $count ->
        [zero] Recordiadau
        [one] Recordiad
        [two] Recordiad
        [few] Recordiad
        [many] Recordiad
       *[other] Recordiad
    }
validations =
    { $count ->
        [zero] Dilysiadau
        [one] Dilysiad
        [two] Dilysiad
        [few] Dilysiad
        [many] Dilysiad
       *[other] Dilysiad
    }

