action-click = Fă clic pe
action-tap = Atinge
contribute = Contribuie
review = Examinează
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
