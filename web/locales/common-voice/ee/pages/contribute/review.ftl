## REVIEW

# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Àteŋu azã Keyboard  hã: { sc-review-form-button-approve-shortcut } atsɔ ada asi ɖe edzi, { sc-review-form-button-reject-shortcut } agbe, { sc-review-form-button-skip-shortcut } atsɔ adzo
sc-review-form-button-submit =
    .submitText = Wu Totoɖeme Nu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Wometo nyagbe aɖeke me o.
        [one] 1 nyagbe si wogbugbɔ to. Akpe na wò!
       *[other] { $sentences } nyagbe siwo wogbugbɔ to. Akpe na wò!
    }
sc-review-form-review-failure = Womete ŋu dzra numetotoa ɖo o. Taflatse gadze agbagba.
sc-review-link = Dzro eme

## REVIEW CRITERIA

sc-criteria-modal = To Dzesiwo Me
sc-criteria-title = To Dzesiwo Me
sc-criteria-make-sure = Ele be nyagbea naɖo dzidzenu siwo gbɔna gbɔ:
sc-criteria-item-1 = Ele be woaŋlɔ nyagbea nyuie.
sc-criteria-item-2 = Ele be nyagbea nasɔ le gbeŋutise nu.
