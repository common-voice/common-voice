## REVIEW

sc-review-lang-not-selected = Herhangi bir dil seçmediniz. Dil seçmek için lütfen <profileLink>profilinize</profileLink> gidin.
sc-review-title = Cümleleri İncele
sc-review-loading = Cümleler yükleniyor…
sc-review-select-language = Lütfen cümlelerini incelemek istediğiniz dili seçin.
sc-review-no-sentences = İncelenecek cümle yok. <addLink>Şimdi daha fazla cümle ekleyin!</addLink>
sc-review-form-prompt =
    .message = İncelenen cümleler gönderilmedi. Emin misiniz?
sc-review-form-usage = Cümleyi onaylamak için sağa kaydırın. Reddetmek için sola kaydırın. Atlamak için yukarı kaydırın. <strong>İncelemenizi göndermeyi unutmayın!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kaynak: { $sentenceSource }
sc-review-form-button-reject = Reddet
sc-review-form-button-skip = Atla
sc-review-form-button-approve = Onayla
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = E
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = H
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = A
sc-review-form-keyboard-usage-custom = Klavye kısayollarını da kullanabilirsiniz: Onaylamak için { sc-review-form-button-approve-shortcut }, reddetmek için { sc-review-form-button-reject-shortcut }, atlamak için { sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = İncelemeyi bitir
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Hiç cümle incelenmedi.
        [one] 1 cümle incelendi. Teşekkürler!
       *[other] { $sentences } cümle incelendi. Teşekkürler!
    }
sc-review-form-review-failure = İnceleme kaydedilemedi. Lütfen daha sonra tekrar deneyin.
sc-review-link = İncele

## REVIEW CRITERIA

sc-criteria-modal = ⓘ İnceleme Kriterleri
sc-criteria-title = İnceleme Kriterleri
sc-criteria-make-sure = Cümlenin aşağıdaki kriterleri karşıladığından emin olun:
sc-criteria-item-1 = Cümle doğru yazılmalıdır.
sc-criteria-item-2 = Cümle dilbilgisi açısından doğru olmalıdır.
sc-criteria-item-3 = Cümle sesli olarak okunabilir olmalıdır.
sc-criteria-item-4 = Cümle kriterleri karşılıyorsa sağdaki &quot;Onayla&quot; düğmesine tıklayın.
sc-criteria-item-5-2 = Cümle yukarıdaki kriterleri karşılamıyorsa soldaki &quot;Reddet&quot; düğmesine tıklayın. Emin olmadığınız cümleleri atlayarak bir sonrakine geçebilirsiniz.
sc-criteria-item-6 = İncelenecek cümleler biterse lütfen daha fazla cümle toplamamıza yardım edin!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Dilbigisi açısından doğru olup olmadığını <icon></icon> kontrol edin
sc-review-rules-title = Cümle yönergelere uygun mu?
sc-review-empty-state = Şu anda bu dilde incelenecek cümle yok.
report-sc-different-language = Farklı dil
report-sc-different-language-detail = İncelediğimden farklı bir dilde yazılmış.
sentences-fetch-error = Cümleler getirilirken bir hata oluştu
review-error = Bu cümle incelenirken bir hata oluştu
review-error-rate-limit-exceeded = Çok hızlı ilerliyorsunuz. Lütfen cümlenin doğrulunu kontrol etmek için biraz daha zaman ayırın.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Bazı büyük değişiklikler yapıyoruz
sc-redirect-page-subtitle-1 = Cümle Toplayıcı, ana Common Voice platformuna taşınıyor. Artık Common Voice'ta cümle <writeURL>yazabilir</writeURL> veya gönderilen cümleleri <reviewURL>denetleyebilirsiniz</reviewURL>.
sc-redirect-page-subtitle-2 = Bize <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> veya <emailLink>e-posta</emailLink> üzerinden soru sorabilirsiniz.

