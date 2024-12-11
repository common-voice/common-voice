action-click = Tanuy
action-tap = Akray
contribute = Yanapay
review = Kutipay
skip = Pintiy
shortcuts = Shortcuts
clips-with-count-pluralized =
    { $count ->
        [one] Clip
       *[other] Clips
    }
goal-help-recording = Common Voice { $goalValue }pita  <goalPercentage></goalPercentage>man chaananpaq yanaparqayki!
goal-help-validation = Common Voice { $goalValue }pita  <goalPercentage></goalPercentage>man chaananpaq yanaparqayki!
contribute-more =
    { $count ->
        [one] Kamakashqaku kaykanki { $count } ashwanta ruranaykipaq?
       *[other] Kamakashqaku kaykanki { $count } ashwanta ruranaykipaq?
    }
speak-empty-state = Kay shimichaw rimanapaq rimaykuna ushakashqana...
no-sentences-for-variants = ¡Markashimiykiqa manapischi shimiyuqchu kanman! Munashqaykimannaw, markashimiykipa huk rimayninkunata rikanaykipaqmi akrankiman.
speak-empty-state-cta = Ashwan rimaychakunata qillqar yanapakuy
speak-loading-error =
    Manami ima rimaytapis rimanaykipaq tariyta atiyaachu. 
        Qipaman kutiykur kallpachakuy.
record-button-label = Kunka rimayniykiwan rimay
share-title-new = <bold>Yanapayaamay</bold> ashwan kunka rimaykunata tariyaanapaq
keep-track-profile = Qillqakamachiy ñawpaman purishqaykita rikanaykipaq
login-to-get-started = Yaykuy icha qillqakuy qallariypaq
target-segment-first-card = Ñawpa kaq taqaakunachaw yanapakuykanki
target-segment-generic-card = Taqaakunachaw yanapakuykanki
target-segment-first-banner = Common Voicepa ñawpa kaq taqan kamayta yanapakuy { $locale } nishqanchaw
target-segment-add-voice = Kunka rimayniykita yapay
target-segment-learn-more = Ashawan willa
change-preferences = Munashqakunata hukman trukachiy
login-signup = Yaykuy / Qillqakuy
vote-yes = Aw
vote-no = Mana
datasets = Datasets
languages = Shimikuna
about = Kaypita
partner = Masi
submit-form-action = Apachiy

## Reporting

report = Willakuy
report-title = Willakuyta apachiy
report-ask = Rimaychachaw, ¿imataq mana allichu kaykan?
report-offensive-language = Ashllikuq shimi
report-offensive-language-detail = Chay rimaychaqa ashllikuq shimiyuqmi.
report-grammar-or-spelling = Pantashqa qillqayyuq
report-grammar-or-spelling-detail = Chay rimaychaqa pantashqa qillqayyuqmi.
report-different-language = Huk shimi
report-different-language-detail = Manami rimashqaa shimichawchu qillqashqa kaykan.
report-difficult-pronounce = Sasa pashtachiymi
report-difficult-pronounce-detail = Sasa ñawinchanapaq icha sasa pashtachinapaq shimikuna icha rimaykunami kan.
report-offensive-speech = Ashllikuq rimay
report-offensive-speech-detail = Chay rimaychawqa ashllikuq shimikunami kaykan.
report-other-comment =
    .placeholder = Rimakuy
success = Allimi
continue = Qatiy
report-success = Chay willakuyqa chaskishqanami

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = p

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Record/Stop
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Re-record clip
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Illakaachiy
shortcut-submit = Kutiy
shortcut-submit-label = Kunka rimaykunata apachiy
request-language-text = ¿Manaraqku shimiykita Common Voicechaw rikanki?
request-language-button = Huk shimita mañakuy

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Play/stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = a
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = m

## Validation criteria

