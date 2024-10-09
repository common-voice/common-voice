## WRITE PAGE

# Sentence Domain dropdown option
automotive_transport = Автомобильтәи атранспорттәи
# Sentence Domain dropdown option
finance = Афинансқәа
# Sentence Domain dropdown option
service_retail = Амаҵзуратә сектори хәаахәҭралатәи ахәаахәҭреи
# Sentence Domain dropdown option
general = Ихадоу
# Sentence Domain dropdown option
healthcare = Агәабзиарахьчара
# Sentence Domain dropdown option
history_law_government = Аҭоурых, азакәан, аиҳабыра
# Sentence Domain dropdown option
language_fundamentals = Абызшәа ашьаҭақәа (е.г. аԥхьаӡацқәа, анбанқәа, аԥара)
# Sentence Domain dropdown option
media_entertainment = Амедиеи агәырҿыхагақәеи
# Sentence Domain dropdown option
nature_environment = Аԥсабареи акәша-мыкәшеи
# Sentence Domain dropdown option
news_current_affairs = Ажәабжьқәеи ахҭысқәеи
# Sentence Domain dropdown option
technology_robotics = Атехнологиеи аробототехникеи
sentence-variant-select-label = Адгалара авариант
sentence-variant-select-placeholder = Аопциа алхтәуп (иаҭахым)
sentence-variant-select-multiple-variants = Еицырзеиԥшу абызшәа / еиуеиԥшым авариантқәа

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Ахәаахәҭра <icon></icon> зегьы ирзеиԥшу аҳамҭақәа
sc-bulk-upload-instruction = Уфаил арахь иҭагала мамзаргьы <uploadButton>ашьҭыхразы уақәыӷәӷәа</uploadButton>
sc-bulk-upload-instruction-drop = Аҭагаларазы афаил арахь иҭагаланы иқәыжьтәуп
bulk-upload-additional-information = Ари афайл иазкны иҵегьтәи адыррақәа шәҭахызар, ҳара шәҳацәажәа <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Ашаблон иаҵанамкуа ари афаил иазкны иацҵаны адыррақәа шәҭахызар, ҳара шәҳацәажәа <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Даҽазнык шәҽазышәшәа афаил арахь иҭганы
try-upload-again-md = Даҽазнык аҭагалара шәҽазышәшәа
select-file = Афаил алхтәуп
select-file-mobile = Иалышәх афаил ашьҭыхразы
accepted-files = Ирыдыркыло афаил хкқәа: .tsv мацара.
minimum-sentences = Афаил аҟны ажәалагалақәа рминималтә хыԥхьаӡара: 1000
maximum-file-size = Иреиҳау афаил ашәагаа: 25 МБ.
what-needs-to-be-in-file = Иҟазар акәзеи сара сфаил аҿы?
what-needs-to-be-in-file-explanation = Ҳаҳәоит, ҳ-<templateFileLink>шаблонтә фаил</templateFileLink> гәашәҭ. Уара иуҭо аусумҭақәа акопиразин рымамзароуп (CC0 мамзаргьы автор изин змоу аоригиналтә усумҭа), еилыкка, грамматикала ииашоу, насгьы аԥхьара мариоу. Иҟаҵоу аҳәоуқәа рыԥхьара 10-15 секунд раҟара аамҭа аҭаххоит; Ахыԥхьаӡарақәеи, ахатәы хьыӡқәеи, иҷыдоу асимволқәеи рхархәара мап ацәыркыр ауп.
upload-progress-text = Аҭагалара мҩаԥысуеит...
sc-bulk-submit-confirm = Сара иазхасҵоит абарҭ ашәҟәқәа <wikipediaLink>зеиԥш домен</wikipediaLink> шракәу, насгьы урҭ арахь рышьҭыхра азин шсымоу.
bulk-upload-success-toast = Аҳәарақәа рацәаны иҭарҵеит
bulk-upload-failed-toast = Аҭагалара алымшеит, даҽазнык шәҽазышәшәа.
bulk-submission-success-header = Иҭабуп амассатә ҭагалара шәахьалахәыз азы!
bulk-submission-success-subheader = Уара Common Voice ацхыраара ҟауҵоит есыҽнытәи ҳхықәкқәа рынагӡараҿы иҭагалоу ажәаҳәақәа рзы!
upload-more-btn-text = Еиҳаны аҳәарақәа ҭажәгал?
file-invalid-type = Ииашам афаил
file-too-large = Афаил дуцәоуп
file-too-small = Афаил хәыҷцәоуп
too-many-files = Афаилқәа рацәоуп

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Азеиԥш доментә жәаҳәақәа рацәаны иацҵатәуп
multiple-sentences-error = Зныктәи ажәеинраалаҿы аҳәоуқәа рацәаны ацҵара ҟалом
# <errorIcon></erroricon> will be replace with an icon that represents an error
exceeds-small-batch-limit-error = 1000 жәаҳәара еиҳаны ашьҭра ауам
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } еизгоу жәаҳәарак аҟынтә
       *[other] { $uploadedSentences } of { $totalSentences } Еизгоу аҳәоуқәа
    }
