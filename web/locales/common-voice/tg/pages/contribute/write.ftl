## WRITE PAGE

write = Навиштан
write-instruction = Илова кардани <icon></icon> ҷумлаи дастраси умум
sentence =
    .label = Ҷумла
sentence-input-placeholder = Ҷумлаи худро аз манбаи дастраси умум дар ин ҷой ворид намоед
small-batch-sentence-input-placeholder = Ҷумлаҳои худро аз манбаи дастраси умум дар ин ҷой ворид намоед
citation =
    .label = Иқтибос
sc-review-write-title = Кадом ҷумлаҳоро илова карда метавонам?
sc-review-small-batch-title = Тарзи илова кардани якчанд ҷумла
new-sentence-rule-2 = Камтар аз 15 калима дар як ҷумла
new-sentence-rule-3 = Грамматикаи дурустро истифода баред
new-sentence-rule-4 = Қоидаҳои имло ва аломатҳои китобати дурустро истифода баред
new-sentence-rule-5 = Бе рақамҳо ва аломатҳои махсус
new-sentence-rule-6 = Бе ҳарфҳои хориҷӣ
login-instruction-multiple-sentences = Барои илова кардани зиёда аз як ҷумла, лутфан, <loginLink>ворид шавед</loginLink> ё <loginLink>ҳисобро ба қайд гиред</loginLink>
how-to-cite = Чӣ тавр ман иқтибос меорам?
guidelines = Дастурҳо
contact-us = Тамос бо мо
add-sentence-success = 1 ҷумла ҷамъ карда шуд
add-sentence-error = Хатои илова кардани ҷумла
required-field = Лутфан, ин майдонро пур кунед.
single-sentence-submission = Пешниҳоди як ҷумла
single-sentence = Як ҷумла
sentence-domain-combobox-label = Манбаи ҷумлаҳо
sentence-domain-select-placeholder = То се манбаъ интихоб кунед (ихтиёрӣ)
# Sentence Domain dropdown option
agriculture_food = Кишоварзӣ ва озуқаворӣ
# Sentence Domain dropdown option
automotive_transport = Автомобилсозӣ ва нақлиёт
# Sentence Domain dropdown option
finance = Молия
# Sentence Domain dropdown option
service_retail = Хизматрасонӣ ва савдо
# Sentence Domain dropdown option
general = Асосӣ
# Sentence Domain dropdown option
healthcare = Тандурустӣ
# Sentence Domain dropdown option
history_law_government = Таърих, қонунгузорӣ ва ҳукумат
# Sentence Domain dropdown option
language_fundamentals = Асосҳои забон (мисли рақамҳо, ҳарфҳо, пул)
# Sentence Domain dropdown option
media_entertainment = ВАО ва фароғат
# Sentence Domain dropdown option
nature_environment = Табиат ва муҳити зист
# Sentence Domain dropdown option
news_current_affairs = Ахбор ва воқеаҳои ҷорӣ
# Sentence Domain dropdown option
technology_robotics = Технология ва робототехника
sentence-variant-select-label = Навъи ҷумла
sentence-variant-select-placeholder = Интихоб кардани навъи ҷумла (ихтиёрӣ)
sentence-variant-select-multiple-variants = Забони умумӣ / навъҳои гуногун

## BULK SUBMISSION 

sc-bulk-upload-instruction-drop = Барои боргирӣ кардани файл, онро дар ин ҷой гузоред
try-upload-again-md = Кӯшиш кунед, ки аз нав боргирӣ намоед
select-file = Интихоби файл
select-file-mobile = Файлро барои боргирӣ интихоб намоед
accepted-files = Намудҳои файлҳои қабулшаванда: танҳо .tsv
minimum-sentences = Шумораи ҳадди ақали ҷумлаҳо дар файл: 1000
maximum-file-size = Андозаи ҳадди аксари файл: 25 MB
what-needs-to-be-in-file = Дар файли ман чӣ бояд бошад?
upload-progress-text = Боркунӣ дар ҳоли иҷро...
bulk-upload-success-toast = Шумораи зиёди ҷумлаҳо бор карда шуданд
bulk-upload-failed-toast = Боргирӣ иҷро нашуд, лутфан, аз нав кӯшиш кунед.
file-invalid-type = Файли номувофиқ
file-too-large = Файл хеле калон аст
file-too-small = Файл хеле хурд аст
too-many-files = Шумораи файлҳои аз ҳад зиёд аст

## SMALL BATCH SUBMISSION

multiple-sentences-error = Шумо наметавонед, ки дар ҳудуди як пешниҳод якчанд ҷумларо илова кунед
exceeds-small-batch-limit-error = Пешниҳод кардани зиёда аз 1000 ҷумла ғайриимкон аст
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } аз 1 ҷумла ҷамъ карда шуд
       *[other] { $uploadedSentences } аз { $totalSentences } ҷумла ҷамъ карда шуд
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } аз 1 ҷумла ҷамъ карда шуд. Барои боргирӣ кардани ҷумлаҳои радшуда <downloadLink>дар ин ҷой</downloadLink>зер кунед.
       *[other] { $uploadedSentences } аз { $totalSentences } ҷумла ҷамъ карда шуд. Барои боргирӣ кардани ҷумлаҳои радшуда <downloadLink>дар ин ҷой</downloadLink>зер кунед.
    }
small-batch-sentences-rule-1 = Дастурҳоро аз қисми «Кадом ҷумлаҳоро илова карда метавонам?» риоя намоед
small-batch-sentences-rule-2 = Илова кардани як ҷумла ба ҳар як сатр
small-batch-sentences-rule-3 = Бо як маротиба пахш кардани тугмаи «Enter» ё «Return» ҷумлаҳоро ба як сатр ҷудо намоед
small-batch-sentences-rule-4 = Илова кардан то 1000 ҷумла
small-batch-sentences-rule-5 = Ҳамаи ҷумлаҳо бояд дорои манбаи яксон бошанд
small-batch-sentences-rule-6 = Ҳамаи ҷумлаҳо бояд дорои иқтибоси яксон бошанд
# menu item
add-sentences = Илова кардани ҷумлаҳо

## MENU ITEM TOOLTIPS

add-sentences-menu-item-tooltip = Ҷумлаҳоро бо забони худ илова кунед
review-sentences-menu-item-tooltip = Ҷумлаҳоро бо забони худ баррасӣ кунед
add-questions-menu-item-tooltip = Саволҳоро ба забони худ илова кунед

## MENU ITEM ARIA LABELS

transcribe-audio-menu-item-aria-label = Табдил додани сабтҳои аудиоӣ ба матн
