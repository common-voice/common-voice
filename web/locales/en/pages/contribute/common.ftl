action-click = Click
action-tap = Tap
contribute = Contribute
review = Review
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
       *[other] Ready to do { $count } more?
    }
speak-empty-state = We've run out of sentences to record in this language...
no-sentences-for-variants = Your language variant might be out of sentences! If you’re comfortable, you can change your settings to see other sentences within your language.
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
change-preferences = Change preferences

## Contribution Nav Items

contribute-voice-collection-nav-header = Voice Collection
contribute-sentence-collection-nav-header = Sentence Collection
login-signup = Log In / Sign Up
vote-yes = Yes
vote-no = No
datasets = Datasets
languages = Languages
about = About
partner = Partner
submit-form-action = Submit

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
contribution-misreadings-example-4-explanation = [More has been recorded than the required text]
contribution-misreadings-example-5-title = We are going out to get coffee.
contribution-misreadings-example-6-title = We’re going out to get coffee.
contribution-misreadings-example-6-explanation = [Should be “We are”]
contribution-misreadings-example-7-title = We are going out to get a coffee.
contribution-misreadings-example-7-explanation = [No ‘a’ in the original text]
contribution-misreadings-example-8-title = The bumblebee sped by.
contribution-misreadings-example-8-explanation = [Mismatched content]
contribution-varying-pronunciations-title = Varying Pronunciations
contribution-varying-pronunciations-description = Be cautious before rejecting a clip on the ground that the reader has mispronounced a word, has put the stress in the wrong place, or has apparently ignored a question mark. There are a wide variety of pronunciations in use around the world, some of which you may not have heard in your local community. Please provide a margin of appreciation for those who may speak differently from you.
contribution-varying-pronunciations-description-extended = On the other hand, if you think that the reader has probably never come across the word before, and is simply making an incorrect guess at the pronunciation, please reject. If you are unsure, use the skip button.
contribution-varying-pronunciations-example-1-title = On his head he wore a beret.
contribution-varying-pronunciations-example-1-explanation = [‘Beret’ is OK whether with stress on the first syllable (UK) or the second (US)]
contribution-varying-pronunciations-example-2-title = His hand was rais-ed.
contribution-varying-pronunciations-example-2-explanation = [‘Raised’ in English is always pronounced as one syllable, not two]
contribution-background-noise-title = Background Noise
contribution-background-noise-description = We want the machine learning algorithms to able to handle a variety of background noise, and even relatively loud noises can be accepted provided that they don’t prevent you from hearing the entirety of the text. Quiet background music is OK; music loud enough to prevent you from hearing each and every word is not.
contribution-background-noise-description-extended = If the recording breaks up, or has crackles, reject unless the entirety of the text can still be heard.
contribution-background-noise-example-1-fixed-title = <strong>[Sneeze]</strong> The giant dinosaurs of the <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = The giant dino <strong>[cough]</strong> the Triassic.
contribution-background-noise-example-2-explanation = [Part of the text can’t be heard]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]</strong> giant dinosaurs of <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = Background Voices
contribution-background-voices-description = A quiet background hubbub is OK, but we don’t want additional voices that may cause a machine algorithm to identify words that are not in the written text. If you can hear distinct words apart from those of the text, the clip should be rejected. Typically this happens where the TV has been left on, or where there is a conversation going on nearby.
contribution-background-voices-description-extended = If the recording breaks up, or has crackles, reject unless the entirety of the text can still be heard.
contribution-background-voices-example-1-title = The giant dinosaurs of the Triassic. <strong>[read by one voice]</strong>
contribution-background-voices-example-1-explanation = Are you coming? <strong>[called by another]</strong>
contribution-volume-title = Volume
contribution-volume-description = There will be natural variations in volume between readers. Reject only if the volume is so high that the recording breaks up, or (more commonly) if it is so low that you can’t hear what is being said without reference to the written text.
contribution-reader-effects-title = Reader Effects
contribution-reader-effects-description = Most recordings are of people talking in their natural voice. You can accept the occasional non-standard recording that is shouted, whispered, or obviously delivered in a ‘dramatic’ voice. Please reject sung recordings and those using a computer-synthesized voice.
contribution-just-unsure-title = Just Unsure?
contribution-just-unsure-description = If you come across something that these guidelines don’t cover, please vote according to your best judgement. If you really can’t decide, use the skip button and go on to the next recording.
see-more = <chevron></chevron>See more
see-less = <chevron></chevron>See less
