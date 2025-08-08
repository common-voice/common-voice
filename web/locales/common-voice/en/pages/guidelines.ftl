# GUIDELINES PAGE
guidelines-header = Contribution Guidelines
guidelines-header-subtitle = Understand how to contribute and validate on the Common Voice dataset
voice-collection = Voice Collection
sentence-collection = Sentence Collection
question-collection = Question Collection
scripted-speech = Scripted Speech
spontaneous-speech = Spontaneous Speech
dont-subheader = Don’t

## Voice Collection nav ids
varying-pronunciations = Varying Pronunciations
misreadings = Misreadings
offensive-content = Offensive Content
background-noise = Background Noise
background-voices = Background Voices
volume = Volume
reader-effects = Reader Effects
just-unsure = Just Unsure?
example = Example

## Voice collection sidebar content 
varying-pronunciations-explanation-1 = We welcome different accents! Be very cautious before rejecting a clip on the ground that you think the reader has mispronounced a word, has put the stress in the wrong place, or has ignored punctuation. There are a wide variety of pronunciations in use around the world, some of which you may not have heard in your local community. Please provide a generous margin of appreciation for those who may speak differently from you.
varying-pronunciations-explanation-2 = On the other hand, if you think that the reader has never come across the word before, and is making an incorrect guess at the pronunciation, please reject. If you are unsure, use the skip button.
varying-pronunciations-example = The route was unclear.
varying-pronunciations-tip-1 = [Canadian English might make "route" sound like "rowt"]
varying-pronunciations-tip-2 = [British English might make "root"]
offensive-content-explanation = Sentences are vetted through a community-moderation process, however this process is not perfect. If you see or hear a sentence that offends or upsets you - for example because it violates our <participationGuidelines>community participation guidelines</participationGuidelines> - please do use the flag button in the UI. You can also reach out to us at <emailFragment>commonvoice@mozilla.com</emailFragment>.
misreadings-explanation-1 = Reading all the words on the page correctly does matter. When listening, check very carefully that what has been recorded is exactly what has been written; reject if they have added, contracted or missed words.
misreadings-explanation-2 = Very common mistakes include:
misreadings-explanation-3 = Missing 'A' or 'The' at the beginning of the recording.
misreadings-explanation-4 = Missing an 's' at the end of a word.
misreadings-explanation-5 = Reading contractions that aren't actually there, such as "We're" instead of "We are", or vice versa.
misreadings-explanation-6 = Missing the end of the last word by cutting off the recording too quickly.
misreadings-explanation-7 = Taking several attempts to read a word.
misreadings-example-1 = We are going out to get coffee.
misreadings-example-2 = We're going out to get coffee.
misreadings-example-3 = We are going out to get a coffee.
misreadings-example-4 = The bumblebee sped by.
misreadings-tip-1 = [Should be “We are”]
misreadings-tip-2 = [No ‘a’ in the original text]
misreadings-tip-3 = [Mismatched content]
background-noise-explanation = You need to be able to hear every word of the recording. We want machine learning algorithms to be able to handle a variety of background noise, and even relatively loud noises or quiet background music can be accepted provided that they don’t prevent you from hearing the entirety of the text. Crackles or ‘breaking up’ that prevent you hearing the text means you should reject the clip.
background-noise-example-1 = The giant dinosaurs of the Triassic.
background-noise-example-2 = [Sneeze] The giant dinosaurs of the [cough] Triassic.
background-noise-example-3 = The giant dino [cough] the Triassic.
background-noise-example-4 = [Crackle] giant dinosaurs of [crackle] -riassic.
background-noise-tip-1 = [interrupted by background noise]
background-noise-tip-2 = [Part of the text can’t be heard]
background-voices-explanation = A little background noise is okay, but if you can hear another person speaking distinct words, the clip should be rejected. Typically this happens where the TV has been left on, or where there is a conversation going on nearby.
background-voices-example-1 = The giant dinosaurs of the Triassic. [read by one voice]
background-voices-tip-1 = Are you coming? [called by another]
volume-explanation = There will be natural variations in volume between readers. Reject only if the volume is so high that the recording breaks up, or (more commonly) if it is so low that you can’t hear what is being said without reference to the written text.
reader-effects-explanation = Most recordings are of people talking in their natural voice. You can accept the occasional non-standard recording that is shouted, whispered, or obviously delivered in a ‘dramatic’ voice. Please reject sung recordings and those using a computer-synthesized voice.
just-unsure-explanation = If you come across something that these guidelines don’t cover, please vote according to your best judgement. If you really can’t decide, use the skip button and go on to the next recording.
still-have-questions = Still have questions?
contact-common-voice = Contact the Common Voice team

