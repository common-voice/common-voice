## REVIEW

sc-review-lang-not-selected = ᱟᱢ ᱫᱚ ᱚᱠᱟ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣ ᱟᱠᱟᱫᱟᱢ᱾ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ <profileLink> ᱢᱚᱦᱚᱨ </profileLink> ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ᱾
sc-review-title = ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱧᱮᱞ ᱵᱤᱲᱟᱹᱣ ᱢᱮ
sc-review-loading = ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱞᱟᱫᱮᱜ ᱠᱟᱱᱟ…
sc-review-select-language = ᱟᱹᱛᱟᱹᱛ ᱧᱮᱞ ᱵᱤᱲᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾
sc-review-no-sentences = ᱧᱮᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱟᱹᱭᱟᱹᱛ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ <addLink> ᱟᱨᱦᱚᱸ ᱟᱹᱭᱟᱹᱛ ᱱᱤᱛᱚᱜ ᱥᱮᱞᱮᱫ ᱢᱮ!</addLink>
sc-review-form-prompt =
    .message = ᱧᱮᱧᱮᱞ ᱠᱟᱱ ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱵᱟᱝ ᱡᱚᱢᱟ ᱠᱟᱱᱟ, ᱥᱟᱹᱨᱤ ᱛᱮ?
sc-review-form-usage = ᱟᱹᱭᱟᱹᱛ ᱦᱮᱸᱥᱤᱭᱟᱹᱨ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱡᱚᱢ ᱛᱤ ᱛᱮ ᱠᱷᱚᱥᱨᱚᱫ ᱢᱮ᱾ ᱞᱮᱸᱜᱟ ᱛᱤ ᱠᱷᱟᱱ ᱫᱚ ᱵᱟᱹᱨᱜᱤᱞ ᱞᱟᱹᱜᱤᱫ᱾ ᱟᱲᱟᱜ ᱠᱟᱹᱜᱤᱫ ᱫᱚ ᱪᱮᱛᱟᱱ ᱥᱮᱫ ᱠᱷᱚᱥᱨᱚᱫᱽ ᱢᱮ᱾ <strong> ᱟᱢᱟᱜ ᱧᱮᱞ ᱵᱤᱲᱟᱹᱣ ᱠᱚ ᱡᱚᱢᱟ ᱟᱞᱚᱢ ᱦᱤᱲᱤᱧᱟ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ᱥᱨᱚᱛ: { $sentenceSource }
sc-review-form-button-reject = ᱵᱟᱹᱨᱜᱤᱞ
sc-review-form-button-skip = ᱟᱲᱟᱜ
sc-review-form-button-approve = ᱮᱢ ᱦᱚᱪᱚ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = ᱟᱢ ᱫᱚ ᱠᱤᱵᱚᱰ ᱨᱮᱭᱟᱜ ᱥᱚᱴᱠᱚᱴ ᱵᱮᱵᱷᱟᱨ ᱫᱚᱲᱮᱭᱟᱜᱼᱟᱢ : ᱦᱮᱸ ᱞᱟᱹᱜᱤᱫ { sc-review-form-button-approve-shortcut }, ᱨᱤᱡᱮᱠᱴ ᱞᱟᱹᱜᱤᱫ { sc-review-form-button-reject-shortcut }, ᱟᱲᱟᱜ ᱞᱟᱹᱜᱤᱫ { sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = ᱧᱮᱧᱮᱞ ᱠᱚ ᱪᱟᱵᱟᱭ ᱢᱮ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱵᱟᱝ ᱧᱮᱧᱮᱞ ᱠᱟᱱᱟ᱾
        [one] 1 ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱧᱮᱧᱮᱞ ᱠᱟᱱᱟ᱾ ᱥᱟᱨᱦᱟᱣ!
        [two] { $sentences } ᱟᱹᱭᱟᱹᱛ ᱠᱤᱱ ᱧᱮᱧᱮᱞ ᱠᱟᱱᱟ᱾ ᱥᱟᱨᱦᱟᱣ!
       *[other] { $sentences } ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱧᱮᱧᱮᱞ ᱠᱟᱱᱟ᱾ ᱥᱟᱨᱦᱟᱣ!
    }
