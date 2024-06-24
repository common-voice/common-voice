## Contribution

action-click = Penya
action-tap = Tlanya
## Languages

contribute = Kenya letsoho
skip = Tlola
shortcuts = Dikgaoletso
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Clip
       *[other] <bold>{ $count }</bold> Di-Clip
    }
goal-help-recording = O thusitse Common Voice ho fihlela <goalPercentage></goalPercentage> sepheo sa rona sa letsatsi le letsatsi { $goalValue } sa ho rekota!
goal-help-validation = O thusitse Common Voice ho fihlela <goalPercentage></goalPercentage> ya sepheo sa rona sa letsatsi le letsatsi sa { $goalValue } netefatso!
contribute-more =
    { $count ->
        [one] { "" }
       *[other] O ikemiseditse ho etsa { $count } tse ding?
    }
speak-empty-state = Re feletswe ke dipolelo tseo re lokelang ho di rekota ka puo ena...
speak-empty-state-cta = Nehelana ka dipolelo
speak-loading-error =
    "Ha rea ​​kgona ho o fumanela dipolelo tseo o ka di buang.
     Re kopa o leke hape hamorao"
record-button-label = Rekota lentswe la hao
share-title-new = <bold>Re thuse</bold> ho fumana mantswe a mang
keep-track-profile = Beha tswelopele ya hao leihlo ka profaele
login-to-get-started = Kena kapa ingodise ho qalella
target-segment-first-card = O kenya letsoho karolong ya sepheo sa rona sa pele
target-segment-generic-card = O kenya letsoho karolong e lebeletsweng
target-segment-first-banner = Thusa ho etsa karolo ya pele ya Common Voice ka { $locale }
target-segment-add-voice = Kenya Lentswe la hao
target-segment-learn-more = Ithute haholwanyane

## Reporting

report = Tlaleha
report-title = Romela tlaleho
report-ask = O na le mathata afe ka polelo ee?
report-offensive-language = Puo e kgopisang
report-offensive-language-detail = Polelo e na le puo e hlokang tlhompho kapa e hlabang.
report-grammar-or-spelling = Phoso ya sebopeho-puo / mopeleto
report-grammar-or-spelling-detail = Polelo e na le phoso ya sebopeho-puo kapa mopeleto.
report-different-language = Puo e fapaneng
report-different-language-detail = E ngotswe ka puo e fapaneng le eo ke e buang.
report-difficult-pronounce = Ho thata ho bitsa
report-difficult-pronounce-detail = E na le mantswe kapa dipolelwana tseo ho leng thata ho di bala kapa ho di bitsa.
report-offensive-speech = Puo e kgopisang
report-offensive-speech-detail = Clip e na le puo e hlokang tlhompho kapa e hlabang.
report-other-comment =
    .placeholder = Hlahisa Maikutlo
