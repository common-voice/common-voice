action-click = Dă clic pe
action-tap = Atinge
contribute = Contribuie
review = Verifică
skip = Sari peste
shortcuts = Comenzi rapide
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> secvență vocală
        [few] <bold>{ $count }</bold> secvențe vocale
       *[other] <bold>{ $count }</bold> de secvențe vocale
    }
goal-help-recording = Ai ajutat Common Voice să atingă <goalPercentage></goalPercentage> din obiectivul zilnic de { $goalValue } înregistrări!
goal-help-validation = Ai ajutat Common Voice să atingă <goalPercentage></goalPercentage> din obiectivul zilnic de { $goalValue } validări!
contribute-more =
    { $count ->
        [one] Gata pentru încă { $count }?
        [few] Gata pentru încă { $count }?
       *[other] Gata pentru încă { $count }?
    }
speak-empty-state = Nu mai avem propoziții de înregistrat în această limbă...
no-sentences-for-variants = Se poate să nu mai existe propoziții pentru varietatea ta de limbă. Dacă dorești, îți poți modifica setările pentru a vedea și alte propoziții în limba ta.
speak-empty-state-cta = Contribuie cu propoziții
speak-loading-error =
    Nu am găsit nicio propoziție pe care să o citești.
    Te rugăm să încerci din nou mai târziu.
record-button-label = Înregistrează-ți vocea
share-title-new = <bold>Ajută-ne</bold> să găsim mai multe voci
keep-track-profile = Urmărește-ți progresul cu ajutorul unui profil
login-to-get-started = Autentifică-te sau înscrie-te pentru a începe
target-segment-first-card = Contribui la primul nostru segment-țintă
target-segment-generic-card = Contribui la un segment-țintă
target-segment-first-banner = Ajută-ne să creăm primul segment-țintă Common Voice în { $locale }
target-segment-add-voice = Adaugă-ți vocea
target-segment-learn-more = Află mai multe
change-preferences = Modifică preferințele
login-signup = Autentificare / Înregistrare
vote-yes = Da
vote-no = Nu
datasets = Seturi de date
languages = Limbi
about = Despre noi
partner = Parteneri
submit-form-action = Trimite

## Reporting

report = Semnalează
report-title = Trimite o sesizare
report-ask = Ce probleme întâmpini cu această propoziție?
report-offensive-language = Limbaj ofensator
report-offensive-language-detail = Propoziția conține limbaj disprețuitor sau ofensator.
report-grammar-or-spelling = Greșeală gramaticală / ortografică
report-grammar-or-spelling-detail = Propoziția conține o greșeală gramaticală sau ortografică.
report-different-language = Limbă diferită
report-different-language-detail = Propoziția este scrisă într-o limbă diferită față de ceea pe care o vorbesc.
report-difficult-pronounce = Dificilă de pronunțat
report-difficult-pronounce-detail = Propoziția conține cuvinte sau sintagme care sunt dificil de citit sau de pronunțat.
report-offensive-speech = Discurs ofensator
report-offensive-speech-detail = Secvența vocală conține limbaj disprețuitor sau ofensator.
report-other-comment =
    .placeholder = Comentariu
