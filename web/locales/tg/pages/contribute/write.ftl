## WRITE PAGE

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

## BULK SUBMISSION 

select-file = Интихоби файл

## SMALL BATCH SUBMISSION

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
small-batch-sentences-rule-2 = Илова кардани як ҷумла ба ҳар як сатр
small-batch-sentences-rule-3 = Бо як маротиба пахш кардани тугмаи «Enter» ё «Return» ҷумлаҳоро ба як сатр ҷудо намоед
small-batch-sentences-rule-4 = Илова кардан то 1000 ҷумла