contribution-criteria-nav = Yuyaykuna
contribution-criteria-link = Yanapakuy yuyaykunapita ashwanta yachakuy
contribution-criteria-page-title = Yanapakuy yuyaykuna
contribution-criteria-page-description = ¡Kunka rimaykunata wiyar ima ashinaykita ashwan yachakuy, kikiykipa kunka rimayniykita imanaw allichanaykipaqpis yachakuy!
contribution-for-example = kaynaw
contribution-misreadings-title = Pantashqa kaayiykuna
contribution-misreadings-description = Wiyarqa, rimashqawan qillqashqa tikushqanta shumaq allilla rikapay; rimashqawan qillqashqa mana tinkuptinqa ama awniychu. <br />Wakin pantaykunaqa kaynawmi kayan:
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
contribution-varying-pronunciations-description = Huk niraq pashtachiyta wiyarqa rasllaqa manami kay allichu nishpa niychu. Huk shimitaqa imayka laayapami pashtachiyanman, markaykichaw manapischi huk niraq pashtachiykunata wiyashqaykichu. Chayqa huk niraqpa pashtachiyaptinpis, rimayashqanta tantiyaptiykiqa, awniykuy.
contribution-varying-pronunciations-description-extended = Ichanqa ñawinchaq chay shimita riqinmanchu, llutanta pashtachiykanmanpis, chayqa ama awniychu. Mana yacharqa pitiyta tanuy.
contribution-varying-pronunciations-example-1-title = On his head he wore a beret.
contribution-varying-pronunciations-example-1-explanation = [‘Beret’ is OK whether with stress on the first syllable (UK) or the second (US)]
contribution-varying-pronunciations-example-2-title = His hand was rais-ed.
contribution-varying-pronunciations-example-2-explanation = [‘Raised’ in English is always pronounced as one syllable, not two]
contribution-background-noise-title = Qapariy wiyakan
contribution-background-noise-description = Kay software qapariykunapita yachananta munayaa. Rimayashqan shumaq wiyakaptinqa, sinchi qapariykunatapis awnishwanmi. Mana allaapa wiyakaq qutsukunapis allimi kanman, ichanqa qutsukuna sinchi wiyakashqanrayku shimikunata mana alli wiyaptiyki, chayqa manami allichu.
contribution-background-noise-description-extended = Rimayashqanta chawachiyaptin icha qapariykuna wiyakaptin, ama awniychu; ichanqa llapan rimayashqan wiyakaptinqa awniy.
contribution-background-noise-example-1-fixed-title = <strong>[Sneeze]</strong> The giant dinosaurs of the <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = The giant dino <strong>[cough]</strong> the Triassic.
contribution-background-noise-example-2-explanation = [Part of the text can’t be heard]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]</strong> giant dinosaurs of <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = Qapariy wiyakankuna
contribution-background-voices-description = Mana allaapa wiyakaq qapariykuna kaptinqa allimi, ichanqa manami chay yapashqa kunka rimaykuna softwareta pantachinanta munayaachu. Mana qillqaychaw kaq shimikunata wiyaptiykiqa, ama awniychu. Kayqa chaynaw televisiónta mana upichishqaraykumi icha rimaq runapa hiruruyninchaw hukkuna rimayashqanraykupismi.
contribution-background-voices-description-extended = Rimayashqanta chawachiyaptin icha qapariykuna wiyakaptin, ama awniychu; ichanqa llapan rimayashqan wiyakaptinqa awniy.
contribution-background-voices-example-1-title = The giant dinosaurs of the Triassic. <strong>[read by one voice]</strong>
contribution-background-voices-example-1-explanation = Are you coming? <strong>[called by another]</strong>
contribution-volume-title = Winana
contribution-volume-description = Ñawinchaqkunaqa manami chaynawlla rimaypa ñawinchayan. Qapariypa rimayashqanrayku icha allaapa upaalla rimayashqanrayku mana tantiyaptiykiqa ama awniychu.
contribution-reader-effects-title = Ñawinchaqpa rurayninkuna
contribution-reader-effects-description = Runakunaqa llapan rimaykunatami kikinkunapa kunkarimayninkunawan rimayan. Qapariypa rimayaptinpis, upaallalla rimayaptinpis icha yachapaypa rimayaptinpis awninkimanmi; ichanqa takiypa rimayaptinqa icha robotnaw rimayaptinqa ama awniychu.
contribution-just-unsure-title = ¿Mana musyarqá?
contribution-just-unsure-description = Kay kamachikuykunachaw imatapis mana tarirqa, alli yuyashqaykimannaw akray. Manaraq mayqan akrayta musyarqa, qatiqnin rimayman pintiy.
see-more = Hatunyachiy
see-less = Pishiyachiy
