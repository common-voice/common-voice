## Contribution

action-click = کلیک
action-tap = ټپ کړئ
## Languages

contribute = مرسته وکړئ
review = بیاکتنه
skip = پرېږدئ
shortcuts = لنډلارې
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> کلیپ
       *[other] <bold>{ $count }</bold> کلیپونه
    }
goal-help-recording = تاسو زموږ د ورځني{ $goalValue } ثبتولو موخې څخه د عام غږ <goalPercentage></goalPercentage> ته رسولو کې مرسته کړې!
goal-help-validation = تاسو زموږ د ورځني { $goalValue } تاییدولو موخې څخه د عام غږ <goalPercentage></goalPercentage> ته رسولو کې مرسته کړې!
contribute-more =
    { $count ->
        [one] د بل { $count } کولو لپاره چمتو یاست؟
       *[other] د نورو { $count } کولو لپاره چمتو یاست؟
    }
speak-empty-state = موږ پدې ژبه کې د ثبتولو لپاره د جملو څخه خلاص شو...
speak-empty-state-cta = د جملو مرسته وکړئ
speak-loading-error =
    موږ ستاسو د خبرو کولو لپاره هیڅ جمله نشو ترلاسه کولی.
    مهرباني وکړئ وروسته بیا هڅه وکړئ.
record-button-label = خپل غږ ثبت کړئ
share-title-new = <bold> زموږ سره مرسته وکړئ </bold> چې نور غږونه ومومو
keep-track-profile = د پېژنیال سره خپل پرمختګ تعقیب کړئ
login-to-get-started = د پیل لپاره ننوځئ یا نوملیکنه وکړئ
target-segment-first-card = تاسو زموږ په لومړۍ هدفي برخې کې ونډه اخلئ
target-segment-generic-card = تاسو یوې په نښه شوي برخې کې ونډه اخلئ
target-segment-first-banner = په { $locale } کې د ګډ غږ لومړي هدفي برخې رامینځته کولو کې مرسته وکړئ.
target-segment-add-voice = خپل غږ اضافه کړئ
target-segment-learn-more = نور زده کړئ

## Contribution Nav Items

contribute-voice-collection-nav-header = د غږ راټولول
contribute-sentence-collection-nav-header = د جملو ټولګه

## Reporting

report = راپور
report-title = یو راپور وسپارئ
report-ask = تاسو د دې جملې سره د کومو ستونزو سره مخ یاست؟
report-offensive-language = سپکاوی ژبه
report-offensive-language-detail = جمله بې ادبه یا د سپکاوی ژبه لري.
report-grammar-or-spelling = ګرامري / املايي تېروتنه
report-grammar-or-spelling-detail = جمله ګرامري یا املايي تېروتنه لري.
report-different-language = بېل ژبه
report-different-language-detail = دا په یوه داسې ژبه کې لیکل شوی چې له هغه ژبې څخه چې زه يې وایم توپیر لري.
report-difficult-pronounce = تلفظول يې ستونزمن دي
report-difficult-pronounce-detail = دا ويي یا کلمې لري چې لوستل یا تلفظ یې سخت دی.
report-offensive-speech = د سپکاوی وینا
report-offensive-speech-detail = کلیپ بې ادبه یا د سپکاوی ژبه لري.
report-other-comment =
    .placeholder = څرګندونه
