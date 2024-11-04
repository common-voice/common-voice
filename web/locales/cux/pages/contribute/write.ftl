## WRITE PAGE

write = Dijud
write-instruction = Kuned <icon></icon> ama nudu chi nukueñ kadi nichiñ
write-page-subtitle = Nudu chi kuné mu'u, -0 a di du'u nu kadi tubi
sentence =
    .label = Nudu
sentence-input-placeholder = Mu'u kuned nudu chi nukueñ kadi tubiy
small-batch-sentence-input-placeholder = Mu'u kuned nudud chi nukeñ kadi tubiy
citation-input-placeholder = kunëd a tí nakad nudu kú (kané chi kunëd)
citation =
    .label = kunejüd a ti nakad
sc-write-submit-confirm = Nudu kun <wikipediaLink>a di du'u nu kadi tubi</wikipediaLink> y kadi kuea
sc-review-write-title = ¿A dae nudu kadi kunu?
sc-review-small-batch-title = ¿A taka kadi kunu ndee nudu?
new-sentence-rule-1 = <noCopyright>A didú'unu kadi nichi</noCopyright>(<cc0>cc-0</cc0>)
new-sentence-rule-2 = Gua kané chi cho'oo nitiñu nudu chi dijüd
new-sentence-rule-3 = Yeabea dijud nudu
new-sentence-rule-4 = Nóo dijud nudu
new-sentence-rule-5 = Gua snú duchan ni gua snu nudu chi ji'ïi
new-sentence-rule-6 = Gua nudña'a kanejú
new-sentence-rule-7 = Yeabea kunejüd a tí nakad ama nudu
new-sentence-rule-8 = Kané chi  nané'e nudu chi kanejú (tumin kadi kueñ)
login-instruction-multiple-sentences = <loginLink>Kunód</loginLink> o <loginLink>kunejüd</loginLink> dí tumin kadi chi ñó nudu dicho'od
how-to-cite = ¿A taka kadi kunejü?
how-to-cite-explanation-bold = Kunejüd nuku ama URL o chi jobe kaka nochi nakad nudu.
how-to-cite-explanation = Nichi nudu ñe'edin kunejüd <italicizedText>“chi ñe'ed”</italicizedText>. Ne'e kadinun a tí nakad tumin kadi nún a kuaku chi a di du'unuñ kadi túbiy nudu kú. Nichi ne'e <guidelinesLink>kadinud nüd mu'u</guidelinesLink>.
guidelines = Dikó
contact-us = Nüd insü
add-sentence-success = 1 Chitó'on nudu
add-sentence-error = Gua cho'oo nudu
required-field = Kanód bcheatinu dikútud chi jika mu'u
single-sentence-submission = Áman nudu dicho'od
small-batch-sentence-submission = Nandamad naobe nudu niku dicho'od
bulk-sentence-submission = Ndée  nudu nandamad niku dicho'od
single-sentence = Áman nudu
small-batch-sentence = Dúbii nudu
bulk-sentence = Ndée nudu
sentence-domain-combobox-label = Iña chi ñe'ë nudu
sentence-domain-select-placeholder = Kadi nabead ama, obe o inu
# Sentence Domain dropdown option
agriculture_food = Chi jinuy y je'eu
# Sentence Domain dropdown option
automotive_transport = Ku chi jindé iña
# Sentence Domain dropdown option
finance = Tumi
# Sentence Domain dropdown option
general = Nukue'e
sentence-variant-select-label = Núdu chi jo'o
sentence-variant-select-placeholder = Konto'od ama nudu (nichi ne'ëd )
sentence-variant-select-multiple-variants = nuekue'ë nyudu/ Née noo núdu

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Kuead nudu chi nukueñ kadi nichiñ <icon></icon>
sc-bulk-upload-instruction = Mu'u kuead archivo ñe'ed o <uploadButton>koto'od mu'u tumin di cargar ñe'ed</uploadButton>
sc-bulk-upload-instruction-drop = Techto'od archivo mu'u tumin kadi kuead
bulk-upload-additional-information = Nichi bea tanobe dae chi ne'e ko'od ñe'e archivo kun, yabid <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Nichi bea tanobe dae chi ne'e ko'od ñe'e archivo ku chi gua kane no platilla, yabid <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Kueatud archivo ñe'ed mu'u.
try-upload-again-md = Kueatud archivo ñe'ed
select-file = Neabed archivo ñe'ed
select-file-mobile = Neabed archivo chi kuead.
upload-progress-text = A jea ñe'ed...
sc-bulk-submit-confirm = Nudu kun <wikipediaLink>a di du'u nu kadi tubi</wikipediaLink> y kadi kueka.
bulk-upload-success-toast = A cheañ nudud
bulk-upload-failed-toast = Tubii chi ead, kuea tud.
bulk-submission-success-header = ¡Ndiosnadibad chi nanchod nudud!
bulk-submission-success-subheader = ¡Jined Common Voice nuku nudu chi nechi kutoo jobe jobe!
upload-more-btn-text = ¿A kuead ta tae nudu?
file-invalid-type = Gua cho'o
file-too-large = Yeabean cheatea archivo ñe'ed.
file-too-small = Yeabean lï archivo ñe'ed.
too-many-files = Yeabean ndee archivo

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = Kunekad <icon></icon> nudu chi nukueñ kadi nichiñ.
multiple-sentences-error = Gua kadi kuead ndee nudu tochi dicho'od "sencillo"
exceeds-small-batch-limit-error = Gua kadi dicho'od mas ñe'e 1000 nudu
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } Ñe'e 1 nudu chi nubdama
       *[other] { $uploadedSentences } Ñe'e { $totalSentences } nudu chi nudbama
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } Ñe'e nudu chi nubdama. Koto'od <downloadLink>muu</downloadLink>tumin nichid nudu chi gua cho'o.
       *[other] { $uploadedSentences } ñe'e { $totalSentences } nudu chi nubdama. Koto'od <downloadLink>muu</downloadLink>tumin nichis nudu chi gua cho'o.
    }
small-batch-sentences-rule-1 = Kanod ñe'e “¿Dea nudu chi kadi kunekad?”
small-batch-sentences-rule-2 = Dijud ama nudu no línea.
small-batch-sentences-rule-4 = Kunejúd nii 1.000 núdu
small-batch-sentences-rule-5 = Nudi chi dijud ne'e chi dama nukue.
small-batch-sentences-rule-6 = Nudu chi dijud ne'e chi dama nukue.