## Sentence collection nav ids
public-domain = Public Domain
citing-sentences = Citing Sentences
adding-sentences = Adding Sentences
reviewing-sentences = Reviewing Sentences
sentence-domain = Sentence Domain

## Sentence collection sidebar content 
public-domain-explanation-1 = It is very important that all text sentences are <publicDomain>public domain</publicDomain> (<cc0>cc0</cc0>) as the Common Voice dataset is released under a cc0 license. Only ever upload a sentence if you are sure, and always include the relevant citation.
public-domain-explanation-2 = The best sentences for building a useful speech recognition engine are colloquial, modern parlance. Some ideas to help you generate sentences are;
public-domain-explanation-3 = Create modern, colloquial sentences by yourself or with your friends or language community - for example through a ‘write-a-thon’
public-domain-explanation-4 = Contact authors, playwrights or screenwriters and ask if they would be willing to dedicate a small portion of their works to the public domain
public-domain-explanation-5 = Look for text where the copyright no longer applies - for example most books that were published before 1920
public-domain-explanation-6 = Reach out to governments, non-profits or media organizations to see whether any of their web content, reports or other content can be dedicated to the public domain
citing-sentences-explanation-1 = It’s important to include citations so we can check that sentences are in the public domain and no copyright restriction apply.
citing-sentences-subheader-websites = Websites
citing-sentences-subheader-websites-explanation = You could include the website, e.g "Common Voice - https://commonvoice.mozilla.org/"
citing-sentences-subheader-academic-reference = Academic Reference
citing-sentences-subheader-academic-reference-explanation = You could use academic referencing style, e.g Harvard style "Mozilla (2021) Common Voice. Available at https://commonvoice.mozilla.org/ (Accessed: 15th September 2021)"
citing-sentences-subheader-offline-sources = Offline Sources
citing-sentences-subheader-offline-sources-explanation = For public domain text that is not available online, you could use academic referencing style e.g Harvard style "Jess (2021) My Public license poems"
citation =
    .label = Citation
self-citation = Self Citation
self-citation-explanation = This is how you cite yourself if you wrote the content yourself.
adding-sentences-subheader-length = Length
adding-sentences-subheader-length-explanation = The sentence should have fewer than 15 words.
adding-sentences-subheader-spelling-punctuation = Spelling and Punctuation
adding-sentences-subheader-spelling-punctuation-explanation = The sentence must be spelled correctly.
adding-sentences-subheader-speakable = Speakable
adding-sentences-subheader-speakable-explanation = The best sentences are natural and conversational — they should be easy for someone to read. While phonetic diversity and different words in sentences is important, we are also trying to make recording sentences as engaging and fun for our volunteer community as possible.
adding-sentences-subheader-numbers = Numbers
adding-sentences-subheader-numbers-explanation = There should ideally be no digits in the source text because they can cause problems when read aloud. The way a number is read depends on context and might introduce confusion in the dataset. For example, the number “2409” could be accurately read as both “twenty-four zero nine” and “two thousand four hundred nine”.
adding-sentences-subheader-abbreviations = Abbreviations and Acronyms
adding-sentences-subheader-abbreviations-explanation = Abbreviations and acronyms like “USA” or “ICE” should be avoided in the source text because they may be read in a way that does not coincide with their spelling. Additionally, there may be multiple accurate readings for a single abbreviation.
adding-sentences-subheader-punctuation = Punctuation
adding-sentences-subheader-punctuation-explanation = Special symbols and punctuation should only be included when absolutely necessary. For example, an apostrophe is included in English words like “don’t” and “we’re” and should be included in the source text, but it’s unlikely you’ll ever need a special symbol like “@” or “#.”
adding-sentences-subheader-special-characters = Special Characters and Foreign Letters
adding-sentences-subheader-special-characters-explanation-1 = Letters must be valid in the language being spoken. For example, “ж” is a letter in the Russian alphabet but is never used in English and so should never appear in any English source text.
adding-sentences-subheader-special-characters-explanation-2 = Languages can have their own validation rules with additional requirements when they localize. If there is no specific validation file for a language, the English rules will show for contributors.
adding-sentences-subheader-offensive-content = Offensive Content
adding-sentences-subheader-offensive-content-explanation = If the sentence is offensive or upsetting - for example because of explicit content, or another violation of our <communityGuidelines>community participation guidelines</communityGuidelines> - you should reject the sentence. You can also reach out to us at <emailFragment>commonvoice@mozilla.com</emailFragment> to escalate the issue.
reviewing-sentences-explanation-1 = If the sentence meets the criteria above, click the "Yes" button.
reviewing-sentences-explanation-2 = If the sentence does not meet the above criteria, click the "No" button.
reviewing-sentences-explanation-3 = If you are unsure about the sentence, you may also skip it and move on to the next one.
reviewing-sentences-explanation-4 = If you run out of sentences to review, please help us collect more sentences!
domain-explanation = Domain refers to the subject matter of the sentence. Currently, you can choose between:

