## Question Page

question-page-instruction = Přidejte otázku <icon></icon> v jazyce { $currentLocale }, aby na ni lidé odpověděli
add-question-textarea-placeholder = např.: "K čemu byste si přáli, abyste mohli využívat technologie?"
add-questions-terms-checkbox = * Potvrzuji, že tato otázka je <publicDomainLink>public domain</publicDomainLink> a mám oprávnění ji nahrát.
question-dataset-language = Datová sada: { $datasetLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [one] Sesbírané otázky: { $uploadedQuestions } z 1
        [few] Sesbírané otázky: { $uploadedQuestions } z { $totalQuestions }
        [many] Sesbírané otázky: { $uploadedQuestions } z { $totalQuestions }
       *[other] Sesbírané otázky: { $uploadedQuestions } z { $totalQuestions }
    }
add-question-error-message = Nahrání se nezdařilo, zkuste to znovu.
add-question-too-many-questions-error = Překročili jste 500 otázek. Snižte počet otázek a zkuste to znovu.
partial-questions-upload-message =
    { $totalQuestions ->
        [one] { $uploadedQuestions } z 1 shromážděné otázky. Prohlédněte si naše <guidelinesLink>pokyny</guidelinesLink>, kde se dozvíte více o tom, jak přidávat otázky.
        [few] { $uploadedQuestions } z { $totalQuestions } shromážděných otázek. Prohlédněte si naše <guidelinesLink>pokyny</guidelinesLink>, kde se dozvíte více o tom, jak přidávat otázky.
        [many] { $uploadedQuestions } z { $totalQuestions } shromážděných otázek. Prohlédněte si naše <guidelinesLink>pokyny</guidelinesLink>, kde se dozvíte více o tom, jak přidávat otázky.
       *[other] { $uploadedQuestions } z { $totalQuestions } shromážděných otázek. Prohlédněte si naše <guidelinesLink>pokyny</guidelinesLink>, kde se dozvíte více o tom, jak přidávat otázky.
    }
# Guidelines
add-question-guidelines-title = Jaké otázky mohu přidat?
do-section-title = ano:
do-section-guideline-1 = Používejte správný pravopis a gramatiku
do-section-guideline-2 = Zvolte jednoduché otázky, které jsou snadno srozumitelné pro každého bez ohledu na kulturu nebo kontext.
do-section-guideline-3 = Ujistěte se, že na ně lze odpovědět několika větami.
do-not-section-title = ne:
do-not-section-guideline-1 = Nežádejte osobní identifikační údaje (např. jména nebo finanční informace).
do-not-section-guideline-2 = Nevyjadřujte nebo nevyvolávejte předsudky nebo urážlivé pocity
do-not-section-guideline-3 = Neklaďte citlivé otázky
# Code switching Guidelines
cs-do-section-guideline-1 = Používejte dvojjazyčné otázky nebo kontext
cs-do-not-section-guideline-3 = Používejte příliš formální jazyk
