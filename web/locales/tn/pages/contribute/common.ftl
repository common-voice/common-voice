## Contribution

action-click = Tobetsa
action-tap = Konya
## Languages

contribute = Se-Aba
skip = Tlola
shortcuts = Ditlhabanyetso
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Kgatiso
       *[other] <bold>{ $count }</bold> Dikgatiso
    }
goal-help-recording = O thusitse Common Voice gore e fitlhelele <goalPercentage></goalPercentage> ya maikaelelo a rona a letsatsi a go gatisa { $goalValue }!
goal-help-validation = O thusitse Common Voice gore e fitlhelele <goalPercentage></goalPercentage> ya maikaelelo a rona a letsatsi a go tlhomamisa { $goalValue }!
contribute-more =
    { $count ->
        [one] { "" }
       *[other] A o ipaakanyeditse go dira { $count } mo go oketsegileng?
    }
speak-empty-state = Re feletswe ke mela e re ka e gatisang ka puo eno...
speak-empty-state-cta = Aba mela
speak-loading-error = Ga re a kgona go bona mela e o ka e buang. Tsweetswee leka gape moragonyana.
record-button-label = Rekota lentswe la gago
share-title-new = <bold>Re thuse</bold> go bona mantswe a a oketsegileng
keep-track-profile = Boloka kgatelopele ya gago ka porofaele
login-to-get-started = Tsena kgotsa ikwadise go simolola
target-segment-first-card = O abelana go karolwana ya rona ya ntlha ya puo
target-segment-generic-card = O abelana go karolwana ya puo
target-segment-first-banner = Thusa go dira karolwana ya ntlha ya Common Voice ka { $locale }
target-segment-add-voice = Tsenya Lentswe la Gago
target-segment-learn-more = Ithute mo go Oketsegileng

## Reporting

report = Bega
report-title = Romela pego
report-ask = O itemogela mathata afe ka mola ono?
report-offensive-language = Puo e e kgopisang
report-offensive-language-detail = Mola o na le puo ya lenyatso kgotsa e e kgopisang.
report-grammar-or-spelling = Phoso ya thutapuo / mopeleto
report-grammar-or-spelling-detail = Mola o na le phoso ya thutapuo kgotsa ya mopeleto.
report-different-language = Puo e e farologaneng
report-different-language-detail = E kwadilwe ka puo e e farologaneng le e ke e buang.
report-difficult-pronounce = Go thata go le bitsa
report-difficult-pronounce-detail = E na le mafoko kgotsa dipolelo tse go leng thata go di bala kgotsa go di bitsa.
report-offensive-speech = Puo e e kgopisang
report-offensive-speech-detail = Kgatiso e na le puo ya lenyatso kgotsa e e kgopisang.
report-other-comment =
    .placeholder = Tshwaelo
