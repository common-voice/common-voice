action-click = Klikněte
action-tap = Klepněte
contribute = Přispět
review = Ověřujte
skip = Přeskočit
shortcuts = Zkratky
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> nahrávka
        [few] <bold>{ $count }</bold> nahrávky
       *[other] <bold>{ $count }</bold> nahrávek
    }
goal-help-recording = Pomohli jste Common Voice dosáhnout <goalPercentage></goalPercentage> denního cíle { $goalValue } nahrávek!
goal-help-validation = Pomohli jste Common Voice dosáhnout <goalPercentage></goalPercentage> denního cíle { $goalValue } ověřených nahrávek!
contribute-more =
    { $count ->
        [one] Jste připraveni udělat ještě { $count }?
        [few] Jste připraveni udělat ještě { $count }?
       *[other] Jste připraveni udělat ještě { $count }?
    }
speak-empty-state = Věty, které byste mohli ve vašem jazyce nahrát, nám už bohužel došly...
no-sentences-for-variants = Váš jazykový variant možná neobsahuje věty! Pokud vám to vyhovuje, můžete změnit nastavení a zobrazit další věty v rámci svého jazyka.
speak-empty-state-cta = Přidejte další věty
speak-loading-error =
    Další věty k přečtení již nemáme.
    Prosím, zkuste to znovu později.
record-button-label = Nahrajte svůj hlas
share-title-new = <bold>Pomozte nám</bold> najít další hlasy
keep-track-profile = Sledujte svůj pokrok pomocí profilu
login-to-get-started = Přihlaste se či zaregistrujte a můžete začít
target-segment-first-card = Přispíváte do prvního cílového segmentu
target-segment-generic-card = Přispíváte do cílového segmentu
target-segment-first-banner = Pomozte dosáhnout prvního cílového segmentu Common Voice v jazyce { $locale }
target-segment-add-voice = Přidejte svůj hlas
target-segment-learn-more = Zjistit více
change-preferences = Změnit předvolby

## Contribution Nav Items

contribute-voice-collection-nav-header = Sbírka hlasů
contribute-sentence-collection-nav-header = Sbírka vět

## Reporting

report = Hlášení
report-title = Nahlásit
report-ask = Jaké máte potíže s touto větou?
report-offensive-language = Urážky
report-offensive-language-detail = Věta obsahuje urážlivé nebo sprosté výrazy.
report-grammar-or-spelling = Gramatické chyby
report-grammar-or-spelling-detail = Věta obsahuje gramatické chyby nebo překlepy.
report-different-language = Jiný jazyk
report-different-language-detail = Věta je v jiném jazyce než jaký mám nastaven.
report-difficult-pronounce = Obtížná výslovnost
report-difficult-pronounce-detail = Věta obsahuje těžko čitelná a vyslovitelná slova nebo fráze.
report-offensive-speech = Urážky
report-offensive-speech-detail = Věta obsahuje urážlivé nebo sprosté výrazy.
report-other-comment =
    .placeholder = Komentář
