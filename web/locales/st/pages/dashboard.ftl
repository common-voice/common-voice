## Dashboard

your-languages = Dipuo tsa Hao
toward-next-goal = Ho leba sepheong se latelang
goal-reached = Sepheo se fihletswe
clips-you-recorded = Di-clip tseo O di Rekotileng
clips-you-validated = Di-clip tseo O di Netefaditseng
todays-recorded-progress = Tshebetso ya kajeno ya Common Voice di-cliping tsa mantswe e rekotilwe
todays-validated-progress = Tshebetso ya kajeno ya Common Voice di-cliping tsa mantswe e netefaditswe
stats = Dipalo-palo
awards = Dikgau
you = Wena
everyone = Bohle
contribution-activity = Mosebetsi wa Monehelo
top-contributors = Bafani ba ka hodimo
recorded-clips = Di-clip tse Rekotilweng
validated-clips = Di-clip tse netefaditsweng
total-approved = Kakaretso e Amohetsweng
overall-accuracy = Ho Nepa Ka Kakaretso
set-visibility = Beha ponahalo ya ka
visibility-explainer = Tlhophiso ena e laola ponahalo ya boto-ya-baetapele. Ha e patehile, tswelopele ya hao e tla ba lekunutu. Hona ho bolela hore setshwantsho sa hao, lebitso la mosebedisi le tswelopele ya hao ha di na hlaha ho boto-ya-baetapele. Hlokomela hore ntjhafatso ya boto-ya-baetapele e nka ~{ $minutes } metsoso ho bontsha diphetoho.
visibility-overlay-note = Tlhokomediso: Ha e behetswe ho 'Bonahala', tlhophiso ena e ka fetolwa ho tswa ho <profileLink>Leqephe la Profaele</profileLink>
show-ranking = Bontsha boemo ba ka

## Custom Goals

get-started-goals = Qalella ka dipheo
create-custom-goal = Etsa sepheo se etseditsweng wena feela
goal-type = O batla ho iketsetsa sepheo sa mofuta ofe?
both-speak-and-listen = Bobedi
both-speak-and-listen-long = Ka bobedi (Bua le ho Mamela)
daily-goal = Sepheo sa Letsatsi le Letsatsi
weekly-goal = Sepheo sa beke le beke
easy-difficulty = E bonolo
average-difficulty = E bohareng
difficult-difficulty = E thata
pro-difficulty = Pro
lose-goal-progress-warning = Ka ho hlophisa sepheo sa hao, o ka lahlehelwa ke tswelopele ya hao e teng.
want-to-continue = O batla ho tswelapele?
finish-editing = Qetela ho lokisa pele?
lose-changes-warning = Ho tsamaea hona jwale ho bolela hore o tla lahlehelwa ke diphetoho tsa hao
build-custom-goal = Aha sepheo se etseditsweng wena feela
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Thusa hore re fihlelle { $hours } hora ho { $language } ka sepheo sa hao
       *[other] Thusa hore re fihlelle { $hours } dihora ho { $language } ka sepheo sa hao
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Thusa Common Voice e fihlele { $hours } hora puong ka sepheo sa hao
       *[other] Thusa Common Voice e fihlele { $hours } dihora puong ka sepheo sa hao
    }
set-a-goal = Ipehele sepheo
cant-decide = Ha o kgone ho etsa qeto?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } hora e ka fihlellwang ka mora
       *[other] { $totalHours } dihora tse ka fihlellwang ka mora
    } { NUMBER($periodMonths) ->
        [one] { $periodMonths } kgwedi haeba
       *[other] { $periodMonths } dikgwedi haeba
    }{ NUMBER($people) ->
        [one] { $people } motho a rekota
       *[other] { $people } batho ba rekota
    }{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } clip ka letsatsi.
       *[other] { $clipsPerDay } di-clip ka letsatsi.
    }
how-many-per-day = E ntle! Ke di-clip tse kae ka letsatsi?
how-many-a-week = E ntle! Ke di-clip tse kae ka beke?
which-goal-type = Na o batla ho Bua, ho Mamela, kapa di le pedi?
receiving-emails-info = Hajwale o se o ikemiseditse ho amohela di-email jwaloka dikgopotso tsa sepheo, dintlha tse ntjha ka tswelopele yaka le dikoranta mabapi le Common Voice
not-receiving-emails-info = Hajwale o se o ikemiseditse ho <bold>ESENG</bold> ho fumana di-imeile jwalo ka dikgopotso tsa sepheo, dintlha tse ntjha ka tswelopele yaka le dikoranta mabapi le Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } clip
       *[other] { $count } di-clip
    }
help-share-goal = Re thuse ho fumana mantswe a mang hape, arolelana ka sepheo sa hao.
confirm-goal = Netefatsa sepheo
goal-interval-weekly = Beke le beke
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Arolelana { $count } Sepheo sa hao sa Clip sa Letsatsi bakeng sa { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Arolelana { $count } Sepheo sa hao sa Clip sa Beke bakeng sa { $type }
share-goal-type-speak = E ntse e bua
share-goal-type-listen = E ntse mametse
share-goal-type-both = Ho Bua le ho Mamela
# LINK will be replaced with the current URL
goal-share-text = Ke sa tswa iketsetsa sepheo sa ho fana ka lentswe ho #CommonVoice -- ikopanye le nna ho thusa ho ruta metjhini hore na batho ba nnete ba bua jwang { $link }
weekly-goal-created = Sepheo sa hao sa beke se entswe
daily-goal-created = Sepheo sa hao sa letsatsi le letsatsi se entswe
track-progress = Sheba tswelopele mona le leqepheng la hao la dipalo palo.
return-to-edit-goal = Kgutlela mona ho hlophisa sepheo sa hao neng kapa neng.
share-goal = Arolelana sepheo sa ka

## Goals

streaks = Melapo
days =
    { $count ->
        [one] Letsatsi
       *[other] Matsatsi
    }
recordings =
    { $count ->
        [one] Rekoto
       *[other] Direkoto
    }
validations =
    { $count ->
        [one] Netefatso
       *[other] Dinetefatso
    }

