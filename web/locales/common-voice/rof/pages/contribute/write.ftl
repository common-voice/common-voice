## WRITE PAGE

write = Tarwa
write-instruction = Habari sauyana
write-page-subtitle = shakwa mateta
sentence =
    .label = Matete
sentence-input-placeholder = Engira mateta  kwavandu haati
small-batch-sentence-input-placeholder = Engira matete kwavandu haati
citation-input-placeholder = Amba ando waansia matete afo
citation =
    .label = Ngauulya mateta
sc-write-submit-confirm = Ngakubali matetao yafuumia ifo mtandaon
sc-review-write-title = Matata omaki uliegera?
sc-review-small-batch-title = Eangera mateta menyengi
new-sentence-rule-1 = <>Kwete ndoo chekuima(<>cc-0<)
new-sentence-rule-2 = Matetao atasidi 15
new-sentence-rule-3 = Matete masha
new-sentence-rule-4 = Ika mateteta na kimamro
new-sentence-rule-5 = Kwete kitarwe nanga mahesabu fo
new-sentence-rule-6 = Lasma utarwe  kwaumakini
new-sentence-rule-7 = Yeevaa.
new-sentence-rule-8 = Kwa mateta mesha tweshiilima imaa kila ndoo na iruunda kwa pamoja
login-instruction-multiple-sentences = Matata mauulye
how-to-cite = Ngeuulya mateta ata?
how-to-cite-explanation-bold = Ngeuulya matata  na kando URL ana rina kamili la kasi
how-to-cite-explanation = Ksa nmateta afo moni amba <>“amba moni”<>. tukundi imanya kwa vandu voose yeta ndoo kilivashiingya fo<>ndoo che rora<>.
guidelines = Nshia
contact-us = Tusengeta
add-sentence-success = Ngasaindia iteta 1
add-sentence-error = Kwete ndoo chakaa uvishwa katika matetao
required-field = Kimba cha dooka
single-sentence-submission = Nnde itete limu
small-batch-sentence-submission = Nde itete ling'ta
bulk-sentence-submission = Ndee iteta litung'we
single-sentence = imu
small-batch-sentence = Itaamia hamu
bulk-sentence = Vataamia handu hamu vennyengi
sentence-domain-combobox-label = Handu  ete mateta
sentence-domain-select-placeholder = Ngashakwa matata atatu(ngakuda)
# Sentence Domain dropdown option
agriculture_food = Chao na itemamteme
# Sentence Domain dropdown option
automotive_transport = Makari esafirisha
# Sentence Domain dropdown option
finance = Besa
# Sentence Domain dropdown option
service_retail = Anhudumya imuimu
# Sentence Domain dropdown option
general = Aninga vyoose
# Sentence Domain dropdown option
healthcare = Handu wekolya dava (bistali)
# Sentence Domain dropdown option
history_law_government = Historia haki serikali
# Sentence Domain dropdown option
language_fundamentals = misingi ya natete
# Sentence Domain dropdown option
media_entertainment = Fyombo fye inde habari buru
# Sentence Domain dropdown option
nature_environment = Masingira aavandu
# Sentence Domain dropdown option
news_current_affairs = Habari  sa kaindika
# Sentence Domain dropdown option
technology_robotics = Tekinolojila na roboti
sentence-variant-select-label = Mateta omaki
sentence-variant-select-placeholder = Weshakwa  moni
sentence-variant-select-multiple-variants = Mteta amotu

