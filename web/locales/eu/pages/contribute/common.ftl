action-click = Egin klik
action-tap = Sakatu
contribute = Lagundu
review = Berrikusi
skip = Saltatu
shortcuts = Lasterbideak
clips-with-count-pluralized =
    { $count ->
        [one] Grabazio <bold>{ $count }</bold>
       *[other] <bold>{ $count }</bold> grabazio
    }
goal-help-recording = Common Voicek egunero { $goalValue } grabazio lortzea du helburu eta zuk helburuaren <goalPercentage></goalPercentage>a lortzen lagundu duzu!
goal-help-validation = Common Voice-ri lagundu diozu egunero { $goalValue } balioztatzeko dugun helburuaren <goalPercentage></goalPercentage> lortzen!
contribute-more =
    { $count ->
        [one] { $count } gehiago egiteko prest?
       *[other] { $count } gehiago egiteko prest?
    }
speak-empty-state = Grabatzeko esaldirik gabe geratu gara hizkuntza honetan...
speak-empty-state-cta = Lagundu esaldiekin
speak-loading-error = Ezin izan dugu zuk irakurtzeko esaldirik lortu. Mesedez saia zaitez berriz beranduago.
record-button-label = Grabatu zure ahotsa
share-title-new = <bold>Lagun gaitzazu</bold> ahots gehiago aurkitzen
keep-track-profile = Jarraitu zure aurrerapenak profil batekin
login-to-get-started = Hasteko, hasi saioa edo eman izena
target-segment-first-card = Esparru zehatzerako gure lehen atalean laguntza ari zara
target-segment-generic-card = Esparru zehatzerako atal batean laguntza ari zara
target-segment-first-banner = Lagundu esparru zehatzerako lehen { $locale } atala sortzen
target-segment-add-voice = Gehitu zure ahotsa
target-segment-learn-more = Ikasi gehiago

## Contribution Nav Items

contribute-voice-collection-nav-header = Ahotsak biltzea
contribute-sentence-collection-nav-header = Esaldiak biltzea

## Reporting

report = Salatu
report-title = Bidali salaketa bat
report-ask = Zein arazo duzu esaldi honekin?
report-offensive-language = Hizkuntza iraingarria
report-offensive-language-detail = Esaldiak errespeturik gabeko hizkuntza du edo hizkera iraingarria du.
report-grammar-or-spelling = Akats gramatikala / ortografikoa
report-grammar-or-spelling-detail = Esaldiak gramatika- edo ortografia-akats bat du.
report-different-language = Beste hizkuntza bat
report-different-language-detail = Hitz egiten ari naizen hizkuntza ez den beste batean idatzita dago.
report-difficult-pronounce = Ahoskatzeko zaila
report-difficult-pronounce-detail = Irakurtzeko edo ahoskatzeko zailak diren hitzak edo esaldiak ditu.
report-offensive-speech = Hizkuntza iraingarria
report-offensive-speech-detail = Grabazioak errespeturik gabeko hizkuntza du edo hizkera iraingarria du.
report-other-comment =
    .placeholder = Iruzkina
success = Ondo burutu da
continue = Jarraitu
report-success = Salaketa ondo bidali da

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = g
shortcut-record-toggle-label = Grabatu/Gelditu
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Grabatu berriz
shortcut-discard-ongoing-recording = ESK
shortcut-discard-ongoing-recording-label = Baztertu grabazioa hau
shortcut-submit = Sartu
shortcut-submit-label = Gorde grabazioak
request-language-text = Ez duzu zure hizkuntza Common Voicen ikusten oraindik?
request-language-button = Eskatu hizkuntza bat

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Erreproduzitu/Gelditu
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = b
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = e

## Validation criteria

contribution-criteria-nav = Irizpideak
contribution-criteria-link = Ulertu parte hartzeko irizpideak
contribution-criteria-page-title = Parte hartzeko irizpideak
contribution-criteria-page-description = Ulertu zer bilatu ahots-grabazioak entzuten dituzunean eta lagundu aberasten zure ahots-grabazioak!
contribution-for-example = adibidez
contribution-misreadings-title = Gaizki irakurriak
contribution-misreadings-description =
    Entzutean, egiaztatu kontu handiz grabatu dena zehazki idatzi dena dela; baztertu akats txikiena ere aurkitzen baldin baduzu.
    Akats ohikoenak honako hauek dira:
contribution-misreadings-description-extended-list-1 = Esaldiaren hasiera ez dago ondo grabatuta.
contribution-misreadings-description-extended-list-2 = Hitz baten bukaeran pluralaren <strong>'k'</strong> galtzea.
contribution-misreadings-description-extended-list-3 = Testuan ez dauden kontrakzio edo laburketak irakurtzea, adibidez "euki" "eduki"ren ordez.
contribution-misreadings-description-extended-list-4 = Azken hitzaren bukaera galtzea, grabazioa azkarregi gelditzeagatik.
contribution-misreadings-description-extended-list-5 = Hitz bat irakurtzeko saiakera bat baino gehiago egitea.
contribution-misreadings-example-1-title = Nahi duzuenean etorri etxera.
contribution-misreadings-example-2-title = Nahi duzunean etorri etxera.
contribution-misreadings-example-2-explanation = [‘duzuenean‘ beharko luke]
contribution-misreadings-example-3-title = Nahi duzuenean etorri etxe-.
contribution-misreadings-example-3-explanation = [Grabazioa eten da azken hitza bukatu aurretik]
contribution-misreadings-example-4-title = Nahi duzunean etorri etxera. Bai.
contribution-misreadings-example-4-explanation = [Behar zena baino gehiago grabatu da]
contribution-misreadings-example-5-title = Eduki mesedez giltza hau.
contribution-misreadings-example-6-title = Euki mesedez giltza hau.
contribution-misreadings-example-6-explanation = [‘eduki‘ beharko luke]
contribution-misreadings-example-7-title = Eduki mesedez giltz hau.
contribution-misreadings-example-7-explanation = [’giltza’ beharko luke]
contribution-misreadings-example-8-title = Margolan koloretsua da.
contribution-misreadings-example-8-explanation = [Okerreko edukia]
contribution-varying-pronunciations-title = Ahoskera desberdinak
contribution-varying-pronunciations-description = Grabazio bat okertzat ematean kontuz ibili irakurleak hitz bat gaizki irakurri badu, azentua okerreko lekuan jarri badu edo galdera bat zenik konturatu ez bada. Ahoskatzeko modu asko daude eta litekeena da horietako batzuk zuk inoiz entzun ez izana. Ulermen-tarte zabala eskaini beste era batera hitz egin dezaketenei.
contribution-varying-pronunciations-description-extended = Bestalde, irakurleak hitz horrekin inoiz topo egin ez eta gaizki ahoskatzen ari dela uste baduzu, baztertu. Ziur ez bazaude, erabili Saltatu botoia.
contribution-varying-pronunciations-example-1-title = Mila aldiz entzun dugu.
contribution-varying-pronunciations-example-1-explanation = [Irakurle batzuek ’il’ Manila bezala ahoskatzen dute eta beste batzuek Sevilla bezala]
contribution-varying-pronunciations-example-2-title = Mila aldiz entzun degu.
contribution-varying-pronunciations-example-2-explanation = [Euskalkien ahoskera ondo dago, baina idatzitako hitzak ezin dira aldatu. ’dugu’ badakar, ’dugu’ irakurri.]
contribution-background-noise-title = Atzealdeko zarata
contribution-background-noise-description = Ikasketa automatikoko algoritmoek askotariko atzealdeko zarata-motak kudeatzeko gai izatea nahi dugu, eta zarata handi samarrak ere onar daitezke, betiere hitz guzti-guztiak entzutea eragozten ez badute. Atzealdeko musika lasaia ondo dago; hitz guzti-guztiak entzutea galarazteko moduko bolumenean dagoen musika ez.
contribution-background-noise-description-extended = Baztertu grabazioa etenak edo karraskak baditu eta ezin bada testu osoa entzun.
contribution-background-noise-example-1-fixed-title = <strong>[Doministiku]</strong> Nahi duzuenean etorri <strong>[eztula]</strong> etxera.
contribution-background-noise-example-2-fixed-title = Nahi duzuenean <strong>[eztula]</strong> etxera.
contribution-background-noise-example-2-explanation = [Testuaren zati bat ez da entzuten]
contribution-background-noise-example-3-fixed-title = <strong>[Karrask]</strong> duzuenean etorri <strong>[karrask]</strong> -txera.
contribution-background-voices-title = Atzealdeko ahotsak
contribution-background-voices-description = Atzealdeko zalaparta apal bat ondo dago, baina ez dugu ahots gehigarririk nahi, algoritmo batek testuan ez dauden hitzak identifika ez ditzan. Baztertu grabazioa testukoak ez diren hitzak entzun badaitezke. Normalean, telebista piztuta uzten denean edo gertuko elkarrizketa bat izaten denean gertatzen da hori.
contribution-background-voices-description-extended = Baztertu grabazioa etenak edo karraskak baditu eta ezin bada testu osoa entzun.
contribution-background-voices-example-1-title = Nahi duzuenean etorri etxera. <strong>[ahots batek esana]</strong>
contribution-background-voices-example-1-explanation = Bazatoz? <strong>[beste norbaitek esana]</strong>
contribution-volume-title = Bolumena
contribution-volume-description = Bolumen aldaketa naturalak egongo dira irakurleen artean. Baztertu grabaketa bakarrik bolumena hain handia bada grabazioa eten egiten dela edo (ohikoagoa dena) hain baxua bada, ezin dela entzun esaten dena testu idatziari erreferentzia egin gabe.
contribution-reader-effects-title = Irakurlearen efektuak
contribution-reader-effects-description = Grabazio gehienak beren ahots naturalarekin hitz egiten duten pertsonenak dira. Noizbehinkako ezohiko grabazioa onar dezakezu; oihukatzen, xuxurlatzen edo era ‘dramatizatuan‘ egina. Baztertu grabazio abestuak eta ordenagailuz sortutako ahotsa erabiltzen dutenak.
contribution-just-unsure-title = Oraindik zalantzatan?
contribution-just-unsure-description = Irizpide hauek betetzen ez dituen zerbaitekin topo egiten baduzu, bozkatu zure sen onaren arabera. Benetan ezin baduzu erabaki, erabili Saltatu botoia eta jarraitu hurrengo grabazioarekin.
see-more = <chevron></chevron>Ikusi gehiago
see-less = <chevron></chevron>Ikusi gutxiago