success = بریا
continue = دوام ورکړئ
report-success = راپور په بریالیتوب سره تیر شو

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = ثبتول/ودرول
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = کليپ له سره ثبت کړئ
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = روان ثبتول رد کړئ
shortcut-submit = بیرته راګرځيدل
shortcut-submit-label = کليپونه وسپارئ
request-language-text = ایا خپله ژبه مو تراوسه په عام غږ کې نه وینئ؟
request-language-button = د يوې ژبې غوښتنه وکړئ

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = ولوبوئ / ودروئ
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = معیارونه
contribution-criteria-link = د ونډې په معیارونو پوه شئ
contribution-criteria-page-title = د ونډې معیارونه
contribution-criteria-page-description = پوهه شئ چې د غږ کلپونو اوریدلو په وخت کې د څه په لټه کې شئ او ستاسو د غږ ثبت کولو کې هم مرسته وکړئ!
contribution-for-example = د مثال په ډول
contribution-misreadings-title = غلط لوستونه
contribution-misreadings-description = کله چې واورئ، په ډیر دقت سره وګورئ چې هغه څه چې ثبت شوي په ریښتیا هغه څه دي چې لیکل شوي دي؛ رد کړئ که چیرې حتی کوچنۍ غلطي وي. <br />ډیری عام غلطی عبارت دی له:
contribution-misreadings-description-extended-list-1 = د ثبت کولو په پیل کې <strong>'A'</strong> یا <strong>'The'</strong> ورک شوی.
contribution-misreadings-description-extended-list-2 = د یوې کلمې په پای کې د یوه <strong>'</strong> ورکیدل.
contribution-misreadings-description-extended-list-3 = د انقباض لوستل چې په حقیقت کې شتون نلري، لکه "موږ یو" پر ځای "موږ یو"، یا برعکس.
contribution-misreadings-description-extended-list-4 = په چټکۍ سره د ریکارډ قطع کولو سره د وروستي کلمې پای له لاسه ورکول.
contribution-misreadings-description-extended-list-5 = د یوې کلمې لوستلو لپاره څو هڅې کول.
contribution-misreadings-example-1-title = د ټریاسیک لوی ډیناسور.
contribution-misreadings-example-2-title = د ټریاسیک لوی ډیناسور.
contribution-misreadings-example-2-explanation = [باید 'ډیناسور' وي]
contribution-misreadings-example-3-title = د تریاسي لوی ډیناسور.
contribution-misreadings-example-3-explanation = [د وروستي کلمې له پای ته رسیدو دمخه ریکارډ قطع شو]
contribution-misreadings-example-4-title = د ټریاسیک لوی ډیناسور. هو.
contribution-misreadings-example-4-explanation = [د اړین متن څخه ډیر ثبت شوي دي]
contribution-misreadings-example-5-title = موږ د قهوې اخیستو لپاره بهر ځو.
contribution-misreadings-example-6-title = مونږه قهوې اخیستو لپاره بهر ځو.
contribution-misreadings-example-6-explanation = [باید "موږ یو" وي]
contribution-misreadings-example-7-title = موږ د یوې قهوې اخیستو لپاره بهر ځو.
contribution-misreadings-example-7-explanation = [په اصلي متن کې 'د یوې' نشته]
contribution-misreadings-example-8-title = مچۍ په تېزۍ سره روانه شوه.
contribution-misreadings-example-8-explanation = [مطابقت نه  لرونکی مواد]
contribution-varying-pronunciations-title = مختلف تلفظونه
contribution-varying-pronunciations-description = مخکې له دې چې په ځمکه کې یو کلیپ رد کړئ محتاط اوسئ چې لوستونکي یوه کلمه غلطه کړې وي، فشار یې په غلط ځای کې ځای پرځای کړی وي، یا یې په ښکاره ډول د پوښتنې نښه له پامه غورځولې وي. په ټوله نړۍ کې د تلفظونو پراخه ډولونه شتون لري، چې ځینې یې ممکن ستاسو په محلي ټولنه کې نه وي اوریدلي. مهرباني وکړئ د هغو کسانو لپاره د ستاینې حد چمتو کړئ څوک چې ممکن ستاسو څخه مختلف خبرې وکړي.
contribution-varying-pronunciations-description-extended = له بلې خوا، که تاسو فکر کوئ چې لوستونکی شاید هیڅکله د کلمې سره مخ نه وي، او په ساده ډول د تلفظ په اړه غلط اټکل کوي، مهرباني وکړئ رد کړئ. که تاسو ډاډه نه یاست، د Skip تڼۍ وکاروئ.
contribution-varying-pronunciations-example-1-title = په سر یې یو بیرټ اغوستی و.
contribution-varying-pronunciations-example-1-explanation = ['بیرټ' سم دی که په لومړي حرف (UK) یا دوهم (US) باندې فشار سره]
contribution-varying-pronunciations-example-2-title = د هغه لاس پورته شو.
contribution-varying-pronunciations-example-2-explanation = [په انګلیسي کې 'Raised' تل د یو حرف په توګه تلفظ کیږي، دوه نه]
contribution-background-noise-title = شاته شور
contribution-background-noise-description = موږ غواړو چې د ماشین زده کړې الګوریتمونه د دې وړتیا ولري چې د مختلف شالید شور اداره کړي، او حتی نسبتا لوړ غږونه ومنل شي په دې شرط چې دوی د متن د بشپړ اوریدلو مخه ونه نیسي. خاموش پس منظر موسیقي سمه ده؛ میوزیک دومره لوړ غږ کوي چې تاسو د هرې کلمې اوریدلو مخه نیسي, دا سمه نه ده.
contribution-background-noise-description-extended = که ریکارډ مات شي، یا کریکونه ولري، رد کړئ پرته لدې چې ټول متن لاهم واوریدل شي.
contribution-background-noise-example-1-fixed-title = <strong>[پرنجی]</strong> د لوی ډیناسور د <strong>[ټوخی]</strong>  ټریاسیک.
contribution-background-noise-example-2-fixed-title = لوی ډینو <strong>[ټوخی]</strong> تریاسیک.
contribution-background-noise-example-2-explanation = [د متن یوه برخه اوریدل کیدی نشي]
contribution-background-noise-example-3-fixed-title = <strong>[د درولو غږ]</strong>  لوی ډیناسور د <strong>[د درولو غږ]</strong>ریاسیک.
contribution-background-voices-title = د شاته غږونه
contribution-background-voices-description = یو خاموش شالید شور سم دی، مګر موږ اضافي غږونه نه غواړو چې کیدای شي د ماشین الګوریتم لامل شي چې هغه ټکي وپیژني چې په لیکل شوي متن کې ندي. که تاسو د متن څخه د شالید شور کې پوهېدلو وړ کلمې واورئ، کلیپ باید رد شي. معمولا دا واقع کیږي چیرې چې تلویزیون پریښودل شوی وي، یا چیرې چې نږدې خبرې اترې روانې وي.
contribution-background-voices-description-extended = که ریکارډ مات شي، یا کریکونه ولري، رد کړئ پرته لدې چې ټول متن لاهم واوریدل شي.
contribution-background-voices-example-1-title = د ټریاسیک لوی ډیناسور. <strong>[په یو غږ لوستل]</strong>
contribution-background-voices-example-1-explanation = ته راځې؟ <strong>[د بل لخوا ویل کیږي]</strong>
contribution-volume-title = حجم
contribution-volume-description = د لوستونکو ترمنځ به په حجم کې طبیعي توپیرونه وي. رد کړئ یوازې هغه وخت چې حجم دومره لوړ وي چې ریکارډ نګ ماتیږي، یا (په عام ډول) که دا دومره ټیټ وي چې تاسو نشئ اوریدلی چې د لیکل شوي متن ته اشاره کولو پرته څه ویل کیږي.
contribution-reader-effects-title = د لوستونکي اغیزې
contribution-reader-effects-description = ډیری ریکارډونه د هغه خلکو څخه دي چې په خپل طبیعي غږ کې خبرې کوي. تاسو کولی شئ کله ناکله غیر معیاري ریکارډونه ومنئ چې په "ډراماتیک" غږ کې، ګونګوسې، یا په ښکاره ډول وړاندې کیږي. مهرباني وکړئ د سندرو ریکارډونه رد کړئ او هغه څوک چې د کمپیوټر ترکیب شوي غږ کاروي.
contribution-just-unsure-title = بس ډاډه نه یاست؟
contribution-just-unsure-description = که تاسو د هغه څه سره مخ شئ چې دا لارښوونې نه پوښي، مهرباني وکړئ د خپل غوره قضاوت سره سم رایه ورکړئ. که تاسو واقعیا پریکړه نشئ کولی ، د سکیپ تڼۍ وکاروئ او راتلونکي ریکارډ ته لاړشئ.
see-more = <chevron></chevron>نور وګوری
see-less = <chevron></chevron>لږ وګورئ