success = Succes
continue = Continuă
report-success = Sesizarea a fost transmisă cu succes

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Înregistrează/Oprește
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Reînregistrează secvența vocală
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Renunță la înregistrarea în curs
shortcut-submit = Înapoi
shortcut-submit-label = Trimite secvențele audio
request-language-text = Încă nu îți vezi limba pe Common Voice?
request-language-button = Solicită o limbă

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Redare/Oprire
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criterii
contribution-criteria-link = Care sunt criteriile de contribuție?
contribution-criteria-page-title = Criterii de contribuție
contribution-criteria-page-description = Înțelege la ce trebuie să fii atent atunci când evaluezi secvențele audio existente și îmbunătățește-ți astfel și propriile înregistrări viitoare!
contribution-for-example = de exemplu
contribution-misreadings-title = Cuvinte citite greșit
contribution-misreadings-description = Când asculți, verifică foarte atent dacă ceea ce a fost înregistrat este exact ceea ce a fost scris; respinge înregistrarea chiar dacă are doar mici erori. <br />Printre greșelile foarte frecvente se numără:
contribution-misreadings-description-extended-list-1 = Înregistrarea începe fără cuvinte scurte precum <strong>'Un'</strong>, <strong>'O'</strong>, <strong>'A'</strong>, <strong>'Au'</strong>, etc.
contribution-misreadings-description-extended-list-2 = Nu se aud clar particulele ce indică pluralul precum <strong>'e'</strong> sau <strong>'i'</strong>, sau articolele hotărâte de la sfârșitul cuvintelor, sau, în general ultima literă sau silabă. Altă situație implică accentul schimbat pe altă silabă, de exemplu între pluralul nearticulat <strong>'copii'</strong> și pluralul articulat <strong>'copiii'</strong>.
contribution-misreadings-description-extended-list-3 = Citirea împreună a cuvintelor atunci când nu sunt scrise cu cratimă, cum ar fi „mare-a fost mirarea lor” în loc de „mare a fost mirarea lor”, sau invers.
contribution-misreadings-description-extended-list-4 = Omiterea sfârșitului ultimului cuvânt prin întreruperea prematură a înregistrării.
contribution-misreadings-description-extended-list-5 = Citirea repetată a aceluiași cuvânt (pentru a corecta pronunția).
contribution-misreadings-example-1-title = Copiii au luat legătura cu autoritățile.
contribution-misreadings-example-2-title = Copii au luat legătura cu autoritățile.
contribution-misreadings-example-2-explanation = [Ar trebui scris și pronunțat ‘copiii’, cu accentul pe ultima silabă]
contribution-misreadings-example-3-title = Copiii au luat legătura cu autorități-.
contribution-misreadings-example-3-explanation = [Înregistrarea a fost întreruptă înainte de sfârșitul ultimului cuvânt]
contribution-misreadings-example-4-title = Copiii au luat legătura cu autoritățile. Așa.
contribution-misreadings-example-4-explanation = [Înregistrarea conține mai mult decât textul scris pe ecran]
contribution-misreadings-example-5-title = Lucrarea pe care a terminat-o nu a impresionat.
contribution-misreadings-example-6-title = Lucrarea pe care-a terminat-o nu a impresionat.
contribution-misreadings-example-6-explanation = [Ar trebui să fie „pe care a”]
contribution-misreadings-example-7-title = Lucrarea pe care a terminat-o nu m-a impresionat.
contribution-misreadings-example-7-explanation = [Nu există „m-” în textul original]
contribution-misreadings-example-8-title = Bondarul a zburat pe lângă ei cu viteză.
contribution-misreadings-example-8-explanation = [Textul citit nu corespunde textului scris]
contribution-varying-pronunciations-title = Pronunții diverse
contribution-varying-pronunciations-description = Ai grijă înainte de a respinge o secvență audio pe motiv că cititorul a pronunțat greșit un cuvânt, a pus accentul pe silaba greșită sau a ignorat un semn de întrebare. Chiar dacă nu ai mai auzit o astfel de pronunție sau un astfel de accent în comunitatea ta, nu înseamnă neapărat că sunt automat și incorecte. Gândește-te că unii pot vorbi un pic diferit față de tine.
contribution-varying-pronunciations-description-extended = Pe de altă parte, când consideri că persoana care citește nu a mai întâlnit cuvântul respectiv și doar ghicește (incorect, în cazul de față) cum ar trebui pronunțat, te rugăm să respingi acea înregistrare. Dacă nu ești sigur, folosește butonul „Sari peste”.
contribution-varying-pronunciations-example-1-title = Sigur nu ne vom mai vedea.
contribution-varying-pronunciations-example-1-explanation = [„Sigur” este pronunțat corect chiar dacă se pune accentul pe prima silabă (cum o fac vorbitorii din Moldova sau Țara Românească) sau pe a doua (cum o fac vorbitorii din Transilvania)]
contribution-varying-pronunciations-example-2-title = Nu fi rău!
contribution-varying-pronunciations-example-2-explanation = [Verbul „a fi” la infinitiv şi formele compuse cu el (cond. prez., imper. neg. pers. a 2-a sg., ind. viit., cond. perf., conj. perf., viit. anter.): a fi, aş fi, nu fi, voi fi, aş fi citit, să fi citit, voi fi citit) NU se scriu și NU se pronunță cu doi de „i”: „fii”]
contribution-background-noise-title = Zgomot de fundal
contribution-background-noise-description = Ne dorim ca algoritmii de învățare automată să poată funcționa chiar și atunci când există o varietate de zgomote de fundal. De fapt, chiar și zgomotele relativ puternice pot fi acceptate, cu condiția să nu împiedice auzirea întregului text. Muzica liniștită de fundal este acceptabilă, dar muzica suficient de tare pentru a împiedica auzirea fiecărui cuvânt în parte, nu.
contribution-background-noise-description-extended = Respinge înregistrările care se întrerup uneori sau care au foșnituri, fâșâituri și alte interferențe, cu excepția cazului în care întreg textul poate fi totuși auzit.
contribution-background-noise-example-1-fixed-title = <strong>[Strănut puternic]</strong> Lucrarea pe care-a terminat-o nu a <strong>[tuse repetată]</strong> impresionat.
contribution-background-noise-example-2-fixed-title = Lucrarea pe care a terminat-o <strong>[tuse puternică]</strong> impresionat.
contribution-background-noise-example-2-explanation = [O parte a textului nu se aude]
contribution-background-noise-example-3-fixed-title = <strong>[Fâșâit]</strong> pe care a terminat- <strong>[fâșâit]</strong> -sionat.
contribution-background-voices-title = Voci de fundal
contribution-background-voices-description = Mai multe zgomote de fundal în surdină sunt acceptabile, dar nu avem nevoie de voci suplimentare care ar putea face un algoritm să identifice cuvinte care nu se găsesc de fapt în textul scris. Dacă înregistrarea conține și alte cuvinte față de cele din text, trebuie să o respingi. De obicei, acest lucru se întâmplă atunci când este și un televizor deschis sau o conversație paralelă în apropiere.
contribution-background-voices-description-extended = Respinge înregistrările care se întrerup uneori sau care au foșnituri, fâșâituri și alte interferențe, cu excepția cazului în care întreg textul poate fi totuși auzit.
contribution-background-voices-example-1-title = Dinozaurii giganți ai Triasicului. <strong>[text citit de o voce]</strong>
contribution-background-voices-example-1-explanation = Haide, vii? <strong>[strigă altcineva în apropiere]</strong>
contribution-volume-title = Volumul înregistrării
contribution-volume-description = Este de așteptat să existe variații de volum între înregistrări. Respinge secvența audio doar dacă volumul este atât de ridicat încât înregistrarea se întrerupe sau, mai frecvent, dacă este atât de scăzut încât nu poți auzi și înțelege ce se spune fără să te uiți și la textul scris.
contribution-reader-effects-title = Particularități ale vocilor cititorilor
contribution-reader-effects-description = Majoritatea înregistrărilor sunt făcute de oameni care citesc cu vocea lor obișnuită. Poți accepta uneori și înregistrări mai neobișnuite care sunt strigate, șoptite, sau declamate ca într-o piesă de teatru. Acestea fiind spuse, trebuie respinse înregistrările cântate, precum și cele care utilizează o voce artificială, sintetizată de calculator.
contribution-just-unsure-title = Eziți?
contribution-just-unsure-description = Dacă dai peste un aspect care nu a fost menționat în aceste instrucțiuni, folosește-ți intuiția de vorbitor nativ. Dacă nu te poți hotărî, apasă pe butonul „Sari peste” și treci la următoarea înregistrare.
see-more = <chevron></chevron>Vezi mai multe
see-less = <chevron></chevron>Vezi mai puține
