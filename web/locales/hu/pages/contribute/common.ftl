## Contribution

action-click = Kattintson
action-tap = Koppintson
## Languages

contribute = Közreműködés
review = Ellenőrzés
skip = Kihagyás
shortcuts = Gyorsbillentyűk
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> klip
       *[other] <bold>{ $count }</bold> klip
    }
goal-help-recording = Segített a Common Voice-nak elérni a napi rögzítési cél ({ $goalValue }) <goalPercentage></goalPercentage>-át.
goal-help-validation = Segített a Common Voice-nak elérni a napi ellenőrzési cél ({ $goalValue }) <goalPercentage></goalPercentage>-át!
contribute-more = Készen áll még { $count } felvételre?
speak-empty-state = Elfogytak az felvételre váró mondatok ezen a nyelven…
speak-empty-state-cta = Mondatok hozzáadása
speak-loading-error =
    Nem tudtunk felolvasható mondatokat lekérni.
    Próbálja újra később.
record-button-label = Rögzítse a hangját
share-title-new = <bold>Segítsen nekünk</bold> további hangokat találni
keep-track-profile = Kövesse nyomon az előrehaladását egy profil segítségével
login-to-get-started = A kezdéshez jelentkezzen be vagy regisztráljon
target-segment-first-card = Közreműködik az első célszegmensünkben
target-segment-generic-card = Közreműködik egy célszegmensben
target-segment-first-banner = Segítsen a Common Voice első { $locale } célszegmensének létrehozásában
target-segment-add-voice = Adja a hangját
target-segment-learn-more = További tudnivalók
change-preferences = Beállítások módosítása

## Contribution Nav Items

contribute-voice-collection-nav-header = Hanggyűjtemény
contribute-sentence-collection-nav-header = Mondatok gyűjtése

## Reporting

report = Jelentés
report-title = Jelentés beküldése
report-ask = Milyen problémákat tapasztal ennél a mondatnál?
report-offensive-language = Sértő szóhasználat
report-offensive-language-detail = A mondat tiszteletlen vagy sértő nyelvezetet tartalmaz.
report-grammar-or-spelling = Nyelvtani / helyesírási hiba
report-grammar-or-spelling-detail = A mondat nyelvtani vagy helyesírási hibát tartalmaz.
report-different-language = Más nyelv
report-different-language-detail = Ez más nyelven íródott, mint amit beszélek.
report-difficult-pronounce = Nehéz kimondani
report-difficult-pronounce-detail = Olyan szavakat vagy kifejezéseket tartalmaz, amelyeket nehéz elolvasni vagy kiejteni.
report-offensive-speech = Sértő beszéd
report-offensive-speech-detail = A klip tiszteletlen vagy sértő nyelvezetet tartalmaz.
report-other-comment =
    .placeholder = Megjegyzés
