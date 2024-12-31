## Dashboard

your-languages = Таны хэлнүүд
toward-next-goal = Дараагийн зорилгоруу чиглэх
clips-you-recorded = Таны бичсэн клипүүд
clips-you-validated = Таны баталгаажуулсан клипүүд
todays-recorded-progress = Өнөөдрийн Common Voice-д бичлэг хийгдсэн клипүүдийн явц
todays-validated-progress = Өнөөдрийн Common Voice-д баталгаажсан клипүүдийн явц
stats = Статистик
awards = Шагналууд
you = Та
everyone = Хүн бүр
contribution-activity = Хувь нэмэр оруулсан үйл ажиллагаа
top-contributors = Шилдэг хувь нэмэр оруулагчид
recorded-clips = Бичигдсэн бичлэг
validated-clips = Шалгагдсан бичлэг
total-approved = Нийт зөвшөөрөгдсөн
overall-accuracy = Ерөнхий нарийвчлал
set-visibility = Харагдах байдлыг тохируулах
visibility-explainer = Энэ тохиргоо нь тэргүүлэгчдийн самбарт таны харагдах байдлыг тохируулна. Нууцлагдсан бол, таны явц хувийнх болно. Таны зураг, хэрэглэгчийн нэр, ахиц тэргүүлэгчдийн самбар дээр харагдахгүй гэсэн үг юм. Тэргүүлэгчдийн самбарын шинэчлэлтийн өөрчлөлт ороход ~ { $minutes } минут зарцуулагддаг гэдгийг анхаарна уу.
visibility-overlay-note = Тэмдэглэл: "Харагдах" болгосон байвал энэ тохиргоог <profileLink> Профайл хуудас </profileLink> дээрээс өөрчилж болно
show-ranking = Миний зэрэглэлийг харуулах

## Custom Goals

get-started-goals = Зорилго тавьж эхлэх
create-custom-goal = Хувийн зорилт үүсгэх
goal-type = Та ямар зорилт тавихыг хүсч байна?
both-speak-and-listen = Хоёулаа
both-speak-and-listen-long = Хоёулаа (Ярих, сонсох)
daily-goal = Өдөр тутмын зорилт
weekly-goal = Долоо хоногийн зорилт
easy-difficulty = Хялбар
average-difficulty = Дундаж
difficult-difficulty = Хэцүү
pro-difficulty = Мэргэжлийн
lose-goal-progress-warning = Зорилтоо засварласнаар одоо байгаа ахицаа алдах боломжтой шүү.
want-to-continue = Та үргэлжлүүлэхийг хүсч байна уу?
finish-editing = Эхлээд засварлаж дуусгах уу?
lose-changes-warning = Хэрэв одоо боливол бүх өөрчлөлт устана
build-custom-goal = Хувийн зорилт бий болгох
help-reach-hours-pluralized =
    Хүрэхэд туслах{ NUMBER($hours) ->
        [one] { $hours } цаг
       *[other] { $hours } цагууд
    }{ $language } дэх хувийн зорилт
help-reach-hours-general-pluralized =
    Common Voice-г хүрэхэд туслах{ NUMBER($hours) ->
        [one] { $hours } цаг
       *[other] { $hours } цагууд
    }хэл дэх хувийн зорилт
set-a-goal = Зорилт тавих
cant-decide = Шийдэж чадахгүй байна уу?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } цаг
       *[other] { $totalHours } цаг
    }дууслаа{ NUMBER($periodMonths) ->
        [one] { $periodMonths } сар
       *[other] { $periodMonths } сарууд
    }Хэрэв{ NUMBER($people) ->
        [one] { $people } хүн
       *[other] { $people } хүмүүс
    }бичлэг{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } бичлэг
       *[other] { $clipsPerDay } бичлэгнүүд
    }өдөр
how-many-per-day = Дажгүй шүү! Өдөрт хэдэн бичлэг?
how-many-a-week = Дажгүй шүү! 7 хоногт хэдэн бичлэг?
which-goal-type = Та ярих, сонсох эсвэл хоёуланг нь хүсч байна уу?
receiving-emails-info = Та одоогоор зорилт сануулагч, явцын талаархи шинэчлэлтүүд, Common Voice-н талаархи мэдээ гэх мэтийг имэйлээр хүлээн авахаар тохируулсан байна
not-receiving-emails-info = Та одоогоор зорилт сануулагч, явцын талаархи шинэчлэлт, Common Voice-н тухай мэдээ зэргийг имэйлээр хүлээн <bold> АВАХГҮЙ </bold>  тохиргоог хийсэн байна.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } бичлэг
       *[other] { $count } бичлэгнүүд
    }
help-share-goal = Өшөө олон хоолойг олоход тусалж, зорилтоо хуваалцаарай
confirm-goal = Зорилтоо баталгаажуулах
goal-interval-weekly = Долоо хоног тутам
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = { $type } -н өдөр тутмын зорилт болох { $count } бичлэгнүүдийг хуваалцах.
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = { $type } -н долоо хоног тутмын зорилт болох { $count } бичлэгнүүдийг хуваалцах.
share-goal-type-speak = Ярих
share-goal-type-listen = Сонсох
share-goal-type-both = Ярих болон сонсох
# LINK will be replaced with the current URL
goal-share-text = Би #CommonVoice-д дуу хоолойгоо хандивлах хувийн зорилтоо үүсгэлээ - надтай нэгдэж, машинд хүн хэрхэн ярьдагийг заахад туслаарай { $link }
weekly-goal-created = Таны долоо хоногийн зорилт үүслээ
daily-goal-created = Таны өдөр тутмын зорилт үүслээ
track-progress = Явцыг эндээс болон статистик хуудсан дээрээс дагах.
return-to-edit-goal = Хүссэн үедээ зорилтоо засахаар энд буцаж ирэх.
share-goal = Миний зорилтыг хуваалцах

## Goals

streaks = Шугамууд
days =
    { $count ->
        [one] Өдөр
       *[other] Өдөр
    }
recordings =
    { $count ->
        [one] Бичлэг
       *[other] Бичлэг
    }
validations =
    { $count ->
        [one] баталгаажилт
       *[other] баталгаажилтууд
    }
