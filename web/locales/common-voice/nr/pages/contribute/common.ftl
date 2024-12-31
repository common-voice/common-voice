action-click = vala
action-tap = IsiTap
contribute = Nikela
skip = Dlula
shortcuts = Ukufitjhanisa
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Isiqetjhana
       *[other] <bold>{ $count }</bold> Iinqetjhana
    }
goal-help-recording =
    Usize i-Common Voice 
    <goalPercentage></goalPercentage> umgomo welanga { $goalValue } wokurekhoda!
goal-help-validation =
    Usize i-Common Voice ukufikelela 
    <goalPercentage></goalPercentage> umgomo wokuqinisekisa { $goalValue } welanga!
contribute-more =
    { $count ->
        [one] { "" }
       *[other] Ukulungele ukwenza { $count } okwengeziweko?
    }
speak-empty-state =
    Ayisekho imitjho engarekhodwa 
    ngelimeli...
speak-empty-state-cta = Nikela ngemitjho
speak-loading-error =
    "Ayikho imitjho esiyifumanako
    ongayitjho.
    Sibawa ulinge ngesikhathi esilandelako."
record-button-label = Rekhoda iphimbo
share-title-new = <bold>Sisiza</bold> sifumane amanye amaphimbo
keep-track-profile = Tjheja ituthukwakho ngephrofayili
login-to-get-started = Thungela namkha uzitlolise bona uthome
target-segment-first-card = Unikela engcenyeni yethu yokuthoma
target-segment-generic-card = Unikela endaweni okungiyo
target-segment-first-banner =
    Siza ngokwenza i-Common Voice ikhambe 
    phambili ku { $locale }
target-segment-add-voice = Faka iphimbo lakho
target-segment-learn-more = Funda okwengeziweko

## Contribution Nav Items


## Reporting

report = Bika
report-title = Thumela umlayezo
report-ask =
    Ngibuphi ubudisi ohlangabezana nabo ngemitjho
    le?
report-offensive-language = Ilimi elilumelako
report-offensive-language-detail =
    Imitjho le itjengisa ukudelela namkha inamagama 
    alumelako.
report-grammar-or-spelling = Umtjhapho wokutlola / ukupeleda
report-grammar-or-spelling-detail = Umutjho unomraro wokutlola nokupeleda.
report-different-language = Ilimi elihlukileko
report-different-language-detail =
    Kutlolwe ngelimi elihlukileko 
    kunengilikhulumako.
report-difficult-pronounce = Kubudisi ukuphimisela
report-difficult-pronounce-detail =
    Kunamezwi namkha amagama okubudisi 
    ukuwafunda namkha ukuwaphimisela.
report-offensive-speech = Ikulumo elumelako
report-offensive-speech-detail = Okurekhodiweko kunamezwi adelelako namkha alumelako.
report-other-comment =
    .placeholder = Umbono
success = Ipumelelo
continue = Ragela phambili
report-success = Umbiko uphasile

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = Iindlela eziquntelako

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Rekhoda/Jama
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Rekhoda kabutjha
shortcut-discard-ongoing-recording = PHUMA
shortcut-discard-ongoing-recording-label = Susa okurekhodwako
shortcut-submit = Buyela
shortcut-submit-label = Thumela iinqetjhana
request-language-text = Awuliboni ilimi lakho ku-Common Voice?
request-language-button = Bawa Ilimi

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Dlala/Jama
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = { "" }
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Ihlelo
contribution-criteria-link = Zwisisa iindlela zokunikela
contribution-criteria-page-title = Indlela yokunikela
contribution-criteria-page-description = Zwisisa bona khuyini okufuze ukutjheje nawulalele iinqetjhana ezirekhodiweko begodu usize ekwenzeni okurekhodileko kunothe!
contribution-for-example = ngokwesibonelo
contribution-misreadings-title = Okungakafundwa kuhle
contribution-misreadings-description = Nawulaleleko, tjheja bona okurekhodiweko kufana nalokho okutloliweko; ungakwamukeli ngitjho nanyana imitjhapho imincani. <br />Imitjhapho ejayelekileko ifaka hlangana:
contribution-misreadings-description-extended-list-1 = Kutjhoda u- <strong>'A'</strong> namkha u- <strong>'The'</strong> ekuthomeni kokurekhodiweko.
contribution-misreadings-description-extended-list-2 =
    Kutjhoda u <strong>'s'</strong> ekugcineni 
    kwegama.
contribution-misreadings-description-extended-list-3 = Ukufunda okuthileko okungakatlolwa njengokuthi "S'bo" esikhundleni sokuthi "Sibo" namkha "Sibo" esikhundleni sokuthi "S'bo".
contribution-misreadings-description-extended-list-4 =
    Kulahleke amezwi wokugcina
    ngombana ujamise ukurekhoda msinyana.
