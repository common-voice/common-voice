## REVIEW

sc-review-lang-not-selected = ທ່ານຍັງບໍ່ໄດ້ເລືອກພາສາໃດໆ. ກະລຸນາໄປທີ່ <profileLink>Profile</profileLink> ຂອງທ່ານເພື່ອເລືອກພາສາ.
sc-review-title = ທົບທວນປະໂຫຍກ
sc-review-loading = ກຳລັງໂຫລດປະໂຫຍກ...
sc-review-select-language = ກະລຸນາເລືອກພາສາເພື່ອທົບທວນປະໂຫຍກ.
sc-review-no-sentences = ບໍ່ມີປະໂຫຍກທີ່ຈະທົບທວນຄືນ. <addLink>ເພີ່ມປະໂຫຍກເພີ່ມເຕີມດຽວນີ້!</addLink>
sc-review-form-prompt =
    .message = ບໍ່ໄດ້ສົ່ງປະໂຫຍກທີ່ທົບທວນຄືນ, ແນ່ໃຈບໍ?
sc-review-form-usage = ປັດຂວາເພື່ອອະນຸມັດປະໂຫຍກ. ປັດຊ້າຍເພື່ອປະຕິເສດມັນ. ປັດຂຶ້ນເພື່ອຂ້າມມັນ. <strong>ຢ່າລືມສົ່ງການທົບທວນຄືນຂອງທ່ານ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ທີ່ມາ: { $sentenceSource }
sc-review-form-button-reject = ປະຕິເສດ
sc-review-form-button-skip = ຂ້າມ
sc-review-form-button-approve = ອະນຸມັດ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = ທ່ານຍັງສາມາດໃຊ້ປຸ່ມລັດແປ້ນພິມ: { sc-review-form-button-approve-shortcut } ເພື່ອອະນຸມັດ, { sc-review-form-button-reject-shortcut } ເພື່ອປະຕິເສດ, { sc-review-form-button-skip-shortcut } ເພື່ອຂ້າມ
sc-review-form-button-submit =
    .submitText = ສໍາເລັດການກວດສອບ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ບໍ່ມີປະໂຫຍກໃຫ້ກວດ.
       *[other] ທົບທວນຄືນ { $sentences } ປະໂຫຍກແລ້ວ. ຂອບ​ໃຈ!
    }
sc-review-form-review-failure = ບໍ່ສາມາດບັນທຶກການກວດສອບໄດ້. ກະລຸນາລອງໃໝ່ໃນພາຍຫຼັງ.
sc-review-link = ທົບທວນ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ ກວດສອບເງື່ອນໄຂ
sc-criteria-title = ກວດສອບເງື່ອນໄຂ
sc-criteria-make-sure = ໃຫ້ແນ່ໃຈວ່າປະໂຫຍກນີ້ກົງກັບເງື່ອນໄຂດັ່ງຕໍ່ໄປນີ້:
sc-criteria-item-1 = ປະໂຫຍກຕ້ອງສະກົດຖືກຕ້ອງ.
sc-criteria-item-2 = ປະໂຫຍກຕ້ອງຖືກຕ້ອງຕາມໄວຍະກອນ.
sc-criteria-item-3 = ປະໂຫຍກຕ້ອງເວົ້າໄດ້.
sc-criteria-item-4 = ຖ້າ​ປະ​ໂຫຍກ​ມີ​ເງື່ອນ​ໄຂ​, ໃຫ້​ຄລິກ​ໃສ່ &quot;ອະ​ນຸ​ມັດ​&quot;. ປຸ່ມດ້ານຂວາ.
sc-criteria-item-5-2 = ຖ້າປະໂຫຍກບໍ່ກົງກັບເງື່ອນໄຂຂ້າງເທິງ, ໃຫ້ຄລິກໃສ່ &quot;ປະຕິເສດ&quot; ປຸ່ມຢູ່ເບື້ອງຊ້າຍ. ຖ້າທ່ານບໍ່ແນ່ໃຈກ່ຽວກັບປະໂຫຍກນັ້ນ, ທ່ານອາດຈະຂ້າມມັນໄປ ແລະຍ້າຍໄປອັນຕໍ່ໄປ.
sc-criteria-item-6 = ຖ້າ​ຫາກ​ທ່ານ​ຫມົດ​ປະ​ໂຫຍກ​ທີ່​ຈະ​ກວດ​, ກະ​ລຸ​ນາ​ຊ່ວຍ​ພວກ​ເຮົາ​ເກັບ​ກໍາ​ປະ​ໂຫຍກ​ໃຫ້ຫຼາຍຂຶ້ນ​!

## LANGUAGE VARIANT CODES


## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ກວດເບິ່ງ <icon></icon> ນີ້ແມ່ນປະໂຫຍກທີ່ຖືກຕ້ອງທາງພາສາບໍ່?
sc-review-rules-title = ປະໂຫຍກສອດຄ່ອງກັບຄໍາແນະນໍາບໍ?
sc-review-empty-state = ໃນປັດຈຸບັນບໍ່ມີປະໂຫຍກທີ່ຈະທົບທວນຄືນໃນພາສານີ້.
report-sc-different-language = ພາສາທີ່ແຕກຕ່າງກັນ
report-sc-different-language-detail = ມັນຂຽນເປັນພາສາທີ່ແຕກຕ່າງຈາກສິ່ງທີ່ຂ້ອຍກໍາລັງທົບທວນ.
sentences-fetch-error = ເກີດຄວາມຜິດພາດໃນການດຶງຂໍ້ມູນປະໂຫຍກ
review-error = ເກີດຄວາມຜິດພາດໃນການກວດສອບປະໂຫຍກນີ້
review-error-rate-limit-exceeded = ທ່ານໄປໄວເກີນໄປ. ກະລຸນາໃຊ້ເວລາຄາວໜຶ່ງເພື່ອທົບທວນປະໂຫຍກເພື່ອໃຫ້ແນ່ໃຈວ່າມັນຖືກຕ້ອງ.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ພວກເຮົາເຮັດການປ່ຽນແປງອັນໃຫຍ່ຫຼວງ
sc-redirect-page-subtitle-1 = ຕົວເກັບກຳປະໂຫຍກກຳລັງຍ້າຍໄປທີ່ເວທີສຽງທົ່ວໄປຫຼັກ. ດຽວນີ້ທ່ານສາມາດ <writeURL>ຂຽນ</writeURL> ປະໂຫຍກ ຫຼື <reviewURL>review</reviewURL> ປະໂຫຍກດຽວທີ່ສົ່ງໃນ Common Voice.
sc-redirect-page-subtitle-2 = ຖາມພວກເຮົາຄໍາຖາມກ່ຽວກັບ <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ຫຼື <emailLink>email</emailLink>.

