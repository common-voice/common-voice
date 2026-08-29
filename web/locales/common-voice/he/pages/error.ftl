## Error pages

banner-error-slow-1 = Common Voice פועל באטיות, עמך הסליחה ותודה על הבעת העניין.
banner-error-slow-2 = אנחנו מקבלים תעבורה רבה וחוקרים כרגע את התקלות.
banner-error-slow-link = דף סטטוס
error-something-went-wrong = משהו השתבש, עמך הסליחה
error-clip-upload = ההעלאה של המקטע נכשלת שוב ושוב, האם להמשיך לנסות?
error-clip-upload-server = ההעלאה של המקטע נכשלת שוב ושוב בשרת שלנו. אנא טענו את העמוד מחדש, או נסו שוב מאוחר יותר.
error-clip-upload-too-large = קובץ ההקלטה גדול מדי להעלאה. נסו להקליט מקטע קצר יותר.
error-clip-upload-server-error = יש אצלנו בעיה בעיבוד המקטע. נסו לטעון מחדש את הדף, או נסו שוב מאוחר יותר.
error-title-404 = לא הצלחנו למצוא את הדף הזה עבורך
error-content-404 = אולי <homepageLink>דף הבית</homepageLink> שלנו יכול לעזור? כדי לשאול שאלה, נא להצטרף ל<matrixLink>צ’אט הקהילה ב־Matrix</matrixLink>, לעקוב אחר בעיות באתר באמצעות <githubLink>GitHub</githubLink> או לבקר <discourseLink>בפורומים שלנו ב־Discourse</discourseLink>.
error-title-429-no-time = אתם בקצב גבוה מדי. האטו את הקצב ונסו שוב בעוד רגע.
error-title-429-with-time =
    { $retryAfter ->
        [one] אתם בקצב גבוה מדי. נסו שוב בעוד שניה.
       *[other] אתם בקצב גבוה מדי. נסו שוב בעוד { $retryAfter } שניות.
    }
error-title-500 = משהו השתבש, עמכם הסליחה
error-content-500 = נתקלנו בשגיאה לא צפויה. נסו שוב מאוחר יותר. לקבלת עזרה, אנא הצטרפו ל<matrixLink>צ'אט של קהילת מטריקס</matrixLink>, עקבו אחר בעיות באתר דרך <githubLink>גיטהאב</githubLink> או בקרו בפורומים של <discourseLink>דיסקורס</discourseLink>.
error-title-502 = הפרעה בחיבור
error-content-502 = החיבור שלכם לשרתים שלנו כרגע אינו מצליח להתייצב. נסו שוב מאוחר יותר. לעזרה, אנא הצטרפו ל<matrixLink>צ'אט של קהילת מטריקס</matrixLink>, עקבו אחר בעיות באתר דרך <githubLink>גיטהאב</githubLink> או בקרו ב<discourseLink>פורומים של דיסקורס</discourseLink>.
error-title-503 = אנו חווים כרגע השבתה בלתי צפויה
error-content-503 = האתר יעלה לאוויר שוב בהקדם האפשרי. לקבלת המידע העדכני ביותר, אנא הצטרפו ל-<matrixLink>צ'אט הקהילתי ב-Matrix</ matrixLink> או בקרו ב-<githubLink> GitHub</githubLink> או <discourseLink>בפורומי Discourse שלנו</ discourseLink> כדי לדווח ולנטר על בעיות באתר.
error-title-504 = הבקשה לקחה יותר מדי זמן
error-content-504 = הבקשה ארכה זמן רב מדי להשלמה. זה בדרך כלל עניין זמני - אנא נסו שנית. לקבלת עזרה, הצטרפו ל<matrixLink>צ'אט של קהילת מטריקס</matrixLink>, עקבו אחר בעיות באתר דרך <githubLink>גיטהאב</githubLink> או בקרו ב<discourseLink>פורומים של דיסקורס</discourseLink>.
error-code = שגיאה { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] לא הצלחנו להעלות את המקטע שלך. הוא כבר הועלה בעבר. בואו נמשיך עם המקבץ הבאה!
       *[other] לא הצלחנו להעלות { $total } מקטעים. הם כבר הועלו בעבר. בואו נמשיך עם המקבץ הבאה!
    }
