action-click = Click
action-tap = Tap
contribute = To boa
skip = Skip
shortcuts = Shortcuts
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Clip
       *[other] <bold>{ $count }</bold> Clips
    }
goal-help-recording = You've helped Common Voice reach <goalPercentage></goalPercentage> of our daily { $goalValue } recording goal!
goal-help-validation = You've helped Common Voice reach <goalPercentage></goalPercentage> of our daily { $goalValue } validation goal!
contribute-more =
    { $count ->
        [one] { "" }
       *[other] Ready to do { $count } more?
    }
speak-empty-state = We've run out of sentences to record in this language...
speak-empty-state-cta = Contribute sentences
speak-loading-error =
    We couldn’t get any sentences for you to speak.
    Please try again later.
record-button-label = Record your voice
share-title-new = <bold>Help us</bold> find more voices
keep-track-profile = Keep track of your progress with a profile
login-to-get-started = Log in or sign up to get started
target-segment-first-card = You’re contributing to our first target segment
target-segment-generic-card = You’re contributing to a target segment
target-segment-first-banner = Help create Common Voice’s first target segment in { $locale }
target-segment-add-voice = Add Your Voice
target-segment-learn-more = Learn More

## Contribution Nav Items


## Reporting

report = Report
report-title = Submit a report
report-ask = What issues are you experiencing with this sentence?
report-offensive-language = Offensive language
report-offensive-language-detail = The sentence has disrespectful or offensive language.
report-grammar-or-spelling = Grammatical / spelling error
report-grammar-or-spelling-detail = The sentence has a grammatical or spelling error.
report-different-language = Different language
report-different-language-detail = It is written in a language different than what I’m speaking.
report-difficult-pronounce = Difficult to pronounce
report-difficult-pronounce-detail = It contains words or phrases that are hard to read or pronounce.
report-offensive-speech = Offensive speech
report-offensive-speech-detail = The clip has disrespectful or offensive language.
report-other-comment =
    .placeholder = Comment
success = Success
continue = Continue
report-success = Report was passed successfully

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Record/Stop
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Re-record clip
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Discard ongoing recording
shortcut-submit = Return
shortcut-submit-label = Submit clips
request-language-text = Don't see your language on Common Voice yet?
request-language-button = Request a Language

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Play/Stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

