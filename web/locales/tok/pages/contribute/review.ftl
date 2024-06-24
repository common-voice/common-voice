## REVIEW

sc-review-lang-not-selected = sina kepeken ala toki. o lukin e lipu jan sina. o kepeken toki.
sc-review-title = o lukin e sitelen
sc-review-loading = sitelen li kama…
sc-review-select-language = o kepeken toki la, sina ken lukin e sitelen
sc-review-no-sentences = sitelen sin li lon ala. <addLink>o pana e sitelen sin lon tenpo ni!</addLink>
sc-review-form-prompt =
    .message = sina lukin li pana ala e sitelen. sina wile ala wile pali e ni?
sc-review-form-usage = sina luka tawa poka pi sitelen pini (→) la, sina pona e sitelen. sina luka tawa poka pi sitelen open (←) la, sina ike e sitelen. sina luka tawa sewi (↑) la, sina weka e sitelen. o sona e ni: o pana e sona sina!
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = sitelen li tan ni: { $sentenceSource }
sc-review-form-button-reject = o ike
sc-review-form-button-skip = mi sona ala
sc-review-form-button-approve = o pona
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = p
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = i
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = w
sc-review-form-keyboard-usage-custom = sina ken kepeken e nena pi supa nena sina: sitelen li pona la, o kepeken nena { sc-review-form-button-approve-shortcut }. sitelen li pona ala la, o kepeken nena { sc-review-form-button-reject-shortcut }. sina sona ala la, o kepeken nena { sc-review-form-button-skip-shortcut }.
sc-review-form-button-submit =
    .submitText = o pini e lukin
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] sina lukin e sitelen ala.
        [one] sina lukin e sitelen wan. sina pona!
        [2] sina lukin e sitelen tu. sina pona!
        [3] sina lukin e sitelen tu wan. sina pona!
        [4] sina lukin e sitelen tu tu. sina pona!
        [5] sina lukin e sitelen luka. sina pona!
        [6] sina lukin e sitelen luka wan. sina pona!
        [7] sina lukin e sitelen luka tu. sina pona!
        [8] sina lukin e sitelen luka tu wan. sina pona!
        [9] sina lukin e sitelen luka tu tu. sina pona!
        [10] sina lukin e sitelen luka luka. sina pona!
       *[other] sina lukin e sitelen { $sentences }. sina pona!
    }
sc-review-form-review-failure = mi ken ala awen e lukin. o pali sin e ni lon tenpo kama.
sc-review-link = o lukin

## REVIEW CRITERIA

sc-criteria-modal = nasin pona
sc-criteria-title = nasin pona
sc-criteria-make-sure = sitelen li pona tan ni:
sc-criteria-item-1 = sitelen lili ale o pona nasin lon nimi ale pi toki ni.
sc-criteria-item-2 = toki ni o kepeken nasin toki pona.
sc-criteria-item-3 = toki ni o ken tawa kalama uta.
sc-criteria-item-4 = sitelen li pona la, o pilin e nena &quot;o pona&quot; lon poka.
sc-criteria-item-5-2 = sitelen li pona ala la, o pilin e nena &quot;o weka&quot; lon poka. sina sona ala la, o tawa sitelen sin.
sc-criteria-item-6 = sitelen sin li lon ala la, o kama jo, o pana e ona sin!

## LANGUAGE VARIANT CODES


## REVIEW PAGE

report-sc-different-language = toki ante
review-error = sina lukin e sitelen la pakala li kama
review-error-rate-limit-exceeded = sina kepeken tenpo pi lili ike. o lukin e sitelen lon tenpo pona, o sona e pona ona.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = mi kama e ante suli

