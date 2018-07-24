## General
yes-receive-emails = Yes, send me emails. I’d like to stay informed about the Common Voice Project.
stayintouch = We at Mozilla are building a community around voice technology. We would like to stay in touch with updates, new data sources and to hear more about how you're using this data.
privacy-info = We promise to handle your information with care. Read more in our <privacyLink>Privacy Notice</privacyLink>.
return-to-cv = Return to Common Voice
email-input =
    .label = Email
submit-form-action = Submit
loading = Loading…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]
## Languages
an = Aragonese
ar = Arabic
as = Assamese
ast = Asturian
az = Azerbaijani
bn = Bengali
br = Breton
bxr = Buryat
ca = Catalan
cak = Kaqchikel
cnh = Hakha Chin
cs = Czech
cv = Chuvash
cy = Welsh
da = Danish
de = German
dsb = Sorbian, Lower
el = Greek
en = English
eo = Esperanto
es = Spanish
et = Estonian
fi = Finnish
fo = Faroese
fr = French
fy-NL = Frisian
ga-IE = Irish
he = Hebrew
hsb = Sorbian, Upper
hu = Hungarian
ia = Interlingua
id = Indonesian
is = Icelandic
it = Italian
ja = Japanese
ka = Georgian
kab = Kabyle
kk = Kazakh
ko = Korean
kpv = Komi-Zyrian
kw = Cornish
ky = Kyrgyz
mk = Macedonian
myv = Erzya
nb-NO = Norwegian Bokmål
ne-NP = Nepali
nl = Dutch
nn-NO = Norwegian Nynorsk
or = Odia
pl = Polish
pt-BR = Portuguese (Brazil)
rm = Romansh
ro = Romanian
ru = Russian
sah = Sakha
sk = Slovak
sl = Slovenian
sq = Albanian
sr = Serbian
sv-SE = Swedish
ta = Tamil
te = Telugu
th = Thai
tr = Turkish
tt = Tatar
uk = Ukrainian
ur = Urdu
uz = Uzbek
zh-CN = Chinese (China)
zh-HK = Chinese (Hong Kong)
zh-TW = Chinese (Taiwan)
# [/]

## Layout
speak = Speak
speak-now = Speak now
datasets = Datasets
languages = Languages
profile = Profile
help = Help
contact = Contact
privacy = Privacy
terms = Terms
cookies = Cookies
faq = FAQ
content-license-text = Content available under a <licenseLink>Creative Commons license</licenseLink>
share-title = Help us find others to donate their voice!
share-text = Help teach machines how real people speak, donate your voice at { $link }
link-copied = Link Copied
back-top = Back to Top
contribution-banner-text = We've just launched a new contribution experience
contribution-banner-button = Take a look
report-bugs-link = Help report bugs

## Home Page
home-title =
  The Common Voice project is Mozilla’s initiative to help teach machines how real people speak.
home-cta = Speak up, contribute here!
wall-of-text-start =
  Voice is natural, voice is human. That’s why we’re fascinated with creating usable voice
  technology for our machines. But to create voice systems, an extremely large amount of voice
  data is required.
wall-of-text-more-mobile =
  Most of the data used by large companies isn’t available to the majority of people. We think
  that stifles innovation. So we’ve launched Project Common Voice, a project to help make voice
  recognition open to everyone.
wall-of-text-more-desktop =
  Now you can donate your voice to help us build an open-source voice database that anyone can use
  to make innovative apps for devices and the web.<lineBreak></lineBreak>
  Read a sentence to help machines learn how real people speak. Check the work of other
  contributors to improve the quality. It’s that simple!
show-wall-of-text = Read More
help-us-title = Help us validate sentences!
help-us-explain = Press play, listen & tell us: did they accurately speak the sentence below?
no-clips-to-validate = Looks like there aren't any clips to listen to in this language. Help us fill the queue by recording some now.
vote-yes = Yes
vote-no = No
toggle-play-tooltip = Press { shortcut-play-toggle } to toggle play mode

## Speak & Listen Shortcuts
# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

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

## Speak Shortcuts
# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Record/Stop

request-language-text = Don't see your language on Common Voice yet?
request-language-button = Request a Language

