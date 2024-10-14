## WRITE PAGE


## BULK SUBMISSION 


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