contribution-misreadings-description-extended-list-5 = Ukulinga kanengana ukufunda igama.
contribution-misreadings-example-1-title = Iingorho zeTriassic.
contribution-misreadings-example-2-title = Iingorho zeTriassic.
contribution-misreadings-example-2-explanation = [Kungenzeka ‘iphelelwe sikhathi’]
contribution-misreadings-example-3-title = Iingorho zeTriassic.
contribution-misreadings-example-3-explanation = [Ukujamisa ukurekhoda ngaphambi kwegama lokugcina]
contribution-misreadings-example-4-title = IngorhoyeTriassic. Iye.
contribution-misreadings-example-4-explanation = [Kurekhodwe okunengi ukudlula ebegade kutlhogeka]
contribution-misreadings-example-5-title = Sisayokusela ikofi.
contribution-misreadings-example-6-title = Sisayokusela ikofi.
contribution-misreadings-example-6-explanation = [Kufuze kube ngu “Sibo”]
contribution-misreadings-example-7-title = Sisayokusela ikofi.
contribution-misreadings-example-7-explanation = [Awa kuno ‘a’ emtlolweni wokuthoma]
contribution-misreadings-example-8-title = Ikhamba ngebelo le.
contribution-misreadings-example-8-explanation = [Okungatlhogekiko]
contribution-varying-pronunciations-title = Ukuphimisela okuhlukahlukeneko
contribution-varying-pronunciations-description = Tjheja ngaphambi kobana wale okurekhodiweko ngebanga lokuthi ucabanga bona umfundi akakabizi kuhle ibizo, ugandelele endaweni engakafaneli namkha akakahloniphi itshwayo lombuzo. Kuneendlela ezinengi zokubiza amagama ephasini mazombe, ezinye zakhona kungenzeka awukhenge wazizwa emphakathini ohlala kiwo. Sibawa ubabuke labo abakhuluma ngendlela ehlukileko kunawe.
contribution-varying-pronunciations-description-extended = Ngakwelinye ihlangothi, nawucabanga bona umfundi kungenzeka akhenge khekahlangane nebizo ngaphambilini, begodu uyaqagela ukuthi ibizo elithileko lingabizwa njani, ungalamukeli. Nawungaqiniseki ngalokho, gandelela ikinobho yokweqa skip.
contribution-varying-pronunciations-example-1-title = Umbethe ibherede ehlokwakhe.
contribution-varying-pronunciations-example-1-explanation = [‘Berete’ ngu Iye kungakhathaliseki bona ugandelelwa kokothoma e- (UK) namkha kwesibili e- (US)]
contribution-varying-pronunciations-example-2-title = Isandla sakhe besiphakamile.
contribution-varying-pronunciations-example-2-explanation = [‘Ukukhuliswa’ ngesiNgisi kuphinyiselwa ngesilabhulu yinye ingasi ezimbili]
contribution-background-noise-title = Itjhada elingemuva
contribution-background-noise-description = Sifuna imitjhini yokufunda ikghona ukuqalana namatjhada enzeka ngemuva, ngitjho namatjhada aphezulu avumelekile kwaphela nakangenzi bona kungasazwakali okutloliweko. Umvumo olilela phasi ulungile; umvumo olilela phezulu bewenze nokuthi ungasazwakali ukuthi uthini wona awukavumeleki.
contribution-background-noise-description-extended = Nange okurekhodiweko kuqunteka namkha kutjhitjhiza kusuze ngaphandle kwalokha okhunye kuzwakala.
contribution-background-noise-example-1-fixed-title =
    <strong>[Sneeze]</strong> Iingorho 
    ze- <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title =
    Iingorho ze <strong>[cough]</strong> i
    Triassic.
contribution-background-noise-example-2-explanation = [Ingcenye yokutloliweko ayizwakali]
contribution-background-noise-example-3-fixed-title =
    <strong>[Crackle]</strong> iingorho ze
    <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = Amezwi angemuva
contribution-background-voices-description = Ukuzwakala kwamatjhada amanengi kulungile, kodwana asifuni amaphimbo amanengi azokubangela bona umtjhini ufumane amabizo angakatlolwa phasi. Nakwenzeka uzwe amagama amanengi ngaphandle kwalayo atloliweko, ungawamukeli. Kanengi lokho kwenzeka nakutjhiywe iTV idlala, namkha nakunabantu abakhulumako eduze.
contribution-background-voices-description-extended = Nange okurekhodiweko kuqunteka namkha kutjhitjhiza kususe ngaphandle kwalokha okhunye kuzwakala.
contribution-background-voices-example-1-title =
    Ingorho yeTriassic. 
    <strong>[read by one voice]</strong>
contribution-background-voices-example-1-explanation =
    Uyeza? <strong>[called by 
    another]</strong>
contribution-volume-title = Ivolomu
contribution-volume-description = Indlela abantu abafunda ngayo izokuhluka. Kwale kwaphela nange itjhada umuntu afunde ngalo liphezulu khulu kangangokuthi kuqunteke akutjhoko, namkha (okujayeleke khulu) liphasi khulu kangangokuthi akuzwakali bona kuthiwani ngaphandle kokuthi kuqalwe okutloliweko.
contribution-reader-effects-title = Iinkunupe zokufunda
contribution-reader-effects-description = Okunengi okurekhodiweko kwenziwe ngephimbo lemvelo. Ungakwamukela ukufunda namkha iphimbo elizwakalela phezulu, elizwakalela phasi, ngitjho nelizwakala ‘sabudrama’. Sibawa ungawamukeli amaphimbo azwakala ngasuthi ayavuma namkha amaphimbo enziwe ngekhomphyutha.
contribution-just-unsure-title = Awuqiniseki?
contribution-just-unsure-description = Nawufumana okuthileko okungakafakwa eenqophiswenezi, sibawa uhlole okurekhodiweko ngokwahlulela kwakho. Nangabe awukghoni ukuqunta, sebenzisa ikinobho yokweqa skip utjhinge emtjhweni olandelako.
see-more = <chevron></chevron>Veza okwengeziweko
see-less = <chevron></chevron>Veza okuncani
