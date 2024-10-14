## WRITE PAGE


## BULK SUBMISSION 


## SMALL BATCH SUBMISSION

# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } аз 1 ҷумла ҷамъ карда шуд
       *[other] { $uploadedSentences } аз { $totalSentences } ҷумла ҷамъ карда шуд
    }
