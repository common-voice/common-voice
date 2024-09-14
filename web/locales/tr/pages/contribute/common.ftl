action-click = tıklayın
action-tap = dokunun
contribute = Katkıda bulun
review = İncele
skip = Atla
shortcuts = Kısayollar
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> ses kaydı
       *[other] <bold>{ $count }</bold> ses kaydı
    }
goal-help-recording = Common Voice'un günlük { $goalValue } kayıt hedefinin <goalPercentage></goalPercentage> kadarına ulaşmasına katkıda bulundunuz!
goal-help-validation = Common Voice'un günlük { $goalValue } doğrulama hedefinin <goalPercentage></goalPercentage> kadarına ulaşmasına katkıda bulundunuz!
contribute-more =
    { $count ->
        [one] { $count } tane daha yapmaya hazır mısın?
       *[other] { $count } tane daha yapmaya hazır mısın?
    }
speak-empty-state = Bu dilde kaydedilecek cümle kalmadı...
no-sentences-for-variants = Lehçenizde cümle kalmamış olabilir! İsterseniz dilinizdeki diğer cümleleri de görmek için ayarlarınızı değiştirebilirsiniz.
speak-empty-state-cta = Cümlelere katkıda bulunun
speak-loading-error =
    Kaydedebileceğiniz cümle bulamadık.
    Lütfen daha sonra tekrar deneyin.
record-button-label = Sesinizi kaydedin
share-title-new = Daha fazla ses bulmamıza <bold>yardım edin</bold>
keep-track-profile = Profil oluşturarak ilerlemenizi takip edin
login-to-get-started = Başlamak için giriş yapın veya kaydolun
target-segment-first-card = İlk hedef segmentimize katkıda bulunuyorsunuz
target-segment-generic-card = Bir hedef segmentine katkıda bulunuyorsunuz
target-segment-first-banner = Common Voice’un ilk { $locale } hedef segmentini oluşturmaya yardımcı olun
target-segment-add-voice = Sesinizi ekleyin
target-segment-learn-more = Daha fazla bilgi alın
change-preferences = Tercihleri değiştir

## Contribution Nav Items

contribute-voice-collection-nav-header = Ses Toplama
contribute-sentence-collection-nav-header = Cümle Toplama
login-signup = Giriş / Kayıt
vote-yes = Evet
vote-no = Hayır
datasets = Veri kümeleri
languages = Diller
about = Hakkında
submit-form-action = Gönder

## Reporting

report = Bildir
report-title = Rapor gönderin
report-ask = Bu cümleyle ilgili hangi sorunları yaşıyorsunuz?
report-offensive-language = Hakaret
report-offensive-language-detail = Cümlenin kaba veya saldırgan bir üslubu var.
report-grammar-or-spelling = Dilbilgisi / yazım hatası
report-grammar-or-spelling-detail = Cümlede dilbilgisi veya yazım hatası var.
report-different-language = Farklı dil
report-different-language-detail = Konuştuğumdan farklı bir dilde yazılmış.
report-difficult-pronounce = Telaffuzu zor
report-difficult-pronounce-detail = Okunması ya da telaffuzu zor kelime ya da ifadeler içeriyor.
report-offensive-speech = Saldırgan konuşma
report-offensive-speech-detail = Kaydın kaba veya saldırgan bir üslubu var.
report-other-comment =
    .placeholder = Yorum
success = Tamamlandı
continue = Devam et
report-success = Rapor başarıyla gönderildi

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = a

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = k
shortcut-record-toggle-label = Kaydet/Durdur
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Yeniden kaydet
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Yapılmakta olan kaydı sil
shortcut-submit = Enter
shortcut-submit-label = Kayıtları gönder
request-language-text = Dilinizi henüz Common Voice’ta göremiyor musunuz?
request-language-button = Yeni dil iste

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = b
shortcut-play-toggle-label = Başlat/Durdur
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = e
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = h

## Validation criteria

