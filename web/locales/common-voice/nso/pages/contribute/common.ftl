action-click = Klika
action-tap = Kgwatha
contribute = Neela
skip = Tshela
shortcuts = Kgaoletšo
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Pego
       *[other] <bold>{ $count }</bold> Dipego
    }
goal-help-recording = O thušitše Common Voice e fihle <goalPercentage></goalPercentage> ya letšatši le letšatši ya { $goalValue } pakane ya go gatiša.
goal-help-validation = O thušitše Common Voice e fihle <goalPercentage></goalPercentage>  ya letšatši le letšatši ya{ $goalValue } pakane ya go gatiša.
contribute-more =
    { $count ->
        [one] { "" }
       *[other] Loketše go dira { $count } go feta?
    }
speak-empty-state = Re feletšwe ke mafoko a gatiša pego ka polelo e...
speak-empty-state-cta = Neela ka mafoko
speak-loading-error = Ga se re kgone go hwetša mafoko a o ka wa bolelago. Re kgopela o leke gape ka morago.
record-button-label = Gatiša lentšu la gago
share-title-new = <bold>Re thuše </bold> re hwetše mantšu a mangwe
keep-track-profile = Dula o tseba boemo bja tšwelopele ka goba le profaele
login-to-get-started = Hloma akhaonte ya mošomiši goba ngwadiša go thoma
target-segment-first-card = O tlaleletša go karolo ya nepo ya rena ya mathomo
target-segment-generic-card = O tlaleletša go karolo ya nepo
target-segment-first-banner = Re thuše re bope nepo ya karolo ya mathomo ya Common Voice { $locale }
target-segment-add-voice = Tsenya Lentšu la Gago
target-segment-learn-more = Ithute ka mo go oketšegilego

## Contribution Nav Items


## Reporting

report = Pego
report-title = Tliša pego
report-ask = Ke mathata a feng ao o lebelanego le wona ka lefoko le?
report-offensive-language = Leleme le kgopišago
report-offensive-language-detail = Lefoko le nale mantšu a hlokago hlompho goba a kgopišago.
report-grammar-or-spelling = Popopolelo/ Phošo mopeletong
report-grammar-or-spelling-detail = Lefoko le nale phošo ya popopolelo le ya go peletwa.
report-different-language = Polelo e fapanego
report-different-language-detail = E ngwetšwe ka polelo e fapanego le polelo yeo ke e bolelago.
report-difficult-pronounce = Go thatha go wa bitša
report-difficult-pronounce-detail = E nale mantšu goba dipolelwane tšeo go lego thata go di bala goba go di bitša.
report-offensive-speech = Polelo e kodutlago
report-offensive-speech-detail = Setsopolwa se na le polelo e hlokago hlompho goba e kgopišago.
report-other-comment =
    .placeholder = Tshwayotshwayo