## Question collection ids
adding-questions = Adding Questions

## Question collection sidebar content
what-makes-a-good-question-subheader = What makes a good question?
what-makes-a-good-question-explanation = A  good question for public participation datasets should:
what-makes-a-good-question-explanation-criteria-1 = Be easy to understand and respond to
what-makes-a-good-question-explanation-criteria-2 = Be generally relevant
what-makes-a-good-question-explanation-criteria-3 = Not use, or solicit, harmful or offensive language
what-makes-a-good-question-tip = You might also want to consider spanning different contexts and domains.  
easy-to-understand = Easy to Understand
easy-to-understand-explanation = Choose simple questions that are easy for anyone to understand, regardless of culture or context.
spelling-and-pronunciation = Spelling and Punctuation
spelling-and-pronunciation-explanation = Use correct spelling and grammar.
length = Length
length-explanation = The question should be answerable in just a couple of sentences.
dont-add-subheader = Don’t Add
culturally-specific-questions = Culturally specific questions
culturally-specific-questions-explanation = Questions which are very culturally specific, or make a lot of assumptions about the responder
length-avoid-explanation = Questions which someone would struggle to respond to in 15 seconds (the maximum clip length) 
process-steps = Process / Steps
process-steps-explanation = Questions which require someone to list several steps.  Listing steps prompts the user to recite an answer rather than a more natural response.  
offensive-content-sensitive-information = Offensive content or sensitive information
offensive-content-sensitive-information-explanation-explanation-1 = Questions which might solicit personally identifiable information 
offensive-content-sensitive-information-explanation-explanation-2 = Questions which might solicit hate speech or other biased or offensive sentiments 
offensive-content-sensitive-information-explanation-explanation-3 = Questions which may cause someone to share sensitive, potentially triggering responses
example-questions-subheader = Example questions
example-questions-explanation-1 = You can find <examplePromptsLink>120 example prompts in this sheet.</examplePromptsLink>
example-questions-explanation-2 = If you’d like to submit a tranche of questions for ingestion, you <githubLink>can do so via our GitHub</githubLink> or email your list to <emailFragment>commonvoice@mozilla.com.</emailFragment>

## Spontaneous Speech sidebar content

# Answer Questions 
answer-questions = Answer Questions
answer-questions-explanation-1 = Think for a moment about the prompt, consider what kind of thing you’d like to say, but don’t script yourself too much. Click the ‘record’ icon. Once you’ve recorded you can listen to yourself, re-record, delete or submit. 
answer-questions-explanation-2 = Remember - don’t worry if you stutter, pause or repeat a word. This is all useful data for engineers trying to build inclusive, real-world speech recognition tools. 
answer-questions-tip-1 = Record in a reasonably quiet place 
answer-questions-tip-2 = Choose somewhere with a good internet connection
answer-questions-tip-3 = Keep your response to 15 seconds
answer-questions-tip-4 = Avoid hateful, inflammatory or otherwise offensive speech
answer-questions-tip-5 = Speak naturally, as you would with a friend - use your own real variant, dialect and accent
answer-questions-tip-6 = Keep your volume consistent - don’t shout or sing