## ProjectStatus
status-title = Overall project status: see how far we’ve come!
status-contribute = Contribute Your Voice
status-hours =
    { $hours ->
        [one] One validated hour so far!
       *[other] { $hours } validated hours so far!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Next Goal: { $goal }
english = English

## ProfileForm
profile-form-cancel = Exit Form
profile-form-delete = Delete Profile
profile-form-username =
    .label = User Name
profile-form-language =
    .label = Language
profile-form-accent =
    .label = Accent
profile-form-age =
    .label = Age
profile-form-gender =
    .label = Gender
profile-form-submit-save = Save
profile-form-submit-saved = Saved
profile-keep-data = Keep Data
profile-delete-data = Delete Data
male = Male
female = Female
# Gender
other = Other
why-profile-title = Why a profile?
why-profile-text =
  By providing some information about yourself, the audio data you submit to Common Voice will be more useful to Speech
  Recognition engines that use this data to improve their accuracy.
edit-profile = Edit Profile
profile-create = Create a profile
profile-create-success = Success, profile created!
profile-close = Close
profile-clear-modal =
  Clearing your profile data means this demographic information will no longer be submitted to Common Voice with your
  clip recordings.
profile-explanation = Keep track of your progress with a profile and help our voice data be more accurate.

## FAQ
faq-title = Frequently Asked Questions
faq-what-q = What is Common Voice?
faq-what-a = Voice recognition technology could revolutionize the way we interact with machines, but the currently available systems are expensive and proprietary. Common Voice is a project to make voice recognition technology easily accessible to everyone. People donate their voices to a massive database that will let anyone quickly and easily train voice-enabled apps. All voice data will be available to developers.
faq-important-q = Why is it important?
faq-important-a = Voice is natural, voice is human. It’s the easiest and most natural way to communicate. We want developers to be able to build amazing things from real-time translators to voice-enabled administrative assistants. But right now there isn’t enough publicly available data to build these kinds of apps. We hope that Common Voice will give developers what they need to innovate.
faq-get-q = How can I get the Common Voice data?
faq-get-a = The dataset is available now on our <downloadLink>download page</downloadLink> under the <licenseLink>CC-0</licenseLink> license.
faq-mission-q = Why is Common Voice part of the Mozilla mission?
faq-mission-a = Mozilla is dedicated to keeping the web open and accessible for everyone. To do it we need to empower web creators through projects like Common Voice. As voice technologies proliferate beyond niche applications, we believe they must serve all users equally well. We see a need to include more languages, accents and demographics when building and testing voice technologies. Mozilla wants to see a healthy, vibrant internet. That means giving new creators access to voice data so they can build new, extraordinary projects. Common Voice will be a public resource that will help Mozilla teams and developers around the world.
faq-native-q = I am a non-native { $lang } speaker and I speak with an accent, do you still want my voice?
faq-native-a = Yes, we definitely want your voice! Part of the aim of Common Voice is to gather as many different accents as possible, so that computers can better understand <bold>everyone</bold> when they speak.
faq-firefox-q = Will speech-to-text, via Common Voice, ever become part of Firefox?
faq-firefox-a = Common Voice has unlimited potential and we are indeed exploring speech interfaces in many Mozilla products, including Firefox.
faq-quality-q = What is the level of quality needed for the audio in order to be used?
faq-quality-a = We want the audio quality to reflect the audio quality a speech-to-text engine will see in the wild. Thus, we want variety. This teaches the speech-to-text engine to handle various situations—background talking, car noise, fan noise—without errors.
faq-hours-q = Why is 10,000 hours the goal for capturing audio?
faq-hours-a = This is approximately the number of hours required to train a production STT system.
faq-source-q = Where does the source text come from?
faq-source-a1 = The current sentences come from contributor donations, as well as dialogue from public domain movie scripts like <italic>It’s a Wonderful Life.</italic>
faq-source-a2 = You can view our source sentences in <dataLink>this GitHub folder</dataLink>.

## Profile
profile-why-title = Why a profile?
profile-why-content = By providing some information about yourself, the audio data you submit to Common Voice will be more useful to Speech Recognition engines that use this data to improve their accuracy.

## NotFound
notfound-title = Not found
notfound-content = I’m afraid I don’t know what you’re looking for.

## Data
data-download-button = Download Common Voice Data
data-download-yes = Yes
data-download-deny = No
data-download-license = License: <licenseLink>CC-0</licenseLink>
data-download-modal = You are about to initiate a download of <size>{ $size }GB</size>, proceed?
data-subtitle = We are building an open and publicly available dataset of voices that everyone can use to train speech-enabled applications.
data-explanatory-text = We believe that large and publicly available voice datasets foster innovation and healthy commercial competition in machine-learning based speech technology. This is a global effort and we invite everyone to participate. Our aim is to help speech technology be more inclusive, reflecting the diversity of voices from around the world.
data-get-started = <speechBlogLink>Get Started with Speech Recognition</speechBlogLink>
data-other-title = Other voice datasets…
data-other-goto = Go to { $name }
data-other-download = Download Data
data-other-librispeech-description = LibriSpeech is a corpus of approximately 1000 hours of 16Khz read English speech derived from read audiobooks from the LibriVox project.
data-other-ted-name = TED-LIUM Corpus
data-other-ted-description = The TED-LIUM corpus was made from audio talks and their transcriptions available on the TED website.
data-other-voxforge-description = VoxForge was set up to collect transcribed speech for use with Free and Open Source Speech Recognition Engines.
data-other-tatoeba-description = Tatoeba is a large database of sentences, translations, and spoken audio for use in language learning. This download contains spoken English recorded by their community.
data-bundle-button = Download Dataset Bundle
data-bundle-description = Common Voice data plus all other voice datasets above.
license = License: <licenseLink>{ $license }</licenseLink>
license-mixed = Mixed

## Record Page
record-platform-not-supported = We’re sorry, but your platform is not currently supported.
record-platform-not-supported-desktop = On desktop computers, you can download the latest:
record-platform-not-supported-ios = <bold>iOS</bold> users can download our free app:
record-must-allow-microphone = You must allow microphone access.
record-retry = Retry
record-no-mic-found = No microphone found.
record-error-too-short = The recording was too short.
record-error-too-long = The recording was too long.
record-error-too-quiet = The recording was too quiet.
record-submit-success = Submit success! Want to record again?
record-help = Please tap to record, then read the above sentence aloud.
record-cancel = Cancel Re-recording

review-terms = By using Common Voice, you agree to our <termsLink>Terms</termsLink> and <privacyLink>Privacy Notice</privacyLink>
terms-agree = I agree
terms-disagree = I do not agree
review-aborted = Upload aborted. Do you want to delete your recordings?
review-submit-title = Review & Submit
review-submit-msg = Thank you for recording!<lineBreak></lineBreak>Now review and submit your clips below.
review-recording = Review
review-rerecord = Re-record
review-cancel = Cancel Submission
review-keep-recordings = Keep the recordings
review-delete-recordings = Delete my recordings

## Download Modal
download-title = Your download has started.
download-helpus = Help us build a community around voice technology, stay in touch via email.
download-form-email =
    .label = Enter your email
    .value = Thank you, we'll be in touch.
download-back = Return to Common Voice Datasets
download-no = No Thanks

## Contact Modal
contact-title = Contact Form
contact-form-name =
    .label = Name
contact-form-message =
    .label = Message
contact-required = *required

## Request Language Modal
request-language-title = Language Request
request-language-form-language =
    .label = Language
request-language-success-title = Language request successfully submitted, thank you.
request-language-success-content = We will be in touch with more information about how to add your language to Common Voice very soon.

## Languages Overview
language-section-in-progress = In Progress
language-section-in-progress-description = In progress languages are currently being built for contribution by our communities; their progress reflects where they are across the website localization and sentence collection phases.
language-section-launched = Launched
language-section-launched-description = For these launched languages the website has been successfully localized, and has enough sentences collected, to allow for ongoing <italic>{ speak }</italic> and <italic>{ listen }</italic> contribution.
languages-show-more = See More
languages-show-less = See Less
language-speakers = Speakers
language-meter-in-progress = Progress
language-total-progress = Total
language-search-input =
    .placeholder = Search
language-speakers = Speakers
localized = Localized
sentences = Sentences
total-hours = Validated Hrs

## New Contribution
action-click = Click
action-tap = Tap
contribute = Contribute
listen = Listen
skip = Skip
shortcuts = Shortcuts
clips = Clips
goal-help-recording = You've helped Common Voice reach <goalPercentage></goalPercentage> of our daily { $goalValue } recording goal!
goal-help-validation = You've helped Common Voice reach <goalPercentage></goalPercentage> of our daily { $goalValue } validation goal!
contribute-more =
    { $count ->
       *[other] Ready to do { $count } more?
    }
record-cta = Start recording
record-instruction = { $actionType }<recordIcon></recordIcon> then read the sentence aloud
record-stop-instruction = { $actionType }<stopIcon></stopIcon> when done
record-three-more-instruction = Three to go!
record-again-instruction = Great!<recordIcon></recordIcon> Record your next clip
record-again-instruction2 = Keep it up, record again <recordIcon></recordIcon>
record-last-instruction = <recordIcon></recordIcon> Last one!
review-tooltip = Review & re-record clips here as you go
unable-speak = Unable to speak right now?
review-instruction = Review & re-record clips if needed
record-submit-tooltip = { $actionType } submit when ready
clips-uploaded = Clips Uploaded
record-abort-title = Finish recording first?
record-abort-text = Leaving now means you'll lose your progress
record-abort-submit = Submit clips
record-abort-continue = Finish recording
record-abort-delete = Exit & Delete clips
listen-instruction = { $actionType }<playIcon></playIcon> did they accurately speak the sentence?
listen-again-instruction = Great work!<playIcon></playIcon> Listen again when you're ready
listen-3rd-time-instruction = 2 down, keep it up!<playIcon></playIcon>
listen-last-time-instruction = <playIcon></playIcon>Last one!
nothing-to-validate = We don't have anything to validate in this language, help us fill the queue.
record-button-label = Record your voice
share-title-new = <bold>Help us</bold> find more voices


