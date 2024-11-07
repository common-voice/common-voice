## Dashboard

your-languages = თქვენი ენები
toward-next-goal = პირდაპირ შემდეგ მიზნამდე
goal-reached = მიზანი მიღწეულია
clips-you-recorded = თქვენი ჩანაწერები
clips-you-validated = თქვენ მიერ დამოწმებული
todays-recorded-progress = დღევანდელი წინსვლა ჩანაწერებში
todays-validated-progress = დღევანდელი წინსვლა დამოწმებაში
stats = სტატისტიკა
awards = ჯილდოები
you = თქვენ
everyone = ყველა
contribution-activity = შეტანილი წვლილი
top-contributors = მხურვალე მოხალისეები
recorded-clips = ჩაწერები
validated-clips = დამოწმებები
total-approved = სულ დამოწმებული
overall-accuracy = საერთო სიზუსტე
set-visibility = ხილვადობის დაყენება
visibility-explainer = ეს პარამეტრი განსაზღვრავს, მოწინავეთა სიაში თქვენს ხილვადობას. როცა დაფარულია, თქვენი წინსვლა არ იქნება ხილული სხვებისთვის. ეს ნიშნავს, რომ თქვენი გამოსახულება, მომხმარებლის სახელი და შესრულებული სამუშაო არ გამოჩნდება ჩამონათვალში. გაითვალისწინეთ, რომ მოწინავეთა ჩამონათვალის განახლებას, ესაჭიროება { $minutes }წთ, ცვლილებების ასახვისთვის.
visibility-overlay-note = შენიშვნა: როცა აყენია „ხილული“, მისი შეცვლა შესაძლებელია <profileLink>პროფილის გვერდიდან</profileLink>
show-ranking = ჩემი ადგილის ნახვა

## Custom Goals

get-started-goals = მიზნის შექმნა
create-custom-goal = საკუთარი მიზნის შექმნა
goal-type = რა მიზანი გსურთ დაისახოთ?
both-speak-and-listen = ორივე
both-speak-and-listen-long = ორივე (წარმოთქმა და მოსმენა)
daily-goal = ყოველდღიური მიზანი
weekly-goal = ყოველკვირეული მიზანი
easy-difficulty = ადვილი
average-difficulty = საშუალო
difficult-difficulty = ძნელი
pro-difficulty = გამოცდილი
lose-goal-progress-warning = მიზნის შეცვლით შესაძლოა დაკარგოთ მიმდინარე წინსვლა.
want-to-continue = გსურთ, განაგრძოთ?
finish-editing = გსურთ, ჯერ ჩასწორების დასრულება?
lose-changes-warning = ახლავე დატოვებით თქვენი ცვლილებები დაიკარგება
build-custom-goal = საკუთარი მიზნის შექმნა
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] დაგვეხმარეთ მივაღწიოთ{ $hours } საათს{ $language } ენისთვის, პირადი მიზნის დასახვით
       *[other] დაგვეხმარეთ მივაღწიოთ{ $hours } საათს{ $language } ენისთვის პირადი მიზნის დასახვით
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] დაგვეხმარეთ Common Voice-ში მივაღწიოთ { $hours } საათს ენისთვის, პირადი მიზნის დასახვით
       *[other] დაგვეხმარეთ Common Voice-ში მივაღწიოთ { $hours } საათს ენისთვის პირადი მიზნის დასახვით
    }
set-a-goal = მიზნის მითითება
cant-decide = ვერ გადაგიწყვეტიათ?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } საათი
       *[other] { $totalHours } საათი
    } მიიღწევა სულ რაღაც  { NUMBER($periodMonths) ->
        [one] { $periodMonths } თვეში
       *[other] { $periodMonths } თვეში
    } თუ{ NUMBER($people) ->
        [one] { $people } ადამიანი
       *[other] { $people } ადამიანი
    } გააკეთებს { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } ჩანაწერს
       *[other] { $clipsPerDay } ჩანაწერს
    } დღეში
how-many-per-day = მშვენიერია! რამდენი ჩანაწერი ყოველდღიურად?
how-many-a-week = მშვენიერია! რამდენი ჩანაწერი ყოველკვირეულად?
which-goal-type = გირჩევნიათ ჩაწერა, მოსმენა, თუ ორივე?
receiving-emails-info =
    თქვენ მითითებული გაქვთ, რომ გსურთ ელფოსტაზე მიიღოთ შეხსენებები შესასრულებელი მიზნების,
    აგრეთვე სამუშაოს მიმდინარეობის შესახებ და Common Voice-სთან დაკავშირებული სიახლეები.
not-receiving-emails-info = თქვენ მითითებული გაქვთ, რომ <bold>არ</bold> გსურთ ელფოსტაზე მიიღოთ შეხსენებები შესასრულებელი მიზნების, აგრეთვე სამუშაოს მიმდინარეობის შესახებ და Common Voice-სთან დაკავშირებული სიახლეები
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } ჩანაწერი
       *[other] { $count } ჩანაწერი
    }
help-share-goal = დაგვეხმარეთ მეტი ხმის მოძიებაში, გააზიარეთ თქვენი მიზანი
confirm-goal = მიზნის დადასტურება
goal-interval-weekly = ყოველკვირეული
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = გააზიარეთ თქვენი მიზანი, ყოველდღიურად { $count } ჩანაწერის { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = გააზიარეთ თქვენი მიზანი, ყოველკვირეულად { $count } ჩანაწერის { $type }
share-goal-type-speak = წარმოთქმა
share-goal-type-listen = მოსმენა
share-goal-type-both = წარმოთქმა და მოსმენა
# LINK will be replaced with the current URL
goal-share-text = მე ახლახან შევქმენი ჩემი მიზანი, ხმის ჩანაწერების შესაწირად #CommonVoice – პროექტისთვის -- შემომიერთდი, რომ შევასწავლოთ მანქანებს, თუ როგორ საუბრობენ ნამდვილი ადამიანები { $link }
weekly-goal-created = თქვენი ყოველკვირეული მიზანი შექმნილია
daily-goal-created = თქვენი ყოველდღიური მიზანი შექმნილია
track-progress = თვალი მიადევნეთ წინსვლას აქ და თქვენი სტატისტიკის გვერდზე.
return-to-edit-goal = ნებისმიერ დროს შეგიძლიათ დაბრუნდეთ, მიზნის ჩასასწორებლად.
share-goal = ჩემი მიზნის გაზიარება

## Goals

streaks = წვლილი
days =
    { $count ->
        [one] დღე
       *[other] დღე
    }
recordings =
    { $count ->
        [one] ჩანაწერი
       *[other] ჩანაწერი
    }
validations =
    { $count ->
        [one] დამოწმება
       *[other] დამოწმება
    }