# Transcribe the Audio
transcribe-the-audio = Transcribe the Audio
transcribe-the-audio-subheader-1 = General guidance
transcribe-the-audio-subheader-2 = Numbers and acronyms
transcribe-the-audio-subheader-3 = Special Tags
transcribe-the-audio-subheader-4 = Word segements, false starts, repeated words
transcribe-the-audio-subheader-5 = Grammatical mistakes and colloquialisms
transcribe-the-audio-subheader-1-explanation = In general, you should write down everything you hear. This includes;
transcribe-the-audio-subheader-1-explanation-example-1 = Writing down disfluencies, including hesitations and repetitions 
transcribe-the-audio-subheader-1-explanation-example-2 = Labeling noise events like coughing or laughing
transcribe-the-audio-subheader-1-explanation-example-3 = Labeling significant noise pollution, like background chatter or car horns
transcribe-the-audio-subheader-1-explanation-example-4 = Grammatical variation and slang should be recorded exactly as it occurs. Do not correct or edit people’s speech. 
transcribe-the-audio-subheader-2-explanation-1 = Numbers and symbols should be spelled out in words rather than using numerals or special characters. Example:
transcribe-the-audio-subheader-2-explanation-2 = Acronyms should be written as they are normally written in the language, following standard capitalization rules. They should not be transcribed phonetically. Example:
# text wrapped in correct will be shown as green text in the UI
transcribe-the-audio-subheader-2-example-1-correct = <correct> Correct</correct>: It’s one hundred miles away from here
# text wrapped in wrong will be shown as red text in the UI
transcribe-the-audio-subheader-2-example-1-wrong = <wrong>Wrong</wrong>: It’s 100 miles away from here
# text wrapped in correct will be shown as green text in the UI, text wrapped in underline will be underlined in the UI
transcribe-the-audio-subheader-2-example-2-correct = <correct> Correct</correct>: See you in <underline>twenty fifteen</underline>
# text wrapped in wrong will be shown as green text in the UI, text wrapped in underline will be underlined in the UI
transcribe-the-audio-subheader-2-example-2-wrong = <wrong>Wrong</wrong>: See you in <underline>2015</underline>
transcribe-the-audio-subheader-2-example-3-correct = <correct>Correct</correct>: It was twenty per cent off
transcribe-the-audio-subheader-2-example-3-wrong = <wrong>Wrong</wrong>: It was 20% off
transcribe-the-audio-subheader-2-example-4-correct = <correct>Correct</correct>: They were arrested by the <underline>FBI</underline> last Thursday
transcribe-the-audio-subheader-2-example-4-wrong = <wrong>Wrong</wrong>: They were arrested by the <underline>eff bee eye</underline> last Thursday
transcribe-the-audio-subheader-3-explanation = The following special tags should be used to mark disfluencies, fillers and other types of non-verbal content.
tags-table-header-1 = Tag
tags-table-header-2 = Meaning
tags-laugh = Laugh
tags-disfluency = Disfluency
tags-unclear = Unclear
tags-noise = Noise
tags-laugh-explanation = The sound of laughter.
tags-disfluency-explanation =
    A filler word or sound used as a placeholder whilst a speaker decides what to say.
    In English, some common hesitation sounds are “err”, “um”, “huh”, etc.
tags-unclear-explanation = A word or sequence of words that cannot be understood.
tags-noise-explanation =
    Any other type of noise, such as the speaker coughing or clearing their throat,
    a car honking, the sound of something hitting the microphone, a phone buzzing, etc.
special-tags-example = And then I [noise] went on holiday.
    Well, [noise] [laugh] it wasn’t exactly a holiday [laugh]
transcribe-the-audio-subheader-4-explanation-1 = Spontaneous Speech naturally contains false starts where only a fragment of a full word is produced. For these instances, please transcribe to the best of your ability the word fragment and attach a hyphen at the end of the word (-) to indicate the word is a false start. Example:
transcribe-the-audio-subheader-4-explanation-1-example = His name is <underline>Jo- Jona-</underline> Jonathan.
transcribe-the-audio-subheader-4-explanation-2 = Sometimes speakers will repeat a word or word fragment multiple times. This should be transcribed too. Example:
transcribe-the-audio-subheader-4-explanation-2-example = And then I went to <underline>the the the bed- the</underline> bedroom
transcribe-the-audio-subheader-5-explanation-1 = Spontaneous Speech will naturally contain grammatical mistakes. These should not be corrected when transcribing. The transcription should reflect the spoken content exactly.
transcribe-the-audio-subheader-5-explanation-2 = Speakers may use colloquialisms (such as, in English, “gonna”, “cuz”, etc.) which may not be considered formally correct. These should be transcribed as they are, and not changed to their more formal equivalents.

