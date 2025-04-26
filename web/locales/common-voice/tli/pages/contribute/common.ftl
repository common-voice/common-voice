action-click = Click
action-tap = Tap
contribute = Contribute
review = Review
skip = ḵut nasg̱éex'
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
        [one] Ready to do { $count } more?
       *[other] Ready to do { $count } more?
    }
speak-empty-state = We've run out of sentences to record in this language...
no-sentences-for-variants = Your language variant might be out of sentences! If you’re comfortable, you can change your settings to see other sentences within your language.
speak-empty-state-cta = Yees yóo x̱'atánk akaadéi natí
speak-loading-error =
    We couldn’t get any sentences for you to speak.
    Please try again later.
record-button-label = Record-x̱ layéx̱ i satú
share-title-new = <bold>Help us</bold> find more voices
keep-track-profile = Keep track of your progress with a profile
login-to-get-started = Log in or sign up to get started
target-segment-first-card = You’re contributing to our first target segment
target-segment-generic-card = You’re contributing to a target segment
target-segment-first-banner = Help create Common Voice’s first target segment in { $locale }
target-segment-add-voice = Add Your Voice
target-segment-learn-more = Learn More
change-preferences = Change preferences
login-signup = Log In / Sign Up
vote-yes = aaá
vote-no = Tléik'
datasets = Datasets
languages = Languages
about = adaat
partner = Yaḵáax'w
submit-form-action = ee jeenáḵ

## Reporting

report = Kananeek
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
shortcut-submit-label = Clips ee jeenáḵ
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

contribution-criteria-nav = Criteria
contribution-criteria-link = Understand contribution criteria
contribution-criteria-page-title = Contribution Criteria
contribution-criteria-page-description = Understand what to look for when listening to voice clips and help make your voice recordings richer too!
contribution-for-example = for example
contribution-misreadings-title = Misreadings
contribution-misreadings-description = When listening, check very carefully that what has been recorded is exactly what has been written; reject if there are even minor errors. <br />Very common mistakes include:
contribution-misreadings-description-extended-list-1 = Missing <strong>'A'</strong> or <strong>'The'</strong> at the beginning of the recording.
contribution-misreadings-description-extended-list-2 = Missing an <strong>'s'</strong> at the end of a word.
contribution-misreadings-description-extended-list-3 = Reading contractions that aren't actually there, such as "We're" instead of "We are", or vice versa.
contribution-misreadings-description-extended-list-4 = Missing the end of the last word by cutting off the recording too quickly.
contribution-misreadings-description-extended-list-5 = Taking several attempts to read a word.
contribution-misreadings-example-1-title = The giant dinosaurs of the Triassic.
contribution-misreadings-example-2-title = The giant dinosaur of the Triassic.
contribution-misreadings-example-2-explanation = [Should be ‘dinosaurs’]
contribution-misreadings-example-3-title = The giant dinosaurs of the Triassi-.
contribution-misreadings-example-3-explanation = [Recording cut off before the end of the last word]
contribution-misreadings-example-4-title = The giant dinosaurs of the Triassic. Yes.
