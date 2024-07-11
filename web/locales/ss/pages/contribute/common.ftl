action-click = Chafata
action-tap = Tsintsa
contribute = Nikela
skip = Yeca
shortcuts = Tindlela tekujubelisa
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Sicephu
       *[other] <bold>{ $count }</bold> Ticephu
    }
goal-help-recording = Usite Common Voice kufinyelela ku <goalPercentage></goalPercentage> wemagoli etfu { $goalValue } ekutfwebula ngelilanga
goal-help-validation = Usite Common Voice kufinyelela ku <goalPercentage></goalPercentage> wemagoli etfu { $goalValue } ekucinisekisa ngelilanga
contribute-more =
    { $count ->
        [one] { "" }
       *[other] Ulungele kwenta  { $count } lokunye?
    }
speak-empty-state = Sesiphelelwe imisho lesingayitfwebula ngalolwimi...
speak-empty-state-cta = Nikela imisho
speak-loading-error =
    Asikakhoni kutfola imisho longayikhuluma.
    Sicela uphidze wetame futsi
record-button-label = Tfwebula livi lakho
share-title-new = <bold>Sisite </bold>sitfole emavi lamanengi
keep-track-profile = Gcina inchubo yakho ngelikhasi lelichaza kabanti ngawe
login-to-get-started = Ngena / bhalisa kute utokhona kucala
target-segment-first-card = Ulekelela ku target segment yetfu yekucala
target-segment-generic-card = Unikela ku target ye segment
target-segment-first-banner = Sita ekwakheni i-target segment ya common voice yekucala ku { $locale }
target-segment-add-voice = Ngeta Livi Lakho
target-segment-learn-more = Fundza Kabanti

## Contribution Nav Items


## Reporting

report = Bika
report-title = Mikisa umbiko
report-ask = Ngutiphi tinkinga lohlangabetana nato kulemisho?
report-offensive-language = Lulwimi lolucasulako
report-offensive-language-detail = Lelisentenisi linenhlamba futsi liyalulata.
report-grammar-or-spelling = Grammatical / spelling error
report-grammar-or-spelling-detail = Lomusho unemaphutsa ekuhlelweni nasekubhalweni kwawo
report-different-language = Lulwimi lolwehlukile
report-different-language-detail = Kubhalwe ngelulwimi loluhlukile kunalele ngilikhulumako.
report-difficult-pronounce = Kulukhuni kuyisho
report-difficult-pronounce-detail = Icuketse emagama lalukhuni kuwasho.
report-offensive-speech = Inkhulumo lecansulako
report-offensive-speech-detail = Lesiceshana sinetinhlamba futsi siyalulata.
report-other-comment =
    .placeholder = Phawula