## Review the Transcription
review-the-transcription = Review the Transcription
review-the-transcription-explanation-1 = In general, we advise that the person who checks the transcription should not be the same person who did the original transcription. It is very hard to check your own work! Having multiple lines of review can help make quality assurance more robust, and help mitigate biases and issues.
review-the-transcription-explanation-2 = Review the transcription guidelines above in order to check that a transcription is accurate. You can provide edits and submit them.
review-the-transcription-explanation-3 = Again, you can flag content that is offensive, harmful or otherwise worrying, and it will be removed from your experience until the Common Voice team can review it and investigate further.

## Code-Switching 
code-switching= Code Switching
adding-a-question = Adding a Question

# Adding a Question
code-switching-adding-question-subheader = What makes a good question?
code-switching-adding-question-explanation = A good question for public participation datasets should:
code-switching-adding-question-criteria-1 = Be easy to understand and respond to
code-switching-adding-question-criteria-2 = Be generally relevant
code-switching-adding-question-criteria-3 = Not use, or solicit, harmful or offensive language
code-switching-adding-question-note = You might also want to consider spanning different contexts and domains.

# What types of questions to add
code-switching-types-subheader = What types of questions to add?
code-switching-use-bilingual-prompts-header = Use Bilingual Prompts
code-switching-use-bilingual-prompts-explanation = Use bilingual prompts that incorporate both languages in your question: Example:
code-switching-use-bilingual-prompts-explanation-example = “¿Qué te dijo tu mamá when you got home that day?”
code-switching-ask-bilingual-contexts-header = Ask About Bilingual Contexts
code-switching-ask-bilingual-contexts-explanation = Use situations where both languages are commonly used (e.g., home, school, community events). Example:
code-switching-ask-bilingual-contexts-explanation-example = “When you talk to your cousins, do you mix Spanish and English?”
code-switching-focus-emotional-header = Focus on Emotional or High-Stakes Moments
code-switching-focus-emotional-explanation = People often codeswitch when expressing emotion or urgency. Example:
code-switching-focus-emotional-explanation-example = “Tell me what your parents said when you told them your big news — exactly how they said it.”
code-switching-direct-quotes-header = Ask for Direct Quotes or Reenactments
code-switching-direct-quotes-explanation = Encourage participants to reproduce how things were actually said. Example:
code-switching-direct-quotes-explanation-example = “What were your exact words when you found out?”
code-switching-cultural-topics-header = Choose Culturally Specific Topics
code-switching-cultural-topics-explanation = Food, traditions, holidays, and family dynamics often invite codeswitching.
code-switching-cultural-topics-explanation-example = “How do you describe Día de los Muertos to someone who only speaks English?”
code-switching-informal-scenarios-header = Explore Informal Scenarios
code-switching-informal-scenarios-explanation = Conversations with friends or texting often include more natural switching. Example:
code-switching-informal-scenarios-explanation-example = “What’s a joke your friends always make — and how do they say it?”

# What to Avoid
code-switching-avoid-subheader = What to Avoid
code-switching-avoid-intro = Questions that might:
code-switching-avoid-1 = Solicit personally identifiable information
code-switching-avoid-2 = Solicit hate speech or other biased or offensive sentiments
code-switching-avoid-3 = Cause someone to share sensitive, potentially triggering responses
code-switching-dont-header = Don’t
code-switching-dont-1 = Don’t use overly formal language

# Reviewing a Question
code-switching-review-subheader = Reviewing a Question
code-switching-review-intro = Ensure the question meets the criteria:
code-switching-review-criterion-1 = Be easy to understand and respond to
code-switching-review-criterion-2 = Be generally relevant
code-switching-review-criterion-3 = Not use, or solicit, harmful or offensive language
code-switching-review-does-not-header = And <bold>DOES NOT</bold> include:
code-switching-review-offensive-content = <bold>Offensive content or sensitive information</bold>
code-switching-answer-header = Offensive content or sensitive information
code-switching-review-no-1 = Questions which might solicit personally identifiable information
code-switching-review-no-2 = Questions which might solicit hate speech or other biased or offensive sentiments
code-switching-review-no-3 = Questions which may cause someone to share sensitive, potentially triggering responses

