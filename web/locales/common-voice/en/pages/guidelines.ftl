# GUIDELINES PAGE
guidelines-header = Contribution Guidelines
guidelines-header-subtitle = Understand how to contribute and validate on the Common Voice dataset
voice-collection = Voice Collection
sentence-collection = Sentence Collection
question-collection = Question Collection
scripted-speech = Scripted Speech
spontaneous-speech = Spontaneous Speech

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

## Code switching
code-switching = Code Switching

code-switching-do-subheader-title = Do:
code-switching-do-not-subheader-title = Do Not:
code-switching-adding-questions-do-guidelines-1 = <bold>Use Correct Spelling and Grammar:</bold> Ensure that your questions are free from typos and grammatical errors to maintain clarity.
code-switching-adding-questions-do-guidelines-2 = <bold>Choose Simple Questions:</bold> Formulate questions that are straightforward and easy to understand for a diverse audience. Avoid jargon or complex language that might confuse respondents.
code-switching-adding-questions-do-guidelines-3 = <bold>Keep It Concise:</bold> Design questions that can be answered in a few sentences, allowing for spontaneous and natural responses.

code-switching-adding-questions-do-not-guidelines-1 = <bold>Solicit Personal Information:</bold> Avoid questions that ask for names, addresses, or any financial details that could identify individuals.
code-switching-adding-questions-do-not-guidelines-2 = <bold>Express Prejudice:</bold> Steer clear of questions that could be seen as offensive or discriminatory towards any group.
code-switching-adding-questions-do-not-guidelines-3 = <bold>Ask Sensitive Questions:</bold> Refrain from inquiring about topics that could make respondents uncomfortable, such as personal trauma or controversial issues.

code-switching-validating-questions = Validating Questions
code-switching-validating-questions-explanation-1 = <bold>Review for Clarity:</bold> Before finalizing your questions, ensure they are clear and unambiguous. Ask yourself if someone from a different background would understand them.
code-switching-validating-questions-explanation-2 = <bold>Seek Feedback:</bold> If possible, have peers review your questions to catch any potential issues or misunderstandings.

code-switching-answering-questions = Answering Questions
code-switching-answering-questions-explanation-1 = <bold>Be Authentic:</bold> When responding, aim for naturalness in your speech. Don’t worry about being perfect; the goal is to capture genuine conversation.
code-switching-answering-questions-explanation-2 = <bold>Use Your Own Words:</bold> Feel free to express your thoughts in a way that feels comfortable to you, even if it means deviating slightly from the question.

code-switching-transcribing-audio-questions = Transcribing Audio from Questions
code-switching-transcribing-audio-questions-explanation-1 = <bold>Listen Carefully:</bold> Pay close attention to the audio before transcribing to ensure accuracy.
code-switching-transcribing-audio-questions-explanation-2 = <bold>Transcribe Verbatim:</bold> Write down exactly what is said, including any natural disfluencies, pauses, or filler words. This helps maintain the authenticity of spontaneous speech.

code-switching-review-transcriptions = Reviewing Transcriptions
code-switching-review-transcriptions-explanation-1 = <bold>Check for Accuracy:</bold> After transcribing, review your work to ensure it reflects the audio accurately. Look for any missed words or misinterpretations.
code-switching-review-transcriptions-explanation-2 = <bold>Edit for Clarity:</bold> If necessary, make minor adjustments to improve readability without altering the original meaning.

code-switching-explanation-1 = <bold>Embrace Diversity:</bold> If you notice code switching in the responses, embrace it! This reflects the natural way people communicate in multilingual environments.
code-switching-explanation-2 = <bold>Document Instances:</bold> When transcribing, make a note of any instances of code switching, as they can provide valuable insights into language use.
code-switching-explanation-3 = By following these guidelines, you will help create a rich and diverse dataset that reflects the beauty of spontaneous speech. Thank you for your contributions to Common Voice!

## Reproting content
reporting-content = Reporting Content
reporting-content-explanation-1 = You must flag content that is offensive, harmful or otherwise worrying. It must also include no personally identifying information like phone numbers or addresses. It will be removed from your experience until the Common Voice team can review it and investigate further.
reporting-content-explanation-2 = To report content, select the “Report” button and choose one or all options: Offensive Content, Different language, Personally Identifiable Information, Other.  From here, provide more details about why you are reporting the content in the text area.  Then, submit the Report by clicking on the Report button. 
