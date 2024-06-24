## REVIEW

sc-review-lang-not-selected = לא בחרתם אף שפה. אנא הכנסו ל<profileLink>פרופיל</profileLink> כדי לבחור שפות.
sc-review-title = סקירת משפטים
sc-review-loading = המשפטים בטעינה…
sc-review-select-language = נא לבחור שפה כדי לסקור משפטים.
sc-review-no-sentences = אין משפטים לסקירה. <addLink>כדאי להוסיף עוד משפטים עכשיו!</addLink>
sc-review-form-prompt =
    .message = משפטים שנסקרו לא נשלחו, להמשיך?
sc-review-form-usage = החליקו ימינה כדי לאשר את המשפט. החליקו שמאלה כדי לדחות אותו. החליקו למעלה כדי לדלג עליו. <strong>אל תשכחו לשלוח את הבדיקה שלכם!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = מקור: { $sentenceSource }
sc-review-form-button-reject = דחייה
sc-review-form-button-skip = דילוג
sc-review-form-button-approve = אישור
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = כ
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ל
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ד
sc-review-form-keyboard-usage-custom = אפשר גם להשתמש בקיצורי מקלדת: { sc-review-form-button-approve-shortcut } כדי לאשר, { sc-review-form-button-reject-shortcut } כדי לדחות, { sc-review-form-button-skip-shortcut } כדי לדלג
sc-review-form-button-submit =
    .submitText = סיום הסקירה
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] לא סקרתם משפטים.
        [one] סקרתם משפט אחד. תודה רבה!
       *[other] סקרתם { $sentences } משפטים. תודה רבה!
    }
sc-review-form-review-failure = לא ניתן היה לשמור את הסקירה. נא לנסות שוב מאוחר יותר.
sc-review-link = סקירה

## REVIEW CRITERIA

sc-criteria-modal = ⓘ תנאים לסקירה
sc-criteria-title = תנאים לסקירה
sc-criteria-make-sure = נא לוודא שהמשפט עומד בתנאים הבאים:
sc-criteria-item-1 = על המשפט להיות מאוית כראוי.
sc-criteria-item-2 = המשפט חייב להיות נכון מבחינה דקדוקית.
sc-criteria-item-3 = המשפט חייב להיות אפשרי להגיה.
sc-criteria-item-4 = אם המשפט עומד בתנאים, יש ללחוץ על הכפתור &quot;אישור&quot; שבצד.
sc-criteria-item-5-2 = אם המשפט לא עומד בתנאים לעיל, לחצו על כפתור &quot;דחייה&quot;. אם אתם לא בטוחים לגבי המשפט, אתם גם יכולים לדלג עליו ולהמשיך הלאה.
sc-criteria-item-6 = אם אין לכם יותר משפטים לסריקה, נשמח שתעזרו לנו לאסוף עוד!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = בדקו <icon></icon> האם אלה משפטים תקינים מבחינת השפה?
sc-review-rules-title = האם המשפט מתאים להנחיות?
sc-review-empty-state = כרגע אין משפטים לסקירה בשפה זו.
report-sc-different-language = שפה אחרת
report-sc-different-language-detail = זה כתוב בשפה שונה ממה שעליי לסקור.
sentences-fetch-error = אירעה שגיאה בטעינת משפטים
review-error = אירעה שגיאה בסקירת משפט זה
review-error-rate-limit-exceeded = אתם זזים מהר מידי! קחו כמה רגעים לסקור כל משפט ולוודא שהוא תקין.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = אנו מבצעים כאן שינויים גדולים
sc-redirect-page-subtitle-1 = אספן המשפטים עובר תחת הליבה של Common Voice. תוכלו כעת <writeURL>לכתוב</writeURL> או <reviewURL>לסקור</reviewURL> הגשות של משפטים בודדים ב-Common Voice.
sc-redirect-page-subtitle-2 = שאלו אותנו שאלות ב-<matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> או <emailLink>בדוא"ל</emailLink>.