success = Katleho
continue = Tswela pele
report-success = Tlaleho e fetisitswe ka katleho

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Rekota/Ema
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Rekota clip hape
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Lahla rekoto entse tswelapele
shortcut-submit = Kgutla
shortcut-submit-label = Romella di-clip
request-language-text = Na ha o so bone puo ya hao ho Common Voice?
request-language-button = Kopa Puo

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Bapala/Emisa
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = Ee
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Ditekanyetso
contribution-criteria-link = Utlwisisa mekgwa ya ho fana
contribution-criteria-page-title = Mekgwa ya ho Nehelana
contribution-criteria-page-description = Utlwisisa seo o lokelang ho se sheba ha o mametse di-clip tsa mantswe mme o thuse ho etsa hore direkoto tsa hao tsa lentswe di be monate le ho feta!
contribution-for-example = Mohlala
contribution-misreadings-title = Ho se bale hantle
contribution-misreadings-description = Ha o mametse, sheba ka hloko hore se rekotilweng ke sona hantle se ngotsweng; hana haeba ho na le diphoso le tse nyane. <br /> Diphoso tse tlwaelehileng haholo di kenyelletsa:
contribution-misreadings-description-extended-list-1 = Ha ho na <strong>'A'</strong> kapa <strong>'The'</strong> qalong ya rekoto.
contribution-misreadings-description-extended-list-2 = Ho haella <strong>'s'</strong> qetellong ya lentswe.
contribution-misreadings-description-extended-list-3 = Ho bala dikgakanyo tse siyo, jwalo ka "We're" ho fapana le "We are", kapa ka tsela e fapaneng.
contribution-misreadings-description-extended-list-4 = Ho nyametse bofelo ba lentswe la ho qetela ka lebaka la ho kgaola ho rekota kapele haholo.
contribution-misreadings-description-extended-list-5 = Ho leka makgetlo a mmalwa ho bala lentswe.
contribution-misreadings-example-1-title = Dikgodumodumo tse kgolo tsa Triassic.
contribution-misreadings-example-2-title = Kgodumodumo e kgolo tsa Triassic.
contribution-misreadings-example-2-explanation = [E tlameha e be 'dikgodumodumo']
contribution-misreadings-example-3-title = Dikgodumodumo tse kgolo tsa Triassic-.
contribution-misreadings-example-3-explanation = [Rekoto e kgaotswe pele lentswe la ho qetela le felella]
contribution-misreadings-example-4-title = Dikgodumodumo tse kgolo tsa Triassic. Ee.
contribution-misreadings-example-4-explanation = [Ho tlalehilwe tse ngata ho feta mongolo o hlokahalang]
contribution-misreadings-example-5-title = Re il'o fumana kofi.
contribution-misreadings-example-6-title = Re il'o fumana kofi.
contribution-misreadings-example-6-explanation = [E lokela ho ba "Re"]
contribution-misreadings-example-7-title = Re il'o fumana kofi.
contribution-misreadings-example-7-explanation = [Ha ho ‘a’ mongolong wa pele]
contribution-misreadings-example-8-title = Notshi e ile ya feta ka lebelo.
contribution-misreadings-example-8-explanation = [Ditaba tse sa tsamaisaneng]
contribution-varying-pronunciations-title = Qapodiso tse fapaneng
contribution-varying-pronunciations-description = Eba hlokolosi pele o hana sekotwana ka lebaka la hore mmadi ha bitsa lentswe hantle, o behile kgatello ya maikutlo sebakeng se fosahetseng, kapa ho bonahala a iphapanyeditse letswaho-potso. Hona le ditsela tse fapaneng tsa ho bitsa mantswe tse sebediswang lefatshe ka bophara, tse ding tseo o ka tswang o so di utlwe setjhabeng sa heno. Ka kopo fana ka moedi wa kananelo ho ba ka buang ka mokgwa o fapaneng le wa hao.
contribution-varying-pronunciations-description-extended = Ka lehlakoreng le leng, haeba o nahana hore mohlomong mmali ha a e-s'o ka a kopana le lentswe pele, mme o mpa a nahana ka mokgwa o fosahetseng oa ho bitsa mantswe, ka kopo, hana. Haeba o sena bonnete, sebedisa konopo ya tlola.
contribution-varying-pronunciations-example-1-title = Hloohong o ne a rwetse berete.
contribution-varying-pronunciations-example-1-explanation = ['Beret' e lokile ebang ke ka kgatello ya lentswe la pele (UK) kapa la bobeli (US)]
contribution-varying-pronunciations-example-2-title = Letsoho la hae le ne le phahamisitswe.
contribution-varying-pronunciations-example-2-explanation = [‘Ho phahamiswa’ ka Senyesemane kamehla ho bitswa jwalo ka senoko se le seng, eseng tse pedi]
contribution-background-noise-title = Lerata le ka morao
contribution-background-noise-description = Re batla hore di-algorithm tsa ho ithuta motjhini di kgone ho sebetsana le mefuta e fapaneng ya lerata le kamorao, mme le marata a hodimo a ka amohelwa ha feela a sa o setisi hore o utlwe sengolwa se felletseng. Lerata la mmino le kamorao le thotseng le nepahetse; mmino o phahameng haholo o sitisang hore o utlwe lentswe le leng le le leng wona ha wa nepahala.
contribution-background-noise-description-extended = Haeba rekoto e robeha, kapa e e-na le modumo o hlabang, e hane ntle le haeba mongolo oohle o ntse o ka utluwa.
contribution-background-noise-example-1-fixed-title = <strong>[Sneeze]</strong> dikgodumodumo tse kgolo tsa<strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = Kgodumodumo e kgolo <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-explanation = [Karolo e nngwe ya mongolo ha e utluwe]
contribution-background-noise-example-3-fixed-title = <strong>[Modumo o mokgutshwane o hlabang habohloko]</strong> dikgodumodumo tse kgolo tsa <strong>[modumo o mokgutshwane o hlabang habohloko]</strong> -riassic.
contribution-background-voices-title = Mantswe a ka morao
contribution-background-voices-description = Lerata le tlase le kamorao le nepahetse, empa ha re batle mantswe a mang a ka etsang hore algorithm ya motjhini e tsebe mantswe a sa ngolwang sengolweng. Haeba o utlwa mantswe a kgethehileng ntle le ho a sengolweng, sekotwana se tlameha ho hanwa. Ka tlwaelo hona ho etsahala moo TV e siilweng e butswe, kapa moo ho nang le moqoqo o ntseng o tswelapele haufi.
contribution-background-voices-description-extended = Haeba rekoto e robeha, kapa e e-na le modumo o hlabang, e hane ntle le haeba mongolo oohle o ntse o ka utluwa.
contribution-background-voices-example-1-title = Dikgodumodumo tse kgolo tsa Triassic. <strong>[e balwe ka lentswe le le leng]</strong>
contribution-background-voices-example-1-explanation = O wa tla? <strong>[o bitswa ke e mong]</strong>
contribution-volume-title = Bophahamo ba modumo
contribution-volume-description = Ho tla ba le mefuta e fapaneng ya tlhaho ya bophahamo ba modumo pakeng tsa babadi. Hana ha feela bophahamo ba modumo bo le hodimo hoo rekoto e kgaohang, kapa (ho tlwaelehileng haholo) o le tlase hoo o sa utlweng se buuwang ntle le ho sheba sengolwa.
contribution-reader-effects-title = Diphello tsa Mmadi
contribution-reader-effects-description = Boholo ba direkoto ke tsa batho ba buang ka lentswe la bona la tlhaho. O ka amohela rekoto e seng maemong ya hwane le hwane e hweletsang, e hweshetsang  kapa e hlakileng hore e entswe ka lentswe le nang le 'terama'. Ka kopo hana direkoto tse binwang le tse sebedisang lentswe le entsweng ka k'homphuta.
contribution-just-unsure-title = Feela ha o na bonnete?
contribution-just-unsure-description = Haeba o ka thulana le ntho e nngwe yeo ditataiso di sa e ameng, ka kopo kgetha ho latela kahlolo ya hao e ntle. Haeba o sa kgone ho nka qeto, sebedisa konopo ya feta mme o ee ho rekoto e latelang.
see-more = <chevron></chevron>Bona tse ding
see-less = <chevron></chevron>Bona hanyane

