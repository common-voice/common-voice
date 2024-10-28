## WRITE PAGE

write = Newishi
write-instruction = Jama kari, sawin ek mon
write-page-subtitle = kia mon ya o awaz, shaya pe newishi haw te saw aya dataset una jama hin
sentence =
    .label = Mon
sentence-input-placeholder = Tay kholaw mon shaya newishi
small-batch-sentence-input-placeholder = tay kholaw mon shaya histi
citation-input-placeholder = Tay mondr as ujak hial'i
citation =
    .label = niweshila
sc-write-submit-confirm = I confirm that this sentence is <wikipediaLink>public domain</wikipediaLink> and I have permission to upload it.
sc-review-write-title = kia niweshila a atra dyam
sc-review-small-batch-title = ke'n kay ziada mon newishik hiu
new-sentence-rule-1 = Ne ijazat, sakhti
new-sentence-rule-2 = 15 alfazani  ani asta km mon
new-sentence-rule-3 = Sahi gramar, mon istimal kari
new-sentence-rule-4 = sahi Spelling ze  tharika istimal kar
new-sentence-rule-5 = lamabar khas ishnahari ya o nishan o ne
new-sentence-rule-6 = Warek zuban as nishan o ne
new-sentence-rule-7 = Sahi tharika istimal kari
new-sentence-rule-8 = She'he'n hiu ori ki te mashkulgi, sahi hiu ori. ( To mahikas basti asani hiu ori)
login-instruction-multiple-sentences = kholaw kari, ya o warek kholaw kari, tay te mon neshikas bati
how-to-cite = A khe'n kay mam?
how-to-cite-explanation-bold = Newishi URL as som, kya o krom as pura nom newishi
how-to-cite-explanation = Agar tay mi ilfaz pe ashini haw khali mas. homa hatya ata hia'l'i, ki shemi newoshila tu kawala' gri as. abi aya public domain una jagek. se kas copyright,(amanat ) ta ne. warek asta pe malumat ajat haw page una ari
guidelines = Usul
contact-us = homa som mon de
add-sentence-success = Awaz ze mon jama karik
add-sentence-error = Awaz ze mon dik wew galati
required-field = Khali jaiga puri karik
single-sentence-submission = gazhi mon jama kak
small-batch-sentence-submission = chutyak awaz ze mon jama kari
bulk-sentence-submission = Ghona alfaz ze mon jama karik
single-sentence = gezi
small-batch-sentence = Chutyak jama kada
bulk-sentence = Bo jama kada
sentence-domain-combobox-label = Mondras domain
sentence-domain-select-placeholder = Tre domain asta jama kari, (tay chit)
# Sentence Domain dropdown option
agriculture_food = mazhab zhe au
# Sentence Domain dropdown option
automotive_transport = motor ze Kasik
# Sentence Domain dropdown option
finance = Rupaya
# Sentence Domain dropdown option
service_retail = Brikaw ze jama kara w
# Sentence Domain dropdown option
general = am
# Sentence Domain dropdown option
healthcare = sihat as khyal
# Sentence Domain dropdown option
history_law_government = Tarik, kanun, hokumat
# Sentence Domain dropdown option
language_fundamentals = Zuban as usul, Buniat. (Misalan, Nishan, newishishila' Paisa)
# Sentence Domain dropdown option
media_entertainment = Go'n' ze labe'
# Sentence Domain dropdown option
nature_environment = Kudrat ze mahol
# Sentence Domain dropdown option
news_current_affairs = Khabar ze no'a taza khabar
# Sentence Domain dropdown option
technology_robotics = Technology ze Robot
sentence-variant-select-label = Mon ze awaz
sentence-variant-select-placeholder = Warek Jagai (tan chituna)
sentence-variant-select-multiple-variants = kia asta zuban/ ziada zuban

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Upload/ Jama kari. <nishan>                    </nishan> Sawin domain ani mondr
sc-bulk-upload-instruction = Tan te file, shaya oni, phato upload kari
sc-bulk-upload-instruction-drop = File shaya histi upload as bati
bulk-upload-additional-information = Warek asta pe malumat ajat haw, homa som rabita kari
template-file-additional-information = Wanaga warek malumat asta ajat hawan haw, shisa file as bati, homa som rabita kari. meharbani kay email kari. commonvoice@mozilla.com
try-upload-again = Geri khushush kari, tay file ho'nchi histi
try-upload-again-md = ak warek kay jayy
select-file = kaghaz grhii
select-file-mobile = File khoshai upload kari
accepted-files = Shemi file mmzor hin: .tvs mi
minimum-sentences = Ek File una kam se kam mon: 1000 (ek hazar)
maximum-file-size = Ziad ar ziad file jaiga: 25 MB
what-needs-to-be-in-file = may shaya kagaz una kia zarurat shian
what-needs-to-be-in-file-explanation = Meharbani kay, homa chota'la nishanan file jagai. Tay mon kas manat mo hiu ori. kura ki jama kariu day, se tasa asil krom hiu oria. tasa gramer asta sahi hiu ori. Mahikas bati asta asan hiu ori. 10 ya o 15 sekend hiu ori. warego kia lamber, ya o warek kia khas mo hiu ori mahikas bati
upload-progress-text = Upload jari shiaw...
sc-bulk-submit-confirm = A shama eh'et kam day ki shemi saw mochan bati shia domain. Upload karikas hatya my som ejazat shiaw
bulk-upload-success-toast = Ziada mon upload hawan
bulk-upload-failed-toast = Upload nakam hawaw, meharbani kay geri kari
bulk-submission-success-header = Bo meharbani, tay ziada kay dekas ze jama karikas bati
bulk-submission-success-subheader = To madad karis day sawin awazas bati, ta'ke har aduaw zalikas nishan pura hiu
upload-more-btn-text = Waregas atsa mon upload ka?
file-invalid-type = Galat file
file-too-large = shia kaghaz bo ghona
file-too-small = kagaz bo chutyak
too-many-files = bo kaghaz shian

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = Warek asta ziada, mochan domain jama kari
multiple-sentences-error = To ziada mon ek tem una jama karik ne bahas
exceeds-small-batch-limit-error = Ne bahas jama karik 1000 (ek hazar) mondr
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Ek 1
       *[other] warek 2
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Ek (1)
       *[other] Warek (2)
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Ek (1)
       *[other] Warek (2)
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Ek (1)
       *[other] Warek (2)
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] Ek (1)
       *[other] Warek (2)
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] One (1)
       *[other] Warek (2)
    }
small-batch-sentences-rule-1 = Tharika jagai, kia mon a thek baham?
small-batch-sentences-rule-2 = Ek line una ek mon thai
