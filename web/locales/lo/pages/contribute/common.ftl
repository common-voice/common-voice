action-click = ຄິກ
action-tap = ແຕະ
contribute = ສະໜັບສະໜູນ
review = ທົບທວນ
skip = ຂ້າມ
shortcuts = ທາງລັດ
clips-with-count-pluralized =
    { $count ->
       *[other] <bold>{ $count }</bold> ຄລິບ
    }
goal-help-recording = ທ່ານໄດ້ຊ່ວຍໃຫ້ Common Voice ບັນລຸ <goalPercentage></goalPercentage> ຂອງເປົ້າໝາຍການບັນທຶກ { $goalValue } ປະຈໍາວັນຂອງພວກເຮົາ!
goal-help-validation = ທ່ານໄດ້ຊ່ວຍໃຫ້ Common Voice ບັນລຸ <goalPercentage></goalPercentage> ຂອງເປົ້າໝາຍການກວດສອບ { $goalValue } ປະຈໍາວັນຂອງພວກເຮົາ!
contribute-more =
    { $count ->
       *[other] ພ້ອມແລ້ວທີ່ຈະເຮັດອີກ { $count }?
    }
speak-empty-state = ພວກເຮົາໝົດປະໂຫຍກທີ່ຈະບັນທຶກເປັນພາສານີ້...
speak-empty-state-cta = ຮ່ວມສ້າງປະໂຫຍກ
speak-loading-error =
    ພວກເຮົາບໍ່ສາມາດເອົາປະໂຫຍກໃດໆມາໃຫ້ທ່ານເວົ້າໄດ້.
    ກະລຸນາລອງໃໝ່ໃນພາຍຫຼັງ.
record-button-label = ບັນທຶກສຽງຂອງເຈົ້າ
share-title-new = <bold>ຊ່ວຍພວກເຮົາ</bold> ຊອກຫາສຽງເພີ່ມເຕີມ
keep-track-profile = ຕິດຕາມຄວາມຄືບໜ້າຂອງເຈົ້າດ້ວຍໂປຣໄຟລ໌
login-to-get-started = ເຂົ້າສູ່ລະບົບຫຼືລົງທະບຽນເພື່ອເລີ່ມຕົ້ນ
target-segment-first-card = ທ່ານກຳລັງປະກອບສ່ວນເຂົ້າໃນກຸ່ມເປົ້າໝາຍທຳອິດຂອງພວກເຮົາ
target-segment-generic-card = ທ່ານກຳລັງປະກອບສ່ວນເຂົ້າໃນກຸ່ມເປົ້າໝາຍ
target-segment-first-banner = ຊ່ວຍສ້າງກຸ່ມເປົ້າໝາຍທຳອິດຂອງ Common Voice ໃນ { $locale }
target-segment-add-voice = ເພີ່ມສຽງຂອງເຈົ້າ
target-segment-learn-more = ຮຽນຮູ້ເພີ່ມເຕີມ
change-preferences = ປ່ຽນການຕັ້ງຄ່າ

## Contribution Nav Items

contribute-voice-collection-nav-header = ການເກັບກໍາສຽງ
contribute-sentence-collection-nav-header = ການລວບລວມປະໂຫຍກ

## Reporting