# Answering a Question
code-switching-answer-subheader = Answering a Question
code-switching-answer-intro = When responding to a question, the goal is to respond naturally – just like you would in a real-life conversation. We want to capture how languages actually mix in everyday speech.
code-switching-answer-bullet-1 = Think of real-life moments or situations: jokes, arguments, traditions
code-switching-answer-bullet-2 = Imagine you’re texting a friend or telling someone a story
code-switching-answer-bullet-3 = Use words you would actually use, even if borrowed or mixed
code-switching-answer-bullet-4 = There is no “perfect” way to answer

code-switching-authentic-header = Answer Naturally and Authentically
code-switching-authentic-speak = <bold>Speak how you would with friends or family.</bold> If you mix languages in real life, do the same here. Example:
code-switching-authentic-speak-example = “Pues I told her I couldn’t go, but she was like, ‘You better show up!’”
code-switching-use-both-languages = <bold>Use both languages if that’s how you would normally say it.</bold> Even switching just a word or two is useful. Example:
code-switching-use-both-languages-example = “She got really mad porque I didn’t call her back.”
code-switching-authentic-direct-quotes = <bold>Include direct quotes or dialogue.</bold> Say exactly what someone said, not a cleaned-up or formal version. Example:
code-switching-authentic-direct-quotes-example = “Mi mamá dijo, ‘Tú crees que esto es un juego?’ and I was like, ‘Okay chill!’”
code-switching-authentic-reflect = <bold>Reflect emotion, identity, and context.</bold> Switching usually happens when people express emotion, urgency, or cultural ideas. Lean into these when answering questions.
code-switching-authentic-full-context = <bold>Use full responses with context.</bold> Be as detailed as possible, giving as much detail as you can. Share a story or example in your answers.

# Don’t Overthink or Overedit
code-switching-answer-dont-subheader = Don’t Overthink or Overedit
code-switching-answer-dont-correct-language = <bold>“Correct” your language.</bold> This isn’t a test. “Proper” form doesn’t matter here, natural language does.
code-switching-answer-dont-avoid-switching = <bold>Avoid switching if you normally do it.</bold> It’s fine to switch mid-sentence, mid-thought, or just for one word.
code-switching-answer-dont-formal-writing = <bold>Speak like you’re writing formally.</bold> Avoid formal, academic answers. Keep it conversational.
code-switching-answer-dont-force-switch = <bold>Force switching if it’s not natural.</bold> Only switch if that’s how you would naturally talk in that situation.
code-switching-answer-dont-translate-repeat = <bold>Translate or repeat everything.</bold> Just say it once, the way it would come in a conversation. You don’t have to say a version of the response in each language.


# Transcribing
code-switching-transcribe-subheader = Transcribing
code-switching-transcribe-intro = When transcribing responses that include codeswitching, represent the speaker’s language as it was spoken – without correcting, editing, or simplifying. This is for all switches between languages, informal speech, and mixed-language words.
code-switching-transcribe-do-1 = Play short segments multiple times to catch subtle switches
code-switching-transcribe-do-2 = Pause after every sentence to double-check for switches or mixed words

# Capture Speech Exactly as Spoken
code-switching-capture-header = Capture Speech Exactly as Spoken
code-switching-capture-explanation = Transcribe both languages as they appear / sound. Don’t “fix” the language or change it to only one language.

# Include filler words and markers
code-switching-filler-header = Include filler words and markers
code-switching-filler-explanation = Words like “um,” “like,” “pues,” “you know,” and “entonces” are meaningful. Example: “So, um, I told her like, ‘pues no sé, maybe later.’”

# Use standard spelling for each language
code-switching-spelling-header = Use standard spelling for each language
code-switching-spelling-explanation = Try to spell words correctly for each language, unless the speaker clearly pronounces them in a nonstandard way.

# Don’t Clean Up or Simplify the Language
code-switching-cleanup-header = Don’t Clean Up or Simplify the Language
code-switching-cleanup-1 = Translate or paraphrase – write what the speaker said, not what they “meant.”
code-switching-cleanup-2 = “Correct” grammar or pronunciation – keep the speaker’s natural use.
code-switching-cleanup-3 = Skip switches that seem minor or small – even borrowed words matter.
code-switching-cleanup-4 = Insert punctuation that could change the meaning – keep the flow natural.
code-switching-cleanup-5 = Assume you know the language of every word – tag based on usage.

