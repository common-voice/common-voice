action-click = Теуэ
action-tap = Iусэ
contribute = Хэгъахъуэ
skip = Блэк1
shortcuts = Теуэ зэгуэт
clips-with-count-pluralized =
    { $count ->
        [one] пычы
       *[other] пычыу
    }
contribute-more =
    { $count ->
        [one] Ухьэзыр иджыри птыну?
       *[other] Ухьэзыр иджыри птыну?
    }
record-button-label = Уи макъ егъэтх

## Reporting

report = Iуатэ
report-title = Iуатэ егъэхь
report-offensive-language = Хъуэн псалэ
report-grammar-or-spelling = Грамэр / орфограф щыуагъэ
report-different-language = Нэгъэщ бзэ
report-difficult-pronounce = БгъэIуэну гугъущ
report-offensive-speech = Хъуэн псалэ
report-offensive-speech-detail = Тхам хъуэн, пщ1эм еуэ псалъэ хэтщ
report-other-comment =
    .placeholder = ЩIэтхэ
continue = АдэкӀэ
report-success = Хьэзыр хъащ

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = с

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = р
shortcut-record-toggle-label = Тхы/ув
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Пычыгъуэр щӀэу тхыж
shortcut-discard-ongoing-recording = ESC
shortcut-submit = Гъэзэж
request-language-text = Зэк1э уи бзэр Common Voice-м хэту плъагъукъэ?
request-language-button = Бзэм щӀэупщӀ

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = п
shortcut-play-toggle-label = Гъэ1у/Ув
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = й
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = н

## Validation criteria

contribution-misreadings-title = Misreadings
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
