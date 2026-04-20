action-click = tobwanya
action-tap = dinani
contribute = kuthandiza
review = kuunika
skip = dutsa
shortcuts = njira ya madulira
clips-with-count-pluralized =
    { $count ->
        [one] imodzi
       *[other] zambiri
    }
goal-help-recording = mwathandiza mawu ofanana kufikila<goalPercentage></goalPercentage>yapatsiku{ $goalValue }ku mulingo wake otapa mawu!
goal-help-validation = mwathandiza mawu ofanana kufikira<goalPercentage></goalPercentage>ya tsiku{ $goalValue }mulingo wotsimikiza wawo
contribute-more =
    { $count ->
        [one] okonzeka kupanga
       *[other] zambiri?
    }
speak-empty-state = tatheledwa ziganizo zoti tiike mawu muchilankhulo ichi
no-sentences-for-variants = mitundu yachilankhulo chanu  singathe kukupatsani ziganizo zonse, ngati mkotheka mutha kusintha ndi kuyetsa ziganizo zina mu chilankhulo chanu
speak-empty-state-cta = thandizila mawu
speak-loading-error = sitikutha kupeza ziganizo zoti mungalankhule. chonde yetsaniso nthawi ina
record-button-label = tepani mawu anu
share-title-new = <bold>tithandizeni </bold>>kupedza mawu ena ochuluka
keep-track-profile = londolozani mmene mukuchitira pogwiritsa nthito  chithuzi thuzi chanu
login-to-get-started = lowani kapena lembetsani kuti muyambepo kugwilitsa ntchito
target-segment-first-card = mukuthandizila mu gawo lathu loyamba mene tikufunila
target-segment-generic-card = mukusonkhezela mu gawo lathu loyambilira mene tikufunira
target-segment-first-banner = Thandizani kupanga mawu ofanana mbali yoyamba mu { $locale }
target-segment-add-voice = onjezelani mawu anu
target-segment-learn-more = phunzirani zambiri
change-preferences = sinthani mwakukonda kwanu
login-signup = lowani kapeni lembetsani ngati ndikoyamba
vote-yes = eya
vote-no = ayi
datasets = uthenga wolumikiza
languages = ziyankhulo
about = zokhuza
partner = opangila naye limodzi zinthu
submit-form-action = tumizan

## Reporting

report = kuuza
report-title = kutumiza uthenga
report-ask = Kodi ndimavuto anji omwe mukukumana nawo ndi chiganizo ichi?
report-offensive-language = mawu osayenera
report-offensive-language-detail = Chiganizo chili ndi mawu osayenera
report-grammar-or-spelling = Chiyankhulo cholakwika/ cholakwika mukalembedwe
report-grammar-or-spelling-detail = chiganizo chili ndi chiyankhulo cholakwika kapena chokwika mukalembedwe
report-different-language = chiyankhulo chosiyana
report-different-language-detail = zolembedwa mu chiyankhulo china chosiyana ndi chomwe ndimayankhula
report-difficult-pronounce = chovuta kuyankhula
report-difficult-pronounce-detail = Zili ndi mawu kapena chiganizo chovuta kuwelenga kapena kutchula
report-offensive-speech = Kuyankhula monyoza
report-offensive-speech-detail = kapenayi ali ndi mawu wolawula
report-other-comment =
    .placeholder = mawu owonjezela
success = kukwanilitsa
continue = kupitiliza
report-success = uthenga wunapelekedwa bwino

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = S

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = R
shortcut-record-toggle-label = tepani/ yimani
shortcut-rerecord-toggle = chimodzi-zisanu
shortcut-rerecord-toggle-label = tepaniso kanema
shortcut-discard-ongoing-recording = esc
shortcut-discard-ongoing-recording-label = tayani zomwe mukutepazo
shortcut-submit = kubwelera
shortcut-submit-label = kupeleka makanema
request-language-text = simunawonebe chiyankhulo chanu pa common voice
request-language-button = pemphani chiyankhulo

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = P
shortcut-play-toggle-label = sewera/ siyani
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = Y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = ndondomeko
contribution-criteria-link = mvetsetsani zofunika kupeleka
contribution-criteria-page-title = ndondomeko zofunika
contribution-criteria-page-description = Mversetsani zomwe timaona tikamaonera makanema ndi kuthandiza kuti mawu anu wotapidwawo amveke wokoma
contribution-for-example = mwachitsanzo
contribution-misreadings-title = kuwerenga molakwika
contribution-misreadings-description = tikamamvetsera, timaona bwinobwino kuti zomwe zatapidwa ndi zomwe zalembedwaso; kukana ngati pali zolakwika. <br />zolakwika monga
contribution-misreadings-description-extended-list-1 = wasowa<strong>'A'<strong>kapena<strong>koyambilira ko tapa
contribution-misreadings-description-extended-list-2 = kusowekela<strong>'s'<strong>komalizila kwa mawu
contribution-misreadings-description-extended-list-4 = kuphonyana ndi mawu akumapeto podula kutepa mwachangu kwambiri
contribution-misreadings-description-extended-list-5 = kuyesera kangapo kuwerenga liwu
contribution-misreadings-example-1-title = ma dinosaurs akuluakulu a triassic
contribution-misreadings-example-2-title = dinosaur yayikulu ya Triassic
contribution-misreadings-example-2-explanation = zikuyenela kukhala 'dinosaurs'
contribution-misreadings-example-3-title = ma dinosaur akuluakulu a Triassi-.
contribution-misreadings-example-3-explanation = kujambula kwadulidwa mawu womaliza asananenedwe
contribution-misreadings-example-4-title = ma dinosaurs akuluakulu a Triassic. Eya.
contribution-misreadings-example-4-explanation = zambiri zatapidwa kuposela mulingo wa malemba
contribution-misreadings-example-5-title = tikupita kukatenga khofi
contribution-misreadings-example-6-title = tikupita kukatenga khofi
contribution-misreadings-example-6-explanation = zikuyenera kukhala " ndife"
contribution-misreadings-example-7-title = tikupita kukagula khofi
contribution-misreadings-example-7-explanation = ayi 'a' mumalemba enieni
contribution-misreadings-example-8-title = njuchi zinadutsa mwachangu
contribution-misreadings-example-8-explanation = zinthu zosemphana
contribution-varying-pronunciations-title = kusiyanitsa kanenedwe
contribution-varying-pronunciations-description = samalani musanakane kanema kuti wowerenga watchula mawu molakwika, wayika chizindikilo polakwika, kapena wanyalanyaza mfuuliro. pali katchulidwe kosiyanasiyana pa dziko la pansi, ena woti sumunawamvepo mu dera lanu. chonde pereka malire woyamikira omwe angayankhule mosiyana ndi inu
contribution-varying-pronunciations-description-extended = mbali yina, ngati mukuganiza kuti wowerenga sanakumabizanepo ndi mawu kayamba kale, ndipo akungoganiza molakwika pa katchulidwe, chonde kanani. ngati simukudziwa, gwilitsani ntchito batani lodumpha
contribution-varying-pronunciations-example-1-title = pa mutu pake anavalapo beret
contribution-volume-title = mlingo
