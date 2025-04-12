action-click = nit va
action-tap = mɔt va
contribute = limɓembe
review = liɓákɛ́
skip = liloo
shortcuts = lisɛ́manɛ
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold>  epah
       *[other] <bold>{ $count }</bold> bipah
    }
goal-help-recording = Anyuú yáná common voice a yal <goalPercentage></goalPercentage> nsɔ́n wɛɛ ɔlɔ́ á { $goalValue } linyɔŋ-lí-cíŋ !
goal-help-validation = Anyuú yáná common voice a yal  <goalPercentage></goalPercentage> nsɔ́n wɛɛ ɔlɔ́ á { $goalValue } liyeɓe !
contribute-more =
    { $count ->
       *[other] ɔg somoo liɓɔŋ { $count } sig pɛ ?
    }
speak-empty-state = Bi byɛ́ɛ́ ɓe pɛ ɓɛhɛ akwɛla á linyɔŋ mú á nyu mpɔ́t
no-sentences-for-variants = Eceg yá, mpɔ́t wáná ah byɛɛ ɓé pɛ́ akwɛla ! kiyaɓɛnɛ́ minig diŋ, miní lɛ nɛ́ maná veŋhanɛ́ mitiŋ anyuú lipamɛ́ lí akwɛla ntám á mpɔ́t wáná
speak-empty-state-cta = litii li akwɛla
speak-loading-error = Baá la ɓeɓɛhɛ likuh'la li akwɛla á ciŋ . cegéé pɛ́ váŋ vɔŋɔ.
record-button-label = linyɔŋ li cíŋ
share-title-new = <bold>Oŋganɛ́ ɓɛhɛ</bold> á likɔt lí cíŋ ɛ péna
keep-track-profile = Mɛn mbieleg yɔɔ la liveg l' ediŋgɛ-diŋgɛ
login-to-get-started = Anyuú liɓot'le,  niŋgii va tɔnɛ́ wɛɛle va
target-segment-first-card = Ɔ lɛ lisál anyuú ejo yáhá nsɔ́n ɔsú
target-segment-generic-card = Bitɛɛhɛnɛ́ á ejo ɛ nsɔ́n
target-segment-first-banner = Oŋganɛ́ ɓɛ́hɛ́ liveg l' ejo nsɔ́n ɔsú yé Common Voice a { $locale }
target-segment-add-voice = tí ɓɛhɛ ciŋ yɔɔ
target-segment-learn-more = Ngondye li yí
change-preferences = pɔhɔ́ɔ́ nyí ɔ ngɔ diŋ
login-signup = liniŋgíí / likat'ɓan
vote-yes = Ɔɔ
vote-no = Kɛ́m
datasets = Micaa la lisaŋgó
languages = mimpɔ́t
about = Anyuú
partner = Yum
submit-form-action = lióm

## Reporting

report = liyihɛ
report-title = lióm lí ndag'le
report-ask = yɔyɔ́ɔ njɔm ɔkwɛla vi byɛ́ɛ́ ?
report-offensive-language = Biɓaŋgá bí ɓé ?
report-offensive-language-detail = Ɔkwɛla ví byɛɛ mióó ?
report-grammar-or-spelling = Tɔnɛ váh ciiɓɛɛ ɓé mɓɛɛŋ
report-grammar-or-spelling-detail = Ɔkwela váh ciiɓɛɛ ɓe mɓɛɛŋ tɔnɛ váh oŋg'ɓɛɛ ɓe mɓɛɛŋ
report-different-language = Mpɔ́t ntám
report-different-language-detail = Ɔkwɛla vá ciiɓɛɛ á mpɔ́t nyú mi ngá yí ɓe ma
report-difficult-pronounce = ndutu á lipaaháa
report-difficult-pronounce-detail = Biɓaŋgá byá tɔnɛ́ akwɛla wa á lɛ ndutu lipáháa
report-offensive-speech = Biɓaŋgá bí ɓé
report-offensive-speech-detail = Nyí cíŋ mpɔ́t ɛ byɛɛ mɓé - anyu
report-other-comment =
    .placeholder = nkwɛl