contribution-criteria-nav = Kriter
contribution-criteria-link = Katkıda bulunma kriterlerini anlayın
contribution-criteria-page-title = Katkıda bulunma kriterleri
contribution-criteria-page-description = Ses kayıtlarını dinlerken nelere dikkat etmeniz gerektiğini öğrenin. Böylece kendi ses kayıtlarınızı da zenginleştirebilirsiniz.
contribution-for-example = örnek
contribution-misreadings-title = Yanlış okumalar
contribution-misreadings-description = Dinlediğiniz kaydın metinle tam olarak aynı olup olmadığını çok dikkatli kontrol edin. Küçük hatalar olsa bile reddedin. <br />Şunlar çok yaygın yapılan hatalardır:
contribution-misreadings-description-extended-list-1 = Kaydın başında ya da sonunda bir sözcüğü atlamak ya da metinde olmayan bir ek sözcük kaydetmek.
contribution-misreadings-description-extended-list-2 = Kayıt sırasında bazı sözcükleri iki denemede okuma ya da yazılandan farklı bir sözcük kaydetme.
contribution-misreadings-description-extended-list-3 = Yanlış telaffuzla okuma nedeniyle kelimelerin başka anlamlara dönüşmesi.
contribution-misreadings-description-extended-list-4 = Kaydın aceleyle sonlandırılması nedeniyle son kelimenin sonunun kaydedilmemesi.
contribution-misreadings-description-extended-list-5 = Bir kelimeyi okurken birkaç deneme yapma.
contribution-misreadings-example-1-title = Bu hastalıklar vücudunu sarsmıştı.
contribution-misreadings-example-2-title = Bu hastalık vücudunu sarsmıştı.
contribution-misreadings-example-2-explanation = [‘hastalıklar’ olmalıydı]
contribution-misreadings-example-3-title = Bu hastalıklar vücudunu sars-
contribution-misreadings-example-3-explanation = [Kayıt son sözcük tamamlanmadan bitirilmiş]
contribution-misreadings-example-4-title = Bu hastalıklar onun vücudunu sarsmıştı.
contribution-misreadings-example-4-explanation = [Metindekinden daha fazla sözcük kaydedilmiş]
contribution-misreadings-example-5-title = Gardaşlar da gelince oda birdenbire doldu.
contribution-misreadings-example-6-title = Gardaşlar da gelince o da birdenbire doldu
contribution-misreadings-example-6-explanation = [“oda” olmalıydı]
contribution-misreadings-example-7-title = Kardeşler de gelince oda birdenbire doldu.
contribution-misreadings-example-7-explanation = [Metinde "gardaş" olarak yerel dilde geçiyor]
contribution-misreadings-example-8-title = Tamam canım, bitiyor birazdan.
contribution-misreadings-example-8-explanation = [Farklı içerik]
contribution-varying-pronunciations-title = Farklı telaffuzlar
contribution-varying-pronunciations-description = Okuyucunun bir kelimeyi yanlış telaffuz ettiği, vurguyu yanlış yere koyduğu veya soru işaretini görmezden geldiği gerekçesiyle bir kaydı reddetmeden önce dikkatli olun. Dünyanın ve ülkenin farklı yerlerinde kullanılan farklı aksanlar ve telaffuzlar olabilir. Lütfen sizden farklı konuşanlar için bir takdir payı bırakın.
contribution-varying-pronunciations-description-extended = Öte yandan, okuyucunun muhtemelen kelimeyle daha önce hiç karşılaşmadığını ve kelimeyi tamamen yanlış telaffuz ettiğini düşünüyorsanız lütfen kaydı reddedin. Emin değilseniz atlama düğmesini kullanın.
contribution-varying-pronunciations-example-1-title = Yarın geliyordu.
contribution-varying-pronunciations-example-1-explanation = ['Geliyordu' ya da 'geliyodu' olarak okunabilir]
contribution-varying-pronunciations-example-2-title = Oparlörü biraz kısar mısın?
contribution-varying-pronunciations-example-2-explanation = ['Hoparlör' kelimesini 'oparlör', 'apörlö' gibi okumak yanlıştır]
contribution-background-noise-title = Arka plan gürültüsü
contribution-background-noise-description = Makine öğrenimi algoritmalarının çeşitli arka plan gürültülerini işleyebilmesini istiyoruz. Hatta metnin tamamını duymanızı engellememesi koşuluyla nispeten yüksek gürültü bile kabul edilebilir. Alçak sesli bir fon müziği de kabul edilebilir ama her kelimeyi net duyamayacağınız kadar yüksek sesli müzik uygun değildir.
contribution-background-noise-description-extended = Kayıt kesiliyorsa veya çatırtılıysa, metnin tamamı da duyulamıyorsa reddedin.
contribution-background-noise-example-1-fixed-title = <strong>[HAPŞIRMA]</strong> Bu hastalıklar vücudunu <strong>[ÖKSÜRME]</strong> sarsmıştı.
contribution-background-noise-example-2-fixed-title = Bu hastal <strong>[ÖKSÜRME]</strong> vücudunu sarsmıştı.
contribution-background-noise-example-2-explanation = [Metnin bir kısmı duyulamıyor]
contribution-background-noise-example-3-fixed-title = <strong>[ÇATIRTI]</strong> hastalıklar vücudunu <strong>[ÇATIRTI]</strong> -mıştı.
contribution-background-voices-title = Arka plan sesleri
contribution-background-voices-description = Alçak sesli bir arka plan gürültüsü kabul edilebilir, ancak bir makine algoritmasının yazılı metinde olmayan sözcükleri tanımlamasına neden olabilecek ek sesler istemiyoruz. Metinde olmayan kelimeler duyuyorsanız kaydı reddetmelisiniz. Odada televizyon açık bırakıldıysa veya yakınlarda konuşanlar varsa böyle bir durum ortaya çıkabilir.
contribution-background-voices-description-extended = Kayıt kesiliyorsa veya çatırtılıysa, metnin tamamı da duyulamıyorsa reddedin.
contribution-background-voices-example-1-title = Bu hastalıklar vücudunu sarsmıştı. <strong>[biri tarafından okunuyor]</strong>
contribution-background-voices-example-1-explanation = Geliyor musun? <strong>[başka biri çağırıyor]</strong>
contribution-volume-title = Ses seviyesi
contribution-volume-description = Okuyucular arasında ses seviyesi ile ilgili doğal farklılıklar olacaktır. Yalnızca ses kaydı bozulacak kadar yüksekse veya (daha yaygın olarak) yazılı metne bağlı kalmadan duyulamayacak kadar düşük sesle söyleniyorsa reddedin.
contribution-reader-effects-title = Okuyucu efektleri
contribution-reader-effects-description = Çoğu kayıt, doğal sesleriyle konuşan insanlara aittir. Ara sıra önünüze gelirse bağırılan, fısıldanan veya açıkça "dramatik" bir sesle yapılan standart dışı kayıtları da kabul edebilirsiniz. Lütfen şarkı biçiminde söylenen kayıtları ve bilgisayar tarafından sentezlenmiş sesleri reddedin.
contribution-just-unsure-title = Emin değil misiniz?
contribution-just-unsure-description = Bu yönergelerin kapsamadığı bir şeyle karşılaşırsanız, lütfen sağduyunuza göre oy verin. Gerçekten karar veremiyorsanız, atlama düğmesini kullanın ve bir sonraki kayda geçin.
see-more = <chevron></chevron>Devamını gör
see-less = <chevron></chevron>Daha azını gör