sc-review-form-review-failure = ᱧᱮᱧᱮᱞ ᱥᱟᱧᱪᱟᱣ ᱵᱟᱝ ᱜᱟᱱ ᱞᱮᱱᱟ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱛᱟᱭᱚᱢ ᱛᱮ ᱪᱮᱥᱴᱟᱭ ᱢᱮ᱾
sc-review-link = ᱧᱮᱞ ᱫᱚᱦᱲᱟ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ ᱧᱮᱧᱮᱞ ᱢᱟᱱᱫᱚᱸᱰ
sc-criteria-title = ᱧᱮᱧᱮᱞ ᱢᱟᱱᱫᱚᱸᱰ
sc-criteria-make-sure = ᱵᱟᱲᱟᱭ ᱠᱟᱜ ᱢᱮ ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱱᱚᱶᱟ ᱠᱚ ᱢᱟᱯᱫᱚᱱᱰ ᱯᱩᱨᱟᱹᱣᱮᱫ ᱟᱭ:
sc-criteria-item-1 = ᱟᱹᱭᱟᱹᱛ ᱫᱚ ᱵᱮᱥ ᱪᱚᱨᱚᱠ ᱩᱪᱨᱚᱬ ᱠᱚᱜ ᱢᱟᱸ᱾
sc-criteria-item-2 = ᱟᱹᱭᱟᱹᱛ ᱫᱚ ᱵᱮᱥ ᱪᱚᱨᱚᱠ ᱨᱚᱱᱚᱲ ᱛᱮ ᱴᱷᱤᱠ ᱛᱟᱦᱮᱸᱱ ᱢᱟᱸ᱾
sc-criteria-item-3 = ᱟᱹᱭᱟᱹᱛ ᱫᱚ ᱢᱮᱱᱚᱜᱚᱜ ᱢᱟᱸ᱾
sc-criteria-item-4 = ᱡᱩᱫᱤ ᱡᱷᱟᱛᱚ ᱢᱟᱯᱫᱚᱱᱰ ᱚᱱᱟ ᱟᱹᱭᱟᱹᱛ ᱯᱩᱨᱟᱹᱣᱮᱫ ᱠᱷᱟᱱ, ᱡᱟᱡᱚᱢ ᱛᱤ ᱯᱟᱦᱴᱟ ᱨᱮᱭᱟᱜ &quot; ᱦᱮᱸ&quot; ᱵᱩᱛᱟᱹᱢ ᱨᱮ ᱚᱛᱟᱭ ᱢᱮ᱾
sc-criteria-item-5-2 = ᱡᱩᱫᱤ ᱚᱱᱟ ᱟᱹᱭᱟᱹᱛ ᱫᱚ ᱚᱱᱟ ᱢᱟᱯᱫᱚᱱᱰ ᱨᱮ ᱵᱟᱝ ᱨᱮᱵᱮᱱ ᱠᱷᱟᱱ, ᱞᱮᱝᱜᱟ ᱛᱤ ᱯᱟᱦᱴᱟ ᱨᱮᱭᱟᱜ &quot; ᱵᱟᱹᱨᱜᱤᱞ‌ &quot;ᱵᱩᱛᱟᱹᱢ ᱚᱛᱟᱭ ᱢᱮ᱾
sc-criteria-item-6 = ᱡᱩᱫᱤ ᱧᱮᱞ ᱵᱤᱲᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱟᱹᱭᱟᱹᱛ ᱫᱚᱨᱠᱟᱨ ᱠᱷᱟᱱ, ᱟᱨᱦᱚᱸ ᱟᱹᱭᱟᱹᱛ ᱠᱚ ᱡᱟᱣᱨᱟ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱜᱚᱲᱚ ᱮᱢᱟ ᱞᱮᱢ!