## BULK SUBMISSION

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Kora  (kinndoo) matata a vandu voose
sc-bulk-upload-instruction = Koota ifaillo haati (eradooka )kora )
sc-bulk-upload-instruction-drop = Sosa fileso haatio
bulk-upload-additional-information = Ksa kwete wadua ifuma ifaili  loholi <hoina hoi vasengeta>commonvoice@mozilla.com</hoina hoi vasengeta>
template-file-additional-information = Ksa kwete wadua ifuma ifaili  loholi <hoina hoi vasengeta>commonvoice@mozilla.com </hoina hoi vaengeta>
try-upload-again = Ansa see ikoota ifaili lafo haati
try-upload-again-md = Tejaribu ibakya see
select-file = Sahakwa ifalilo
select-file-mobile = Shakwa fili lo ulibakie
accepted-files = Mafaili vaamba yee; tsv naayo taba
minimum-sentences = Mateta 1000 uike ifailini
maximum-file-size = Ifaili la utwe wa 25MB
what-needs-to-be-in-file = Tukundi kiki kive kwa ifile lakwa?
what-needs-to-be-in-file-explanation = Saakwa yamotu <>mafail yamotu<>.Mateta  ahalane (CC0 na ahalane  undung'usha) ahaelane na eengiia ave rahisi isomeka . saindia matata10-15 matatao uike na mahesabu
upload-progress-text = Vliendila ibakia...
sc-bulk-submit-confirm = Ngasibitisha matetao nali undusha<>handu a vandu voosee<> naa sikae undusha
bulk-upload-success-toast = Ngimekolya mateta manyengi
bulk-upload-failed-toast = Ndooki cheeva fo, ruunda se ata.
bulk-submission-success-header = Kaasha kwa mshango wafo wa mateta
bulk-submission-success-subheader = Ukundi ngikuviye kwa mateta akilamviri!
upload-more-btn-text = Ngabakia mateta saidi?
file-invalid-type = Ifaili lite ihaati
file-too-large = Ifileloholi li itwe
file-too-small = Ifile liholi liitaa
too-many-files = Mafaili menyengi

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = Engera mateta menyengi ya findo fya voosee
multiple-sentences-error = Weshiilma iandika mateta menyengi  kwa wakati umuu
exceeds-small-batch-limit-error = Weshiilima iandika mateta 1000
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Waruunda dooka nai.jaribu se ata  dakika 1
       *[other] Washika kiwango cha dooka. ansa se ata
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Washika kiwango cha dooka. ansa see dakika 1
       *[other] Washika kiwango cha dooka. ansa see sekunde
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Washika mwisho wa matumisi haati Jaribu see ata,kaa kasha
       *[other] Washika mwiisho matumisi afo
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Washika mwisho wa matumisi haati Jaribu see ata,kaa kasha
       *[other] Washika mwisho wa matumisi haati Jaribu see ata,kaa kasha
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] Shakwa mateta
       *[other] Sindia mateta
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] (Saakwa mateta ) saindia matata 1 saindia )saindia mateta lyaa
       *[other] (Saakwa mateta ) saindia matata 1 saindia )saindia mateta lyaa
    }
small-batch-sentences-rule-1 = Ngeengera matata omaki?
small-batch-sentences-rule-2 = Engera mateta kila handu ete mstari' Ngeengera
small-batch-sentences-rule-3 = Matetao kila limu handu hakwe  “Engira” ana “uura  ” limtiki
small-batch-sentences-rule-4 = Emgera matata 1,000
small-batch-sentences-rule-5 = Matetao piu lasima avae handu hamu
small-batch-sentences-rule-6 = Mtetao lasma aveahandu hamu
# menu item
add-sentences = Ongera mateta

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Engera na usaakwe matetao. ongera maswli ,mwandiko wa sauti
add-sentences-menu-item-tooltip = Engera mateta kikwamwanu
review-sentences-menu-item-tooltip = Shungusa mateta kikwamwanu
add-questions-menu-item-tooltip = Engera mateta kikwamwanu
transcribe-audio-menu-item-tooltip = Rekodi Fidio kwa kikwamwanu

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Engera matete uike ifailini udue na maoniyafo
add-sentences-menu-item-aria-label = Engera mateta kwa vandu voose vamanye
review-sentences-menu-item-aria-label = Saakwa mateta vandu vannde.
add-questions-menu-item-aria-label = Nnde mateta mahia kwa vandu voose vasome
transcribe-audio-menu-item-aria-label = Shungulya rekodiyo ya sauti ishe mwandikoni