success = Hotovo
continue = Pokračovat
report-success = Hlášení bylo odesláno

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Nahrát/Zastavit
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Nahrát klip znovu
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Zahodit probíhající nahrávku
shortcut-submit = Enter
shortcut-submit-label = Odeslat nahrávky
request-language-text = Nevidíte svůj jazyk na Common Voice?
request-language-button = Požádat o jazyk

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Přehrát/Zastavit
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kritéria
contribution-criteria-link = Kritéria pro přispívání
contribution-criteria-page-title = Kritéria pro přispívání
contribution-criteria-page-description = Na co se zaměřit při poslechu hlasových nahrávek i při pořizování vlastních nahrávek.
contribution-for-example = například
contribution-misreadings-title = Přeřeknutí
contribution-misreadings-description = Během poslechu dávejte bedlivě pozor, jestli nahrávka obsahuje přesně to, co je napsáno. Odmítněte nahrávku i pokud obsahuje jen drobnou chybu. <br />Mezi běžné chyby patří:
contribution-misreadings-description-extended-list-1 = Chybějící krátká slova jako <strong>'V'</strong> nebo <strong>'Pro'</strong> na začátku nahrávky.
contribution-misreadings-description-extended-list-2 = Chybí <strong>a</strong> na konci slova
contribution-misreadings-description-extended-list-3 = Čtení stažených tvarů, které tam ve skutečnosti nejsou, například "tys" místo "ty jsi" nebo naopak.
contribution-misreadings-description-extended-list-4 = Chybějící část posledního slova kvůli předčasně ukončenému nahrávání.
contribution-misreadings-description-extended-list-5 = Opakované přečtení téhož slova.
contribution-misreadings-example-1-title = Obří dinosauři z triasu.
contribution-misreadings-example-2-title = Obří dinosaurus z triasu.
contribution-misreadings-example-2-explanation = [Mělo by to být ‚dinosauři‘]
contribution-misreadings-example-3-title = Obří dinosauři z trias-.
contribution-misreadings-example-3-explanation = [Nahrávka přerušena před koncem posledního slova]
contribution-misreadings-example-4-title = Obří dinosauři z triasu. Ano.
contribution-misreadings-example-4-explanation = [Zaznamenáno více, než odpovídá textu]
contribution-misreadings-example-5-title = To ty jsi včera volala!
contribution-misreadings-example-6-title = To tys včera volala!
contribution-misreadings-example-6-explanation = [Mělo by být „Ty jsi“]
contribution-misreadings-example-7-title = To ty jsi včera <strong>za</strong>volala!
contribution-misreadings-example-7-explanation = [Text neobsahuje <strong>za</strong>volala]
contribution-misreadings-example-8-title = Kolem proletěl čmelák.
contribution-misreadings-example-8-explanation = [Jiný obsah]
contribution-varying-pronunciations-title = Rozmanitá výslovnost
contribution-varying-pronunciations-description = Speciální péči věnujte případnému zamítání nahrávek kvůli odlišně vyslovenému slovu, přízvuku nebo tónu věty. Ne každý vyslovuje stejně, jako vy, a v našem datasetu chceme zachytit výslovnost každého, pokud je správná.
contribution-varying-pronunciations-description-extended = Na druhou stranu pokud máte pocit, že autor nahrávky nějaké slovy nezná a pouze si vymyslel jeho výslovnost, neváhejte takovou nahrávku odmítnout. Pokud si nejste jistí, nahrávku přeskočte.
contribution-varying-pronunciations-example-1-title = Na hlavě měl baret.
contribution-varying-pronunciations-example-1-explanation = [‚Beret‘ je v pořádku, ať už s důrazem na první slabiku (UK) nebo druhou (USA)]
contribution-varying-pronunciations-example-2-title = Jeho ruka byla zdvi-žená.
contribution-varying-pronunciations-example-2-explanation = [‚Raised‘ se v angličtině vždy vyslovuje jako jedna slabika, ne dvě]
contribution-background-noise-title = Hluk v pozadí
contribution-background-noise-description = Chceme, aby algoritmy dokázali pracovat i v běžném prostředí, kde se může vyskytovat i poměrně silný hluk. I v nahrávce tak silný hluk nebrání jejímu přijetí, ovšem za předpokladu, že je slyšet celý text. Tichá hudba na pozadí ničemu nevadí. Pokud přes ni ale neuslyšíte něktére slovo, to už v pořádku není.
contribution-background-noise-description-extended = Pokud nahrávka šumí nebo v ní praská, a není slyšet celý text, odmítněte ji.
contribution-background-noise-example-1-fixed-title = <strong>[Kýchání]</strong> Obří dinosauři z <strong>[kašel]</strong> triasu.
contribution-background-noise-example-2-fixed-title = Obří dino <strong>[kašel]</strong> trias.
contribution-background-noise-example-2-explanation = [Část textu není slyšet]
contribution-background-noise-example-3-fixed-title = <strong>[Praskání]</strong> obří dinosauři z <strong>[praskání]</strong> -riassic.
contribution-background-voices-title = Hlasy v pozadí
contribution-background-voices-description = Nejasné vzdálené hlasy je v pořádku, ale zároveň v našem datasetu nechcete další hlasy, ze kterých by algoritmy mohly rozeznávat slova, které nejsou v původním textu. Pokud rozumíte hlasům na pozadí, co říkají, nahrávku byste měli odmítnout. Typickým příkladem je zapnutá televize, nebo rozhovor dalších lidí.
contribution-background-voices-description-extended = Pokud nahrávka šumí nebo v ní praská, a není slyšet celý text, odmítněte ji.
contribution-background-voices-example-1-title = Obří dinosauři z triasu. <strong>[přečteno jedním mluvčím]</strong>
contribution-background-voices-example-1-explanation = Jdeš? <strong>[další řečník]</strong>
contribution-volume-title = Hlasitost
contribution-volume-description = Hlasitost nahrávek od jednotlivých autorů se bude pochopitelně lišit. Nahrávky odmítejte jen pokud je hlasitost tak vysoká, že se nahrávka rozpadá, nebo (a to je častější) je nahrávka tak potichu, že bez přečtení napsaného textu nerozeznáte všechna slova.
contribution-reader-effects-title = Způsob řeči
contribution-reader-effects-description = Ve většině nahrávek lidé mluví normálním hlasem. Ale nevadí ani občasný zvýšený hlas, šeptání nebo "dramatický" přednes. Odmítněte však prosím zpěv a nahrávky počítačem syntetizovaným hlasem.
contribution-just-unsure-title = Jen si nejste jisti?
contribution-just-unsure-description = Pokud narazíte v nahrávce na problém, který tu nezmiňujeme, hlasujte o nahrávce podle svého nejlepšího úsudku. Pokud se nemůžete rozhodnout, nahrávku přeskočte.
see-more = <chevron></chevron> Zobrazit více
see-less = <chevron></chevron> Zobrazit méně