report = ລາຍງານ
report-title = ສົ່ງບົດລາຍງານ
report-ask = ເຈົ້າປະສົບບັນຫາຫຍັງກັບປະໂຫຍກນີ້?
report-offensive-language = ພາສາທີ່ຮຸນແຮງ
report-offensive-language-detail = ປະໂຫຍກດັ່ງກ່າວມີພາສາທີ່ບໍ່ເຄົາລົບ ຫຼືລັງກຽດ.
report-grammar-or-spelling = ໄວຍະກອນ / ການສະກົດຄໍາຜິດພາດ
report-grammar-or-spelling-detail = ປະໂຫຍກດັ່ງກ່າວມີໄວຍະກອນ ຫຼືການສະກົດຜິດ.
report-different-language = ພາສາທີ່ແຕກຕ່າງກັນ
report-different-language-detail = ມັນຂຽນເປັນພາສາທີ່ແຕກຕ່າງຈາກສິ່ງທີ່ຂ້ອຍເວົ້າ.
report-difficult-pronounce = ຍາກທີ່ຈະອອກສຽງ
report-difficult-pronounce-detail = ມັນປະກອບດ້ວຍຄໍາສັບຕ່າງໆຫຼືປະໂຫຍກທີ່ຍາກທີ່ຈະອ່ານຫຼືອອກສຽງ.
report-offensive-speech = ຄຳເວົ້າທີ່ບໍ່ເໝາະສົມ
report-offensive-speech-detail = ຄລິບດັ່ງກ່າວມີພາສາທີ່ບໍ່ເຄົາລົບ ຫຼືລັງກຽດ.
report-other-comment =
    .placeholder = ຄວາມຄິດເຫັນ