# Tagging
code-switching-tagging-subheader = Tagging
code-switching-tagging-error-intro = If the transcription contains an error, please use the report function to flag it. Potential errors include:
code-switching-tagging-error-1 = Incorrect punctuation or capitalization
code-switching-tagging-error-2 = Typos
code-switching-tagging-error-3 = Words written in the wrong orthography

# Using Correct Orthography for Each Language
code-switching-orthography-header = Using Correct Orthography for Each Language
code-switching-orthography-explanation = Write each word according to the spelling of the language it’s from. For example: 
code-switching-orthography-explanation-example-1 = If the word “kitchen” appears pronounced as in Spanish, it should be written as in English, not as “quichen.”
code-switching-orthography-explanation-example-2 = If the word quinceaños is pronounced as in English, write it with the ñ.

# Use Pronunciation to Help Determine the Language
code-switching-pronunciation-header = Use Pronunciation to Help Determine the Language
code-switching-pronunciation-explanation = Some words might look the same in both languages but could be pronounced differently.  Listen to the pronunciation to help tag correctly.  For example: cable, taco, actor, detective.
code-switching-pronunciation-explanation-example-1 = English: /ˈkeɪ.bəl/
code-switching-pronunciation-explanation-example-2 = Spanish: /ˈkable/

# Tagging in a Single Token
code-switching-single-token-header = Tagging in a Single Token
code-switching-single-token-explanation = A single space-separated token should contain more than one tagged span.

# Tag Punctuation Based on Nearby Language
code-switching-punctuation-tagging-header = Tag Punctuation Based on Nearby Language
code-switching-punctuation-tagging-explanation = Tag punctuation using the language closest span to the left. Examples:
# text wrapped in purple and blue will be shown with a purple and blue background in the UI respectively
code-switching-punctuation-tagging-explanation-example-1 = <purple>and the one time that</purple> Maria <purple>screamed at me was</purple> <blue>porque</blue> <purple>she was trying to to</purple> printear <blue>un</blue> <purple>order.</purple> (BangorTalk)
code-switching-punctuation-tagging-explanation-example-2 = <purple>but</purple> <blue>tú los puedes comprar rojo, negro, azul</blue>, <purple>whatever.</purple> (BangorTalk)

# Be Careful with Lookalikes
code-switching-lookalikes-header = Be Careful with Lookalikes
code-switching-lookalikes-explanation = Some words may look like one language but are used in the other. Tag based on meaning and usage, not appearance. Examples:
code-switching-lookalikes-explanation-example-1 = “Footing” used to mean running in Spanish > tag as Spanish
code-switching-lookalikes-explanation-example-2 = “No problemo” used in English > tag as English

# When Not to Tag Words
code-switching-not-tag-header = When Not to Tag Words
code-switching-not-tag-explanation = Some words should <bold>not be tagged</bold> with a language label, even if they seem mixed or adapted.  Here’s how to handle some examples:
code-switching-not-tag-proper-names = <bold>Proper Names.</bold> Names of people, places, and organisations should not be tagged. Examples:
code-switching-not-tag-proper-names-example-1 = People: Maria, John
code-switching-not-tag-proper-names-example-2 = Places: Los Angeles, Florida
code-switching-not-tag-proper-names-example-3 = Brands/Organisations:  Target, Burger King

code-switching-not-tag-mixed-words = <bold>Mixed or Morphologically-Adapted Words.</bold> Do not tag words that blend languages or have added endings from another language. Examples:
code-switching-not-tag-mixed-words-example = Where a root is English but the suffix is Spanish: “parkear”, “printearlo”
code-switching-not-tag-interjections = <bold>Interjections.</bold> Interjections and filler words, regardless of language, should remain <bold>untagged.</bold> Examples: 
code-switching-not-tag-interjections-example-1 = "Eh”
code-switching-not-tag-interjections-example-2 = “No”
code-switching-not-tag-interjections-example-3 = “Yeah”
code-switching-not-tag-interjections-example-4 = “Er”

## Reporting Content
reporting-content = Reporting Content
reporting-content-explanation-1 = You must flag content that is offensive, harmful or otherwise worrying. It must also include no personally identifying information like phone numbers or addresses. It will be removed from your experience until the Common Voice team can review it and investigate further.
reporting-content-explanation-2 = To report content, select the “Report” button and choose one or all options: Offensive Content, Different language, Personally Identifiable Information, Other.  From here, provide more details about why you are reporting the content in the text area.  Then, submit the Report by clicking on the Report button. 