success = mam mí lɛ mɓɛɛŋ
continue = likɛ l' ɔsú
report-success = Ndag'le ya yomɓɛ́ɛ

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = a

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = e
shortcut-record-toggle-label = Pɔ́t/Byéé
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Ɓot'lé sig pɛ
shortcut-discard-ongoing-recording = Sɛ́m
shortcut-discard-ongoing-recording-label = licóó li cíŋ mpɔ́t ɛ lɛ linyɔŋɓɛɛ
shortcut-submit = miniŋg'lé
shortcut-submit-label = Lióm lí ciŋ ɛ pɔt
request-language-text = mpɔ́t wɔ́ɔ a lɛ ngili ɓɛ́ mu ?
request-language-button = tí mpɔt ɔ ngɔ somoo

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Sɔ́ŋgɔ́ɔ́/tɛɛyɛ́ɛ́
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = o
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Bitɛɛyene
contribution-criteria-link = Lisɔ́ŋtanɛ li bitɛɛyene bí ngaɓo
contribution-criteria-page-title = Bitɛɛyene bi ngaɓo
contribution-criteria-page-description = Amb'lán yéé ɛ lɛ nsɛ́ŋ la yé toɓotoɓo a mpɔt á ciŋ á liɓɔŋ nɛ́ mɛ́nɛ́ ki mini nyɛɛɓɛɛ mpɔ́t wana cíŋ
contribution-for-example = Kaa ɔvega
contribution-misreadings-title = ah sɔŋgɔ́ɔ ɓe mɓɛɛŋ
contribution-misreadings-description = Aceg mini ngá amb'le, ɓɛ́an mbaki nɛ́: yom ya pɔ́tbɛ́ɛ yɔ́ nɛ́ yá ciiɓɛɛ; minih yebyag ɓé avuha. <br />akaa nyú :
contribution-misreadings-description-extended-list-1 = Puh biɓaŋga <strong>«ya»</strong> tɔnɛ <strong>«ya/wa» <stong> á mí linyɔŋ li mpɔ́t á ciŋ.
contribution-misreadings-description-extended-list-2 = Tɔnɛ <strong>« s »</strong> á lisúk l' eɓaŋga.
contribution-misreadings-description-extended-list-3 = Miketee mikɔtán mí biɓaŋga bisɛ míg pálɛ́ɛ kaa «Mbaki»
contribution-misreadings-description-extended-list-4 = Eɓaŋgá misúg'lé ya sɛmi anyuú nɛ́ wa vóó lisɛ́m
contribution-misreadings-description-extended-list-5 = Cegéé lisɔ́ŋgɔ́ɔ l' eɓaŋgá ngele ngandag
contribution-misreadings-example-1-title = Kɔ́ɔ́ cɛ́ŋ lipand
contribution-misreadings-example-2-title = Kɔ́ɔ́ ɛ cɛ́ŋ ɛ Lipand
contribution-misreadings-example-2-explanation = [ A lɛ «Kɔ́ɔ» ɛ cɛ́ŋɛ́]
contribution-misreadings-example-3-title = Kɔ́ɔ́ ɛ cɛ́ŋɛ́ ɛ lipa-.
contribution-misreadings-example-3-explanation = [Eɓaŋgá ya sɛ́mɓɛ́ɛ yi kaganɛ́ ɛg man]
contribution-misreadings-example-4-title = Kɔ́ɔ́ ɛ cɛ́ŋɛ́ ɛ lipand
contribution-misreadings-example-4-explanation = [Kaa nyu mpɔ́t á cíŋ wá nyɔŋ'ɓɛɛ mɓɛɛŋ]
contribution-misreadings-example-5-title = Nzamɛ laám
contribution-misreadings-example-6-title = Nzamɛ laám
contribution-misreadings-example-6-explanation = [eg nyɛ liɓɛ́ «laám»]
contribution-misreadings-example-7-title = Nzamɛ ɛ laám
contribution-misreadings-example-7-explanation = [eɓaŋgá «ɛ» ɛ́ ngá pahlɛ́ɛ ɓé á ɔkwɛla v'ɔsú]
contribution-misreadings-example-8-title = Ngoo ya kɛ́
contribution-misreadings-example-8-explanation = [nkwɛl ngila ndag'le]
contribution-varying-pronunciations-title = mveŋhanɛ́ a cíŋ
contribution-varying-pronunciations-description = Nyɔŋán eceg sɔkaganɛ́ miníg kááhɛ́ɛ cíŋ ɛ mpɔ́t ɛ Mut nɛ́ ah pɔt ɓé mɓɛɛŋ tɔnɛ́ ah pɔ́t ɓé kaa ɛ ngáa ɓat; anyuú nɛ́ mipɔ́tɔ́g mi lɛ́ nyaa nyaa, ɛ lɛ nɛ́ yá ɓɛ́ nɛ́ lipɔ́tɔ́g jɛ́ɛ́ ɔ ngɔ́ yí ɓé jɔ́ tɔnɛ́ ɔ lɛ ngi jɔ́ liámb'lé. Jɔnɛ, yí nɛ́ ɓot bisɛ́ bí ngá pɔt ɓé káa wa.
contribution-varying-pronunciations-description-extended = Ndi ki wa ɛ́n nɛ́ ki Mut a nga sɔ́ŋgɔ́ɔ a ngá yí ɓe nyúŋ mpɔ́t , ɔ lɛ nɛ́ wa ɓén nyúŋ mpɔ́t á ciŋ.
contribution-varying-pronunciations-example-1-title = Cíŋ ɛ ngá tɔmb ɓé liɓɛgɛɛ lí ŋmú
