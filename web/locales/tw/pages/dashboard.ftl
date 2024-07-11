## Dashboard

your-languages = Your Languages
toward-next-goal = Toward next goal
goal-reached = Goal reached
clips-you-recorded = Clips You've Recorded
clips-you-validated = Clips You've Validated
todays-recorded-progress = Today's Common Voice progress on clips recorded
todays-validated-progress = Today's Common Voice progress on clips validated
stats = Stats
awards = Awards
you = You
everyone = Everyone
contribution-activity = Contribution Activity
top-contributors = Top Contributors
recorded-clips = Recorded Clips
validated-clips = Validated Clips
total-approved = Total Approved
overall-accuracy = Overall Accuracy
set-visibility = Set my visibility
visibility-explainer = This setting controls your leaderboard visibility. When hidden, your progress will be private. This means your image, user name and progress will not appear on the leaderboard. Note that leaderboard refresh takes ~{ $minutes }min to populate changes.
visibility-overlay-note = Note: When set to 'Visible', this setting can be changed from the <profileLink>Profile page</profileLink>
show-ranking = Show my ranking

## Custom Goals

get-started-goals = Get started with goals
create-custom-goal = Create a Custom goal
goal-type = What kind of goal do you want to build?
both-speak-and-listen = Both
both-speak-and-listen-long = Both (Speak and Listen)
daily-goal = Daily Goal
weekly-goal = Weekly Goal
easy-difficulty = Easy
average-difficulty = Average
difficult-difficulty = Difficult
pro-difficulty = Pro
lose-goal-progress-warning = By editing your goal, you may lose your existing progress.
want-to-continue = Do you want to continue?
finish-editing = Finish editing first?
lose-changes-warning = Leaving now means you’ll lose your changes
build-custom-goal = Build a custom goal
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Help reach { $hours } hour in { $language } with a personal goal
       *[other] Help reach { $hours } hours in { $language } with a personal goal
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Help Common Voice reach { $hours } hour in a language with a personal goal
       *[other] Help Common Voice reach { $hours } hours in a language with a personal goal
    }
set-a-goal = Set a goal
cant-decide = Can't decide?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] 	{ $totalHours } hour is achievable in just over
       *[other] 	{ $totalHours } hours is achievable in just over
    } { NUMBER($periodMonths) ->
        [one] { $periodMonths } month if
       *[other] { $periodMonths } months if
    } { NUMBER($people) ->
        [one] { $people } person record
       *[other] { $people } people record
    } { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } clip a day.
       *[other] { $clipsPerDay } clips a day.
    }
how-many-per-day = Great! How many clips per day?
how-many-a-week = Great! How many clips a week?
which-goal-type = Do you want to Speak, Listen or both?
receiving-emails-info =
    You're currently set to receive emails such as goal reminders, my
    progress updates and newsletters about Common Voice
not-receiving-emails-info =
    You're currently set to <bold>NOT</bold> receive emails such as goal reminders, my
    progress updates and newsletters about Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } clip
       *[other] { $count } clips
    }
help-share-goal = Help us find more voices, share your goal
confirm-goal = Confirm Goal
goal-interval-weekly = Weekly
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Share your { $count } Clip Daily Goal for { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Share your { $count } Clip Weekly Goal for { $type }
share-goal-type-speak = Speaking
share-goal-type-listen = Listening
share-goal-type-both = Speaking and Listening
# LINK will be replaced with the current URL
goal-share-text = I just created a personal goal for voice donation to #CommonVoice -- join me and help teach machines how real people speak { $link }
weekly-goal-created = Your weekly goal has been created
daily-goal-created = Your daily goal has been created
track-progress = Track progress here and on your stats page.
return-to-edit-goal = Return here to edit your goal anytime.
share-goal = Share my goal

## Goals

streaks = Streaks
days =
    { $count ->
        [one] Day
       *[other] Days
    }
recordings =
    { $count ->
        [one] { "" }
       *[other] Recordings
    }
validations =
    { $count ->
        [one] Validation
       *[other] Validations
    }