success = Sikeres
continue = Folytatás
report-success = A jelentés sikeresen beküldve

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = k

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Rözgzítés/leállítás
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Klip újrarögzítése
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = A folyamatban lévő felvétel elvetése
shortcut-submit = Enter
shortcut-submit-label = Klipek beküldése
request-language-text = Nem látja az anyanyelvét a Common Voice-on?
request-language-button = Nyelv kérése

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = l
shortcut-play-toggle-label = Lejátszás/leállítás
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = i
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Feltételek
contribution-criteria-link = Közreműködési feltételek megértése
contribution-criteria-page-title = Közreműködési feltételek
contribution-criteria-page-description = Értse meg, hogy mire kell figyelnie, amikor a hangklipeket meghallgatja, és segítsen gazdagabbá tenni a saját hangfelvételeit is.
contribution-for-example = például
contribution-misreadings-title = Félreolvasások
contribution-misreadings-description = Hallgatáskor nagyon gondosan ellenőrizze, hogy ami rögzítve lett, az pontosan egyezik-e a leírtakkal; akkor is utasítsa el, ha kisebb hibák vannak. <br />Nagyon gyakori hibák:
contribution-misreadings-description-extended-list-1 = Hiányzó névelő a felvétel elején.
contribution-misreadings-description-extended-list-2 = Hiányzó többes szám a szó végén.
contribution-misreadings-description-extended-list-3 = Olyan összevonások felolvasása, melyek nem szerepelnek a szövegben.
contribution-misreadings-description-extended-list-4 = Hiányzó utolsó szó a felvétel túl gyors befejezése miatt.
contribution-misreadings-description-extended-list-5 = Többszöri próbálkozás egy szó felolvasására.
contribution-misreadings-example-1-title = A triász óriás dinoszauruszai.
contribution-misreadings-example-2-title = A triász óriás dinoszaurusza.
contribution-misreadings-example-2-explanation = [Ennek kellene lennie: „dinoszauruszai”]
contribution-misreadings-example-3-title = A triász óriás dinoszaurusz-.
contribution-misreadings-example-3-explanation = [A felvétel az utolsó szó vége előtt megszakadt]
contribution-misreadings-example-4-title = A triász óriás dinoszauruszai. Igen.
contribution-misreadings-example-4-explanation = [Több lett rögzítve, mint a szükséges szöveg]
contribution-misreadings-example-5-title = Kimegyünk kávézni.
contribution-misreadings-example-6-title = Elmegyünk kávézni.
contribution-misreadings-example-6-explanation = [Ennek kellene lennie: „Kimegyünk”]
contribution-misreadings-example-7-title = Megyünk kávézni.
contribution-misreadings-example-7-explanation = [Hiányzik az igekötő]
contribution-misreadings-example-8-title = A dongó elszállt.
contribution-misreadings-example-8-explanation = [Nem egyező tartalom]
contribution-varying-pronunciations-title = Változó kiejtések
contribution-varying-pronunciations-description = Legyen óvatos, mielőtt elutasít azért egy klipet, mert az olvasó hibásan ejtett ki egy szót, rossz helyre tette a hangsúlyt, vagy figyelmen kívül hagyott egy kérdőjelet. Sokféle kiejtést használnak, és nem biztos, hogy mindet hallotta a helyi közösségében. Vegye figyelembe, hogy mások másképpen beszélnek.
contribution-varying-pronunciations-description-extended = Másrészt, ha úgy gondolja, hogy az olvasó valószínűleg még soha nem találkozott a szóval, és egyszerűen csak tévesen tippelt a kiejtésre, akkor utasítsa el. Ha bizonytalan, használja a kihagyás gombot.
contribution-varying-pronunciations-example-1-title = Béla biciklizni ment.
contribution-varying-pronunciations-example-1-explanation = [A hasonulás miatt egyesek úgy ejtik a biciklizni szót, hogy „biciglizni”]
contribution-varying-pronunciations-example-2-title = Attila felemelte a kezét.
contribution-varying-pronunciations-example-2-explanation = [Az Attila név kiejtése „atilla”]
contribution-background-noise-title = Háttérzaj
contribution-background-noise-description = Azt szeretnénk, hogy a gépi tanulási algoritmusok kezelni tudják a háttérzajt, és még a relatíve hangos zajok is elfogadhatóak, feltéve, hogy az nem akadályozza a szöveg egészének megértését. A halk háttérzene rendben van; az olyan hangos zene, amelytől nem hallani minden egyes szót, már baj.
contribution-background-noise-description-extended = Ha a felvétel szakadozik vagy recseg, akkor utasítsa el, hacsak nem hallható a szöveg teljes egésze.
contribution-background-noise-example-1-fixed-title = <strong>[Tüsszentés]</strong> A triász <strong>[köhögés]</strong> óriás dinoszauruszai.
contribution-background-noise-example-2-fixed-title = A triász <strong>[köhögés]</strong> dinoszauruszai.
contribution-background-noise-example-2-explanation = [A szöveg egy része nem hallható]
contribution-background-noise-example-3-fixed-title = <strong>[Recsegés]</strong> triász óriás dino<strong>[ropogás]</strong>szai.
contribution-background-voices-title = Hangok a háttérben
contribution-background-voices-description = A csendes háttérzaj rendben van, de nem szeretnénk további beszédhangokat, melyek miatt a gépi algoritmus olyan szavakat ismerne fel, mely nincs az írott szövegben. Ha a szövegtől eltérő szavakat hall, akkor a klipet el kell utasítani. Ez általában akkor történik, ha a TV-t úgy felejtik, vagy valakik beszélgetnek a közelben.
contribution-background-voices-description-extended = Ha a felvétel szakadozik vagy recseg, akkor utasítsa el, hacsak nem hallható a szöveg teljes egésze.
contribution-background-voices-example-1-title = A triász óriás dinoszauruszai. <strong>[egy hangon felolvasva]</strong>
contribution-background-voices-example-1-explanation = Jössz? <strong>[más szól neki]</strong>
contribution-volume-title = Hangerő
contribution-volume-description = Természetes eltérések lesznek az olvasók hangereje között. Csak azokat utasítsa el, ahol a hangerő olyan magas, hogy szétesik a felvétel, vagy (ami gyakrabban előfordul) olyan halk, hogy az írott szöveg nélkül nem érti, hogy pontosan mit is olvas fel.
contribution-reader-effects-title = Felolvasói hatások
contribution-reader-effects-description = A legtöbb felvételen az emberek a természetes hangjukon beszélnek. Elfogadhatja az alkalmi nem szokásos felvételeket, amelyen kiabálnak, suttognak vagy csak „drámai” hangok olvassák fel. Viszont a felénekelt vagy számítógéppel szintetizált felvételeket utasítsa el.
contribution-just-unsure-title = Csak bizonytalan?
contribution-just-unsure-description = Ha olyan dologgal találkozik, amelyre ezek az irányelvek nem vonatkoznak, akkor szavazzon a legjobb megítélése szerint. Ha valóban nem tud dönteni, akkor használja a kihagyás gombot, és folytassa a következő felvétellel.
see-more = <chevron> </chevron> További információk
see-less = <chevron> </chevron> Kevesebb információ