success = ສຳເລັດ
continue = ສືບຕໍ່
report-success = ລາຍງານໄດ້ຜ່ານສຳເລັດແລ້ວ

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = ບັນທຶກ/ຢຸດ
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = ບັນທຶກຄລິບຄືນໃໝ່
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = ຍົກເລີກການບັນທຶກທີ່ກຳລັງດຳເນີນຢູ່
shortcut-submit = ກັບຄືນ
shortcut-submit-label = ສົ່ງຄລິບ
request-language-text = ບໍ່ເຫັນພາສາຂອງເຈົ້າຢູ່ໃນ Common Voice?
request-language-button = ຮ້ອງຂໍພາສາ

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = ຫຼິ້ນ/ຢຸດ
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = ເງື່ອນໄຂ
contribution-criteria-link = ເຂົ້າໃຈເງື່ອນໄຂການປະກອບສ່ວນ
contribution-criteria-page-title = ເງື່ອນໄຂການປະກອບສ່ວນ
contribution-criteria-page-description = ເຂົ້າໃຈສິ່ງທີ່ຕ້ອງຊອກຫາໃນເວລາຟັງຄລິບສຽງ ແລະຊ່ວຍເຮັດໃຫ້ການບັນທຶກສຽງຂອງທ່ານດີຂຶ້ນນຳ!
contribution-for-example = ຍົກ​ຕົວ​ຢ່າງ
contribution-misreadings-title = ການອ່ານຜິດ
contribution-misreadings-description = ເມື່ອ​ຟັງ​ແລ້ວ​ໃຫ້​ກວດ​ເບິ່ງ​ໃຫ້​ດີ​ວ່າ​ສິ່ງ​ທີ່​ໄດ້​ບັນທຶກ​ໄວ້​ນັ້ນ​ແມ່ນ​ສິ່ງ​ທີ່​ໄດ້​ຂຽນ​ໄວ້​ແທ້; ປະຕິເສດຖ້າມີຂໍ້ຜິດພາດເລັກນ້ອຍ. <br />ຄວາມຜິດພາດທົ່ວໄປຫຼາຍລວມມີ:
contribution-misreadings-description-extended-list-1 = ບໍ່ມີ <strong>'A'</strong> ຫຼື <strong>'The'</strong> ໃນຕອນຕົ້ນຂອງການບັນທຶກ.
contribution-misreadings-description-extended-list-2 = ຂາດ <strong>'s</strong> ຢູ່ທ້າຍຄຳສັບໃດໜຶ່ງ.
contribution-misreadings-description-extended-list-3 = ການອ່ານການຫົດຕົວທີ່ບໍ່ມີຕົວຕົນ, ເຊັ່ນ "ພວກເຮົາ" ແທນ "ພວກເຮົາ", ຫຼືໃນທາງກັບກັນ.
contribution-misreadings-description-extended-list-4 = ຂາດການສິ້ນສຸດຂອງຄໍາສຸດທ້າຍໂດຍການຕັດການບັນທຶກໄວເກີນໄປ.
contribution-misreadings-description-extended-list-5 = ພະຍາຍາມຫຼາຍຄັ້ງເພື່ອອ່ານຄຳສັບໃດໜຶ່ງ.
contribution-misreadings-example-1-title = ໄດໂນເສົາຍັກໃຫຍ່ຂອງ Triassic.
contribution-misreadings-example-2-title = ໄດໂນເສົາຍັກໃຫຍ່ຂອງ Triassic.
contribution-misreadings-example-2-explanation = [ຄວນຈະເປັນ 'ໄດໂນເສົາ']
contribution-misreadings-example-3-title = ໄດໂນເສົາຍັກໃຫຍ່ຂອງ Triassi-.
contribution-misreadings-example-3-explanation = [ການ​ບັນ​ທຶກ​ການ​ຕັດ​ອອກ​ກ່ອນ​ທີ່​ຈະ​ສິ້ນ​ສຸດ​ຂອງ​ຄໍາ​ສຸດ​ທ້າຍ​]
contribution-misreadings-example-4-title = ໄດໂນເສົາຍັກໃຫຍ່ຂອງ Triassic. ແມ່ນແລ້ວ.
contribution-misreadings-example-4-explanation = [ໄດ້​ຮັບ​ການ​ບັນ​ທຶກ​ຫຼາຍ​ກ​່​ວາ​ຂໍ້​ຄວາມ​ທີ່​ຕ້ອງ​ການ​]
contribution-misreadings-example-5-title = ພວກເຮົາກໍາລັງອອກໄປຮັບກາເຟ.
contribution-misreadings-example-6-title = ພວກເຮົາອອກໄປຮັບກາເຟ.
contribution-misreadings-example-6-explanation = [ຄວນຈະເປັນ “ເຮົາ”]
contribution-misreadings-example-7-title = ພວກເຮົາກໍາລັງອອກໄປຮັບກາເຟ.
contribution-misreadings-example-7-explanation = [ບໍ່ມີ 'a' ໃນຂໍ້ຄວາມຕົ້ນສະບັບ]
contribution-misreadings-example-8-title = bumblebee ໄດ້ sped ໂດຍ.
contribution-misreadings-example-8-explanation = [ເນື້ອໃນບໍ່ກົງກັນ]
contribution-varying-pronunciations-title = ການອອກສຽງທີ່ແຕກຕ່າງກັນ
contribution-varying-pronunciations-description = ຈົ່ງລະມັດລະວັງກ່ອນທີ່ຈະປະຕິເສດຄລິບທີ່ຜູ້ອ່ານໄດ້ອອກສຽງຜິດ, ເຮັດໃຫ້ເກີດຄວາມກົດດັນໃນບ່ອນທີ່ບໍ່ຖືກຕ້ອງ, ຫຼືເບິ່ງຄືວ່າບໍ່ສົນໃຈເຄື່ອງຫມາຍຄໍາຖາມ. ມີ​ການ​ອອກ​ສຽງ​ທີ່​ຫຼາກ​ຫຼາຍ​ໃນ​ການ​ນໍາ​ໃຊ້​ໃນ​ທົ່ວ​ໂລກ​, ບາງ​ສ່ວນ​ທີ່​ທ່ານ​ອາດ​ຈະ​ບໍ່​ໄດ້​ຍິນ​ໃນ​ຊຸມ​ຊົນ​ທ້ອງ​ຖິ່ນ​ຂອງ​ທ່ານ​. ກະລຸນາໃຫ້ຂອບຄຳຂອບໃຈສຳລັບຜູ້ທີ່ອາດຈະເວົ້າຕ່າງຈາກເຈົ້າ.
contribution-varying-pronunciations-description-extended = ໃນທາງກົງກັນຂ້າມ, ຖ້າທ່ານຄິດວ່າຜູ້ອ່ານອາດຈະບໍ່ເຄີຍພົບຄໍານີ້ມາກ່ອນ, ແລະພຽງແຕ່ຄາດເດົາການອອກສຽງທີ່ບໍ່ຖືກຕ້ອງ, ກະລຸນາປະຕິເສດ. ຖ້າທ່ານບໍ່ແນ່ໃຈ, ໃຫ້ໃຊ້ປຸ່ມຂ້າມ.
contribution-varying-pronunciations-example-1-title = ຢູ່ເທິງຫົວຂອງລາວ, ລາວນຸ່ງເສື້ອ beret.
contribution-varying-pronunciations-example-1-explanation = ['Beret' ແມ່ນ OK ບໍ່​ວ່າ​ຈະ​ມີ​ຄວາມ​ກົດ​ດັນ​ກ່ຽວ​ກັບ​ພະ​ຍາ​ງ​ທໍາ​ອິດ (UK) ຫຼື​ຄັ້ງ​ທີ​ສອງ (US)]
contribution-varying-pronunciations-example-2-title = ມືຂອງລາວຖືກຍົກຂຶ້ນ.
contribution-varying-pronunciations-example-2-explanation = ['ຍົກຂຶ້ນມາ' ໃນພາສາອັງກິດສະເຫມີອອກສຽງເປັນພະຍັນຊະນະຫນຶ່ງ, ບໍ່ແມ່ນສອງ]
contribution-background-noise-title = ສິ່ງລົບກວນພື້ນຫຼັງ
contribution-background-noise-description = ພວກເຮົາຕ້ອງການໃຫ້ລະບົບການຮຽນຮູ້ເຄື່ອງຈັກສາມາດຈັດການກັບສິ່ງລົບກວນໃນພື້ນຫຼັງທີ່ຫຼາກຫຼາຍ, ແລະເຖິງແມ່ນວ່າສຽງດັງທີ່ຂ້ອນຂ້າງສາມາດຍອມຮັບໄດ້ເນື່ອງຈາກພວກມັນບໍ່ປ້ອງກັນທ່ານຈາກການໄດ້ຍິນຂໍ້ຄວາມທັງໝົດ. ດົນຕີພື້ນຫຼັງງຽບແມ່ນ OK; ດົນຕີດັງພໍທີ່ຈະປ້ອງກັນບໍ່ໃຫ້ເຈົ້າໄດ້ຍິນແຕ່ລະຄົນແລະທຸກຄໍາບໍ່ແມ່ນ.
contribution-background-noise-description-extended = ຖ້າການບັນທຶກແຕກ, ຫຼືມີຮອຍແຕກ, ປະຕິເສດ ເວັ້ນເສຍແຕ່ວ່າຂໍ້ຄວາມທັງໝົດຈະຍັງໄດ້ຍິນ.
contribution-background-noise-example-1-fixed-title = <strong>[ຈາມ]</strong> ໄດໂນເສົາຍັກຂອງ <strong>[ໄອ]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = ໄດໂນ້ຍັກ<strong>[ໄອ]</strong> Triassic.
contribution-background-noise-example-2-explanation = [ບາງສ່ວນຂອງຂໍ້ຄວາມບໍ່ສາມາດໄດ້ຍິນ]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]</strong> ໄດໂນເສົາຍັກຂອງ <strong>[crackle]</strong> -riassic.
contribution-background-voices-title = ສຽງພື້ນຫຼັງ
contribution-background-voices-description = Hubbub ພື້ນຫຼັງທີ່ງຽບສະຫງົບແມ່ນ OK, ແຕ່ພວກເຮົາບໍ່ຕ້ອງການສຽງເພີ່ມເຕີມທີ່ອາດຈະເຮັດໃຫ້ລະບົບເຄື່ອງຈັກໃນການລະບຸຄໍາທີ່ບໍ່ມີຢູ່ໃນຂໍ້ຄວາມທີ່ຂຽນ. ຖ້າທ່ານສາມາດໄດ້ຍິນຄໍາເວົ້າທີ່ແຕກຕ່າງຈາກຂໍ້ຄວາມ, ຄລິບຄວນຖືກປະຕິເສດ. ໂດຍປົກກະຕິແລ້ວ ອັນນີ້ເກີດຂຶ້ນໃນບ່ອນທີ່ໂທລະພາບຖືກປະໄວ້, ຫຼືບ່ອນທີ່ມີການສົນທະນາເກີດຂຶ້ນຢູ່ໃກ້ໆ.
contribution-background-voices-description-extended = ຖ້າການບັນທຶກແຕກ, ຫຼືມີຮອຍແຕກ, ປະຕິເສດ ເວັ້ນເສຍແຕ່ວ່າຂໍ້ຄວາມທັງໝົດຈະຍັງໄດ້ຍິນ.
contribution-background-voices-example-1-title = ໄດໂນເສົາຍັກໃຫຍ່ຂອງ Triassic. <strong>[ອ່ານດ້ວຍສຽງດຽວ]</strong>
contribution-background-voices-example-1-explanation = ເຈົ້າ​ກໍາ​ລັງ​ມາ​ບໍ່? <strong>[ເອີ້ນໂດຍຄົນອື່ນ]</strong>
contribution-volume-title = ລະດັບສຽງ
contribution-volume-description = ມັນຈະມີການປ່ຽນແປງທໍາມະຊາດໃນປະລິມານລະຫວ່າງຜູ້ອ່ານ. ປະ​ຕິ​ເສດ​ພຽງ​ແຕ່​ຖ້າ​ຫາກ​ວ່າ​ປະ​ລິ​ມານ​ທີ່​ສູງ​ທີ່​ຈະ​ເຮັດ​ໃຫ້​ການ​ບັນ​ທຶກ​ແຕກ​ຂຶ້ນ​, ຫຼື (ໂດຍ​ທົ່ວ​ໄປ​) ຖ້າ​ຫາກ​ວ່າ​ມັນ​ຕ​່​ໍ​າ​ທີ່​ທ່ານ​ບໍ່​ສາ​ມາດ​ໄດ້​ຍິນ​ສິ່ງ​ທີ່​ເວົ້າ​ໂດຍ​ບໍ່​ມີ​ການ​ອ້າງ​ອີງ​ເຖິງ​ຂໍ້​ຄວາມ​ທີ່​ຂຽນ​ໄດ້​.
contribution-reader-effects-title = ຜົນກະທົບຂອງຜູ້ອ່ານ
contribution-reader-effects-description = ການບັນທຶກສ່ວນຫຼາຍແມ່ນຂອງຄົນເວົ້າໃນສຽງທໍາມະຊາດຂອງເຂົາເຈົ້າ. ເຈົ້າສາມາດຮັບເອົາການບັນທຶກທີ່ບໍ່ໄດ້ມາດຕະຖານເປັນບາງຄັ້ງຄາວທີ່ຮ້ອງອອກມາ, ສຽງກະຊິບ, ຫຼືຖືກສົ່ງໃນສຽງ 'ລະຄອນ'. ກະ​ລຸ​ນາ​ປະ​ຕິ​ເສດ​ການ​ບັນ​ທຶກ​ການ​ຮ້ອງ​ເພງ​ແລະ​ການ​ນໍາ​ໃຊ້​ສຽງ​ທີ່​ສັງ​ເຄາະ​ດ້ວຍ​ຄອມ​ພິວ​ເຕີ​.
contribution-just-unsure-title = ພຽງແຕ່ບໍ່ແນ່ໃຈ?
contribution-just-unsure-description = ຖ້າທ່ານພົບບາງສິ່ງບາງຢ່າງທີ່ຄໍາແນະນໍາເຫຼົ່ານີ້ບໍ່ໄດ້ກວມເອົາ, ກະລຸນາລົງຄະແນນສຽງຕາມການຕັດສິນທີ່ດີທີ່ສຸດຂອງທ່ານ. ຖ້າເຈົ້າບໍ່ສາມາດຕັດສິນໃຈໄດ້ແທ້ໆ, ໃຫ້ໃຊ້ປຸ່ມຂ້າມ ແລະໄປບັນທຶກຕໍ່ໄປ.
see-more = <chevron></chevron>ເບິ່ງເພີ່ມເຕີມ
see-less = <chevron></chevron>ເບິ່ງໜ້ອຍລົງ