success = Imphumelelo
continue = Chubeka
report-success = Umbiko uphumelele kahle

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Tfwebula/Mani
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Tfwebula kabusha sicephu
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Lahla sicephu lesisatfwebulwa
shortcut-submit = Jika
shortcut-submit-label = Mikisa ticeshana
request-language-text = Awuliboni lulwimi lwakho ku Common voice kwamanje?
request-language-button = Cela lulwimi

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Dlala/Mani
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Luhla
contribution-criteria-link = Condzisisa luhla lwekulekelela
contribution-criteria-page-title = Luhla lwekulekelela
contribution-criteria-page-description = Condzisisa kutsi ufunani uma ulalela tinkhulumo kute utokwati kwenta kutfwebula tinkhulumo kunotse!
contribution-for-example = kubekisa
contribution-misreadings-title = Lokufundvwe kabi
contribution-misreadings-description = Uma ulalele, hlolisisa kutsi itfwebuleke kahle yini kunaku lokubhaliwe; yijikise uma kunemaphutsa noma ngabe kuncane kanganani. <br />Emaphutsa lajwayelekile afaka ekhatsi:
contribution-misreadings-description-extended-list-1 = Kushoda <strong>'A'</strong> or <strong>'The'</strong> ekucaleni kwale recording.
contribution-misreadings-description-extended-list-2 = Kushoda <strong>'s'</strong> ekugcineni kweligama.
contribution-misreadings-description-extended-list-3 = Kufundza tifinyeto letingekho letifaka ekhatsi, "We're" esikhundleni sa "We are", nome vice versa.
contribution-misreadings-description-extended-list-4 = Kushiywa siphetfo seligama ngekujuba le recording ngekushesha.
contribution-misreadings-description-extended-list-5 = Kutsatsa emahlandla kufundza ligama.
contribution-misreadings-example-1-title = Ema dinosaur lamakhulu ase Triassic.
contribution-misreadings-example-2-title = I dinosaur lenkhulu yase Triassic.
contribution-misreadings-example-2-explanation = [Should be ‘dinosaurs’]
contribution-misreadings-example-3-title = Ema dinosaur lamakhulu ase Triassi-
contribution-misreadings-example-3-explanation = [Recording cut off before the end of the last word]
contribution-misreadings-example-4-title = Ema-dinosaurs lamakhulu ase Triassic. Yebo.
contribution-misreadings-example-4-explanation = [More has been recorded than the required text]
contribution-misreadings-example-5-title = Siyaphuma siyotfola likhofi.
contribution-misreadings-example-6-title = Siyaphuma siyotfola likhofi.
contribution-misreadings-example-6-explanation = [Should be “We are”]
contribution-misreadings-example-7-title = Siyaphuma siyotfola likhofi.
contribution-misreadings-example-7-explanation = [No ‘a’ in the original text]
contribution-misreadings-example-8-title = The bumblebee sped by.
contribution-misreadings-example-8-explanation = [Mismatched content]
contribution-varying-pronunciations-title = Tindlela tekukhuluma letehlukahlukene
contribution-varying-pronunciations-description = Caphela ngaphambi kwekutsi ucitse siceshana lapho lofundzako angakasho kahle ligama, noma ufake kucindzetela endzaweni lengasiyo, noma ke kungenteka ushiye umbuto. Tinengi tindlela tekusho letisetjentiswa mhlaba wonkhe, letinye longakativa emphakatsini wangakini. Sicela ufake umkhawulo wekubonga kulabo labakhuluma ngendlela lengafani neyakho.
contribution-varying-pronunciations-description-extended = Kulokunye, uma ucabanga kutsi lofundzako akazange sekadibane naleligama ngaphambilini, futsi kulula kulisho kabi, sicela ulicitse. Uma ungakaciniseki, sebentisa libhathini lalokulandzelako.
contribution-varying-pronunciations-example-1-title = Enhloko yakhe bekagcoke i-beret.
contribution-varying-pronunciations-example-1-explanation = [‘Beret’ is OK whether with stress on the first syllable (UK) or the second (US)]
contribution-varying-pronunciations-example-2-title = Sandla sakhe besiphakam-ile.
contribution-varying-pronunciations-example-2-explanation = [‘Raised’ in English is always pronounced as one syllable, not two]
contribution-background-noise-title = Imisindvo lengemuva
contribution-background-noise-description = Sifuna ema-algorithms ekufundza imishini kutsi ikwati kuphatsa tinhlobonhlobo temisindvo lengemuva, futsi imisindvo lemikhulu ingamukelwa kuphela nje uma ingakuvimbeli kutsi uve wonkhe umbhalo. Umculo longemuva lophansi ULUNGILE; umculo losetulu ngalokuvimba kutsi ungeva igama ngalinye.
contribution-background-noise-description-extended = Uma le recording igamuka, noma inekukhwehlela, yicitse ngaphandle ke uma ukhona kuva lencenye lemagama.
contribution-background-noise-example-1-fixed-title = <strong>[Sneeze]</strong> ema-dinosaur lamakhulu e <strong>[cough]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = The giant dino <strong>[cough]</strong> the Triassic.
contribution-background-noise-example-2-explanation = [Part of the text can’t be heard]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]</strong> ema-dinasaur lamakhulu ase <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = Emavi langemuva
contribution-background-voices-description = Ihabhu lengemuva lephansi ilungile, kodvwa asiwafuni emavi lengatiwe langase abangele i-algorithm yemshini kutsi ibone emagama langekho kulokubhaliwe. Uma uva emagama lahlukene ngaphandle kwalawo embhalo, lesiceshana kufanele sijikiswe. Ngalokuvamile loku kwenteka lapho i-TV ishiywe ivuliwe, noma lapho kunenkhulumo lechubekako edvute.
contribution-background-voices-description-extended = Uma le recording igamuka, noma inekukhwehlela, yicitse ngaphandle ke uma ukhona kuva lencenye lemagama.
contribution-background-voices-example-1-title = Ema-dinosaurs lamakhulu ase Triassic. <strong>[read by one voice]</strong>
contribution-background-voices-example-1-explanation = Uyeta? <strong>[lokubitwe ngulomunye]</strong>
contribution-volume-title = Linani lemsindvo
contribution-volume-description = Kutoba khona kuhluka kwemvelo ngekwelinani lebafundzi. Yicitse kuphela uma linani lisetulu ngendlela yekutsi nalokutfwebuliwe kuyephatamiseka, noma (ngalokujwayelekile) uma liphansi kangangekutsi awukhoni kuva lokushiwoko  ngaphandle kwalokubhaliwe.
contribution-reader-effects-title = Reader Effects
contribution-reader-effects-description = Liningi lemalekhodi ngewebantfu labakhuluma ngemavi abo endalo. Ungawemukela lawo langakajwayeleki lawo lamenyetiwe, lahletjiwe noma lawo ke 'lanekugcizelela ' emavi. Sicela uwacitse emalekhodi lahlatjeliwe noma lentiwe nga ngcondvomshina.
contribution-just-unsure-title = Ute siciniseko?
contribution-just-unsure-description =
    Uma uhlangabetana nalokutsintfwa ngulemihlahlandlela, sicela uvote ngendlela yakho lengiyo. 
    Uma ungakhoni kukhetsa, sicela uchubekele embili uchubeke kulocophiwe lokulandzelako.
see-more = <chevron></chevron>Bona lokunengi
see-less = <chevron></chevron>Bona lokuncane