success = Katlego
continue = Tswelela
report-success = Pego e kgonne go fetisiwa ka katlego

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = t

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Rekota/Emisa
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Dira dikgatiso gape
shortcut-discard-ongoing-recording = Tswa
shortcut-discard-ongoing-recording-label = Latlha kgatiso e e ntseng e tsweletse
shortcut-submit = Busetsa
shortcut-submit-label = Romela dikgatiso
request-language-text = A ga o ise o bone puo ya gago mo Common Voice?
request-language-button = Kopa Puo

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = t
shortcut-play-toggle-label = Tshameka/Emisa
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = e
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Mokgwa
contribution-criteria-link = Tlhaloganya mokgwa wa go abelana
contribution-criteria-page-title = Dintlha tsa go Aba
contribution-criteria-page-description = Tlhaloganya gore o tshwanetse go batla eng fa o reeditse dikgatiso tsa mantswe mme o thuse go dira gore dikgatiso tsa gago tsa mantswe di tshwanele!
contribution-for-example = ka sekai
contribution-misreadings-title = Tse di sa balwang sentle
contribution-misreadings-description = Fa o reeditse, tlhatlhoba ka kelotlhoko gore a se se gatisitsweng ke sone tota se se kwadilweng; se gane le fa go na le diphoso tse dinnye tota. <br />Diphoso tse di tlwaelegileng thata di akaretsa:
contribution-misreadings-description-extended-list-1 = Ga go na <strong>'A'</strong> kgotsa <strong>'Le'</strong> kwa tshimologong ya kgatiso.
contribution-misreadings-description-extended-list-2 = Go tlhaela <strong>'ng'</strong> kwa bofelong jwa lefoko.
contribution-misreadings-description-extended-list-3 = Go bala mafoko a a seyong, jaaka "Ra" go na le go re "Re a," kgotsa ka tsela e e farologaneng.
contribution-misreadings-description-extended-list-4 = Go tlhaela lefoko la bofelo fa le felela ka ntlha ya go khutlisa kgatiso ka bonako.
contribution-misreadings-description-extended-list-5 = E leka makgetlo a le mmalwa go bala lefoko.
contribution-misreadings-example-1-title = Di-dinosaur tse dikgolo tsa Triassic.
contribution-misreadings-example-2-title = Dinosaur e dikgolo ya Triassic.
contribution-misreadings-example-2-explanation = [Should be ‘dinosaurs’]
contribution-misreadings-example-3-title = Di-dinosaur tse dikgolo tsa Triassi-.
contribution-misreadings-example-3-explanation = [Kgatiso e kgaogile pele lefoko la bofelo le felela]
contribution-misreadings-example-4-title = Di-dinosaur tse dikgolo tsa Triassic. Ee.
contribution-misreadings-example-4-explanation = [Go gatisitswe mo gontsi go gaisa mokwalo o o tlhokegang]
contribution-misreadings-example-5-title = Re a tswa re ya go batla kofi.
contribution-misreadings-example-6-title = Re a tswa re ya go batla kofi.
contribution-misreadings-example-6-explanation = [E tshwanetse go nna “Re”]
contribution-misreadings-example-7-title = Re a tswa re ya go batla kofi.
contribution-misreadings-example-7-explanation = [Ga go na ‘a’ mo mafokong a ntlhantlha]
contribution-misreadings-example-8-title = Notshi e ile ya itlhaganela.
contribution-misreadings-example-8-explanation = [Diteng tse di sa tshwaneng]
contribution-varying-pronunciations-title = Go Bitsa Mafoko Go go Sa Tshwaneng
contribution-varying-pronunciations-description = Nna kelotlhoko pele o gana kgatiso ka go bo mmadi a sa bitsa lefoko sentle, o gateletse mo lefelong le e seng lone, kgotsa gongwe o itlhokomolositse letshwao la potso. Go na le ditsela tse dintsi tsa go bitsa mafoko lefatshe ka bophara, tse dingwe ka tsone o ka tswang o ise o di utlwe mo lefelong la gago. Tsweetswee anaanela ba ba ka tswang ba bua ka tsela e e farologaneng le e o buang ka yone.
contribution-varying-pronunciations-description-extended = Kafa letlhakoreng le lengwe, fa o akanya gore gongwe mmadi ga a ise a kopane le lefoko leo, mme o fopholetsa fela ka tsela e e sa siamang tsela e le bidiwang ka yone, tsweetswee e gane. Fa o sa tlhomamisege, dirisa konopo ya tlola.
contribution-varying-pronunciations-example-1-title = Mo tlhogong ya gagwe o ne a rwele berethe.
contribution-varying-pronunciations-example-1-explanation = [‘Berethe’ e siame le fa go gatelelwa ditlhaka tsa ntlha (UK) kgotsa tsa bofelo (US)]
contribution-varying-pronunciations-example-2-title = Seatla sa gagwe se ne se tsholedi-tswe.
contribution-varying-pronunciations-example-2-explanation = [Ka dinako tsotlhe ‘Raised’ ka Seesemane o bidiwa e le lefoko le le lengwe, e seng a mabedi]
contribution-background-noise-title = Modumo kwa Lemoragong
contribution-background-noise-description = Re batla gore go ithuta ga metšhine go kgone go lepalepana le medumo e mentsi e e kwa morago, le medumo e e kwa godimo e ka amogelesega fa fela e sa go thibele go utlwa mokwalo otlhe. Mmino o o lelang kwa morago go didimetse o siame; mmino o o kwa godimo thata mo o go thibelang go utlwa mafoko otlhe ga wa siama.
contribution-background-noise-description-extended = Fa kgatiso e kgaoga kgotsa e gagasha, e gane, ntle le fa mafoko otlhe a kgona go utlwiwa.
contribution-background-noise-example-1-fixed-title = <strong>[Sneeze]</strong> Di-dinosaur tse dikgolo tsa <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = Dino <strong>[cough]</strong> e kgolo ya Triassic.
contribution-background-noise-example-2-explanation = [Karolo ya mokwalo ga e utlwale]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]<strong> di-dinosaur tse dikgolo tsa <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = Mantswe mo Lemoragong
contribution-background-voices-description = Tlhakatlhakano e e utlwalang mo lefelong le le didimetseng e siame, mme ga re batle mantswe a a oketsegileng a a ka dirang gore motšhine o se ka wa lemoga mafoko a a sa kwalwang. Fa o ka utlwa mafoko a a farologaneng le a a kwadilweng, kgatiso eo e tshwanetswe go ganwa. Gantsi seno se direga fa TV e tlogetswe e tshubilwe, kgotsa fa go na le motlotlo o o tsweletseng fa gaufi.
contribution-background-voices-description-extended = Fa kgatiso e kgaoga kgotsa e gagasha, e gane, ntle le fa mafoko otlhe a kgona go utlwiwa.
contribution-background-voices-example-1-title = Di-dinosaur tse dikgolo tsa Triassic. <strong>[read by one voice]</strong>
contribution-background-voices-example-1-explanation = A o etla? <strong>[called by another]</strong>
contribution-volume-title = Bolumo
contribution-volume-description = Go tla nna le dipharologano tsa tlholego mo bolumong ya babadi. Gana fela fa bolumo e le kwa godimo thata mo kgatiso e kgaogang, kgotsa (se se tlwaelegileng thata) fa e le kwa tlase thata mo o sa utlweng se se buiwang kwantle ga go leba se se kwadilweng.
contribution-reader-effects-title = Seabe sa Mmadi
contribution-reader-effects-description = Dikgatiso tse dintsi ke tsa batho ba ba buang ka lentswe la bone la tlholego. O ka amogela kgatiso nngwe e e sa tlwaelegang ya go goa, go seba, kgotsa e e buiwang ka tsela e e ‘kgatlhang’. Tsweetswee gana dikgatiso tse go opelwang le tse di dirisang lentswe le le dirilweng ka khomputara.
contribution-just-unsure-title = Ga o A Tlhomamisega?
contribution-just-unsure-description = Fa o kopana le sengwe se dikaelo tseno di sa bueng ka sone, tsweetswee tlhopha go ya ka tsela e e molemolemo e o e akanyang. Fa tota o sa kgone go dira tshwetso, dirisa konopo ya go tlola mme o ye kwa kgatisong e e latelang.
see-more = <chevron></chevron>Bona tse di oketsegileng
see-less = <chevron></chevron>Bona tse di fokoditsweng