success = Katlego
continue = Tšwela pele
report-success = Pego e fetile ka katlego

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Pego/Ema
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Rekhota pego ya odio gape
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Phumola kgatišo e diragalago
shortcut-submit = Bušetša
shortcut-submit-label = Tsenya dipego
request-language-text = Ga o bone polelo ya gago go Common Voice gabjale?
request-language-button = Kgopela polelo

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Bapala/ Ema
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriteria
contribution-criteria-link = Kwešiša kriteria ya go tlaleletša
contribution-criteria-page-title = Ditiragalotšeletšwa tša Kriteria
contribution-criteria-page-description = Kwešiša gore ke eng se o swanetše go se lebelela ge o theeletša dipego gomme o thutše go dira direkhoto tša gago tša lentšu di hume!
contribution-for-example = Ka mohlala
contribution-misreadings-title = Di balo tše fošagetšego
contribution-misreadings-description = Ge o theeditše, hlahloba ka kelohloko gore na seo se gatišitšwego ke sona seo se ngwadilwego; gana ge e ba go na le diphošo tše nyenyane. <br />Diphošo tše di tlwaelegilego kudu di akaretša:
contribution-misreadings-description-extended-list-1 = Go hloka <strong>'A'</strong> goba <strong>'The'</strong> mathomong a pego.
contribution-misreadings-description-extended-list-2 = Go hloka<strong>'s'</strong> mafelelong a lentšu.
contribution-misreadings-description-extended-list-3 = Go bala mantšu a fokoditšwego a se ng wona bjale ka "Re' go e na le "Rea', goba bjalo le bjalo.
contribution-misreadings-description-extended-list-4 = Go hlaela ke pheletšo ya mafelelo a lentšu gobane o timile pego kapela kudu.
contribution-misreadings-description-extended-list-5 = Tšea maiteko a mmalwa a go bala lentšu.
contribution-misreadings-example-1-title = Dinosaur e kgolo ya Triassic.
contribution-misreadings-example-2-title = Dinosaur e kgolo ya Triassic.
contribution-misreadings-example-2-explanation = [Should be ‘dinosaurs’]
contribution-misreadings-example-3-title = Dinosaur e kgolo ya Triassi-.
contribution-misreadings-example-3-explanation = [Recording cut off before the end of the last word]
contribution-misreadings-example-4-title = Dinosaur e kgolo ya Triassic. Ee.
contribution-misreadings-example-4-explanation = [More has been recorded than the required text]
contribution-misreadings-example-5-title = Re ilo go hwetša kofi.
contribution-misreadings-example-6-title = Re ilo go hwetša kofi.
contribution-misreadings-example-6-explanation = [Should be “We are”]
contribution-misreadings-example-7-title = Re ya tšwa go hwetša kofi.
contribution-misreadings-example-7-explanation = [No ‘a’ in the original text]
contribution-misreadings-example-8-title = Nose e ile ya feta ka lebelo.
contribution-misreadings-example-8-explanation = [Mismatched content]
contribution-varying-pronunciations-title = Dipiletšo tša Mantšu tše Fapanego
contribution-varying-pronunciations-description = Eba šedi pele o gana setsopolwana ka baka la gore mmadi ga a bitša lentšu ka tsela e fošagetšego, o beile kgateletšo lefelong le fošagetšego, goba go bonagala a hlokomologile letswao la potšišo. Go na le mehuta e mentši ya go bitšwa ga mantšu e didirišwago lefaseng ka bophara, yeo mohlomongwe o se ke wa ekwa setšhabeng sa geno. Ka kgopelo nea ka moedi wa tebogo go bao ba bolelago ka tsela e fapanego le ya gago.
contribution-varying-pronunciations-description-extended = Ka lehlakoreng le lengwe, ge e ba o nagana gore mohlomogwe mmadi ga se ka ka ka gahlana le lentšu pele, gomme o dira kgakanyo e fošagetšego ka mokgwa wa piletšo ya mantšu, ka kgopelo gana. Ge e ba o sa kgonthišege, šomiša setobetšwa sa go taboga.
contribution-varying-pronunciations-example-1-title = O apere berete godimo ga tlogo ya gagwe.
contribution-varying-pronunciations-example-1-explanation = [‘Beret’ is OK whether with stress on the first syllable (UK) or the second (US)]
contribution-varying-pronunciations-example-2-title = Letsogo la gagwe le emišitšwe.
contribution-varying-pronunciations-example-2-explanation = [‘Raised’ in English is always pronounced as one syllable, not two]
contribution-background-noise-title = Lešata la Bokamorago
contribution-background-noise-description = Re nyaka gore alkoritheme ya go ithuta ya motšhene e kgone go šoma le lešata le fapanego, ešita le mašata a magolo ao a ka amogelwago ge feela le sa go thibele go kwa mongwalo ka moka. Mmino wa bokamorago wa llela fase o LOKILE; mmino o wa godimo ka mo go lekanego go go thibela go kwa lentšu le lengwe le lengwe ga wa lokela.
contribution-background-noise-description-extended = Ge e ba kgatišo e ka arogana, goba e nale go kgakgatha, e ganwe ntle le gore mongwalo o feletšego e sa kwagala.
contribution-background-noise-example-1-fixed-title = <strong>[Sneeze]</strong> Dinosaur e kgolo ya <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = Dino e kgolo <strong>[cough]</strong> di Triassic.
contribution-background-noise-example-2-explanation = [Part of the text can’t be heard]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]</strong> dinosaurs e kgolo ya <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = Mantšu a Bokamorago
contribution-background-voices-description = Lefelong la bokamorago le se nago lešata le LOKILE, eupša ga re nyake mantšu a mangwe a ka dirago gore mokgwa wa motšhene o kgetholwe mantšu ao a se be gona mongwalong. Ge e ba o ka kwa mantšu a phapano go ao a lego mongwalong, setsopolwana se swanetše go ganwa. Se se tlwaetše go diragala moo TV e tlogetšwego, goba moo poledišano e diragalago kgauswi le moo.
contribution-background-voices-description-extended = Ge e ba kgatišo e ka arogana, goba e nale go kgakgatha, e ganwe ntle le gore mongwalo o feletšego e sa kwagala.
contribution-background-voices-example-1-title = Dinosaur e kgolo ya Trassic. <strong>[read by one voice]</strong>
contribution-background-voices-example-1-explanation = Wa tla na? <strong>[called by another]</strong>
contribution-volume-title = Bolumo
contribution-volume-description = Go tla ba le phaphano ya tlhago ya modumo magareng ga babadi. Gana feela ge e ba modumo o le godimo kudu moo rekhotilwego e sa kwale botse, goba (seo se tlwaelegilego kudu) ge e ba e le tlase moo e sa kwale gore go boletšwe eng ka ntle le go lebelela mo go ngwadilego.
contribution-reader-effects-title = Khuetšo ya mobadi
contribution-reader-effects-description = Dikgatišo tše dintši ke tša batho bao ba bolelago lentšu ka bona la tlhago. O ka amogela rekhoto e sa tlwaelegago ya nako le nako e goeletša, e sebela, goba ka go hlakodiša molaleng ka lentšu le ‘makatšago’. Ka kgopelo gana direkhoto tšeo di opelwago le tšeo di dirišago lentšu leo le dirilwego ka khomphutha.
contribution-just-unsure-title = Ga se o kgonthišege?
contribution-just-unsure-description = Ge e ba o kopana le selo seo dikeletšo tšeo di se ke tša akaretšwa, ka kgopelo kgetha go ya ka kahlolo ya gago e botse. Ge e ba ruri o ka se kgone go tšea sephetho, diriša setobetšwa sa go taboga gomme o fetele go kgatišo e latelago.
see-more = <chevron></chevron>Bona tša go feta
see-less = <chevron></chevron>Bona tše nyenyane
