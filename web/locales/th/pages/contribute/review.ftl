## REVIEW

sc-review-lang-not-selected = คุณยังไม่ได้เลือกภาษาใด ๆ โปรดไปที่<profileLink>โปรไฟล์</profileLink>ของคุณเพื่อเลือกภาษา
sc-review-title = ตรวจทานประโยค
sc-review-loading = กำลังโหลดประโยค...
sc-review-select-language = โปรดเลือกภาษาเพื่อตรวจทานประโยค
sc-review-no-sentences = ไม่มีประโยคให้ตรวจทาน <addLink>เพิ่มประโยคเลย!</addLink>
sc-review-form-prompt =
    .message = ประโยคที่ตรวจทานยังไม่ได้ส่ง คุณแน่ใจหรือไม่?
sc-review-form-usage = ปัดไปทางขวาเพื่ออนุมัติประโยค ปัดไปทางซ้ายเพื่อปฏิเสธ ปัดขึ้นเพื่อข้าม <strong>อย่าลืมส่งการตรวจทานของคุณ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ที่มา: { $sentenceSource }
sc-review-form-button-reject = ปฏิเสธ
sc-review-form-button-skip = ข้าม
sc-review-form-button-approve = อนุมัติ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = คุณยังสามารถใช้แป้นพิมพ์ลัด: { sc-review-form-button-approve-shortcut } เพื่ออนุมัติ, { sc-review-form-button-reject-shortcut } เพื่อปฏิเสธ, { sc-review-form-button-skip-shortcut } เพื่อข้าม
sc-review-form-button-submit =
    .submitText = เสร็จสิ้นการตรวจสอบ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ไม่มีประโยคที่ตรวจทานแล้ว
       *[other] ตรวจทาน { $sentences } ประโยคแล้ว ขอขอบคุณ!
    }
sc-review-form-review-failure = ไม่สามารถบันทึกการตรวจทาน กรุณาลองใหม่อีกครั้งในภายหลัง
sc-review-link = ตรวจทาน

## REVIEW CRITERIA

sc-criteria-modal = ⓘ เกณฑ์การตรวจทาน
sc-criteria-title = เกณฑ์การตรวจทาน
sc-criteria-make-sure = โปรดตรวจสอบว่าประโยคตรงตามเกณฑ์ต่อไปนี้:
sc-criteria-item-1 = ประโยคต้องสะกดถูกต้อง
sc-criteria-item-2 = ประโยคต้องถูกต้องตามหลักไวยากรณ์
sc-criteria-item-3 = ประโยคจะต้องอ่านออกเสียงได้
sc-criteria-item-4 = หากประโยคตรงตามเกณฑ์ ให้คลิกปุ่ม "อนุมัติ" ทางด้านขวา
sc-criteria-item-5-2 = หากประโยคไม่ตรงตามเกณฑ์ข้างต้น ให้คลิกปุ่ม "ปฏิเสธ" ทางด้านซ้าย หากคุณไม่แน่ใจ สามารถข้ามไปยังประโยคถัดไปได้
sc-criteria-item-6 = หากคุณไม่มีประโยคที่จะตรวจทาน โปรดช่วยเรารวบรวมประโยคเพิ่มเติม!

## LANGUAGE VARIANT CODES


## REVIEW PAGE

sc-review-rules-title = ประโยคตรงตามหลักเกณฑ์หรือไม่?
sc-review-empty-state = ขณะนี้ไม่มีประโยคที่จะตรวจสอบในภาษานี้
report-sc-different-language = คนละภาษา
report-sc-different-language-detail = มันเขียนด้วยคนละภาษากับที่ฉันกำลังตรวจทานอยู่
sentences-fetch-error = เกิดข้อผิดพลาดในการดึงข้อมูลประโยค
review-error = เกิดข้อผิดพลาดในการตรวจทานประโยคนี้
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = เรากำลังทำการเปลี่ยนแปลงครั้งใหญ่
sc-redirect-page-subtitle-2 = ถามคำถามเราได้ที่ <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> หรือ <emailLink>อีเมล</emailLink>

