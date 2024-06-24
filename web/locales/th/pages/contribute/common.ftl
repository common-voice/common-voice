## Contribution

action-click = คลิก
action-tap = แตะ
## Languages

contribute = สนับสนุน
review = ตรวจทาน
skip = ข้าม
shortcuts = ทางลัด
clips-with-count-pluralized =
    { $count ->
       *[other] <bold>{ $count }</bold> คลิป
    }
goal-help-recording = คุณได้ช่วยให้ Common Voice บรรลุ <goalPercentage></goalPercentage> ของเป้าหมายการอัดเสียง { $goalValue } รายวันของเรา!
goal-help-validation = คุณได้ช่วยให้ Common Voice บรรลุ <goalPercentage></goalPercentage> ของเป้าหมายการตรวจสอบ { $goalValue } รายวันของเรา!
contribute-more =
    { $count ->
       *[other] พร้อมที่จะทำอีก { $count } หรือยัง?
    }
speak-empty-state = เราไม่มีประโยคที่จะให้บันทึกเสียงในภาษานี้แล้ว...
speak-empty-state-cta = มีส่วนร่วมเกี่ยวกับประโยค
speak-loading-error =
    เราหาประโยคให้คุณพูดไม่ได้
    โปรดลองอีกครั้งในภายหลัง
record-button-label = อัดเสียงของคุณ
share-title-new = <bold>ช่วยเรา</bold>หาเสียงเพิ่มเติม
keep-track-profile = ติดตามความคืบหน้าของคุณด้วยโปรไฟล์
login-to-get-started = เข้าสู่ระบบหรือลงทะเบียนเพื่อเริ่มต้นใช้งาน
target-segment-first-card = คุณกำลังมีส่วนร่วมในส่วนแรกของเป้าหมายของเรา
target-segment-generic-card = คุณกำลังมีส่วนร่วมในกลุ่มเป้าหมาย
target-segment-first-banner = ช่วยสร้างส่วนแรกของเป้าหมายของ Common Voice ใน { $locale }
target-segment-add-voice = เพิ่มเสียงของคุณ
target-segment-learn-more = เรียนรู้เพิ่มเติม

## Contribution Nav Items

contribute-voice-collection-nav-header = การรวบรวมเสียง
contribute-sentence-collection-nav-header = การรวบรวมประโยค

## Reporting

report = รายงาน
report-title = ส่งรายงาน
report-ask = คุณพบปัญหาอะไรในประโยคนี้?
report-offensive-language = ภาษาที่ไม่เหมาะสม
report-offensive-language-detail = ประโยคมีภาษาที่ไม่สุภาพ หรือไม่เหมาะสม
report-grammar-or-spelling = ข้อผิดพลาดทางไวยากรณ์ / การสะกดคำ
report-grammar-or-spelling-detail = ประโยคมีข้อผิดพลาดทางไวยากรณ์ หรือมีการสะกดผิด
report-different-language = คนละภาษา
report-different-language-detail = มันเขียนด้วยภาษาที่ไม่ใช่ภาษาพูดของฉัน
report-difficult-pronounce = ออกเสียงยาก
report-difficult-pronounce-detail = มีคำหรือวลีที่อ่านยาก หรือออกเสียงยาก
report-offensive-speech = คำพูดที่ไม่เหมาะสม
report-offensive-speech-detail = คลิปนี้มีภาษาที่ไม่สุภาพหรือไม่เหมาะสม
report-other-comment =
    .placeholder = ความคิดเห็น
success = สำเร็จ
continue = ดำเนินการต่อ
report-success = ส่งรายงานสำเร็จแล้ว

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = บันทึก/หยุด
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = บันทึกคลิปใหม่
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = ละทิ้งการบันทึกเสียงปัจจุบัน
shortcut-submit = Return
shortcut-submit-label = ส่งคลิป
request-language-text = ยังไม่พบภาษาของคุณบน Common Voice งั้นหรือ?
request-language-button = ขอภาษา

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = เล่น/หยุด
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = เกณฑ์
contribution-criteria-link = ทำความเข้าใจเกณฑ์การมีส่วนร่วม
contribution-criteria-page-title = เกณฑ์การมีส่วนร่วม
contribution-criteria-page-description = ทำความเข้าใจสิ่งต่าง ๆ ที่ควรมองหาขณะฟังคลิปเสียง และช่วยทำให้การบันทึกเสียงของคุณสมบูรณ์ยิ่งขึ้นด้วย!
contribution-for-example = ตัวอย่างเช่น
contribution-misreadings-title = การอ่านผิด
contribution-misreadings-description = ขณะฟัง ให้ตรวจสอบอย่างระมัดระวังว่าเสียงที่บันทึกตรงกับข้อความที่ปรากฏทุกประการ หากมีข้อผิดพลาดแม้แต่เล็กน้อยให้ปฏิเสธทันที <br />ข้อผิดพลาดที่มักพบบ่อยได้แก่:
contribution-misreadings-description-extended-list-4 = อัดคำสุดท้ายขาด เพราะกดหยุดอัดเร็วเกินไป
contribution-misreadings-description-extended-list-5 = พยายามอ่านคำหนึ่งหลายครั้ง
contribution-misreadings-example-2-explanation = [น่าจะเป็น 'ไดโนเสาร์']
contribution-misreadings-example-8-explanation = [เนื้อหาไม่ตรงกัน]
contribution-varying-pronunciations-title = การออกเสียงที่แตกต่างกัน
contribution-background-noise-title = เสียงรบกวนพื้นหลัง
contribution-background-noise-example-2-explanation = [ไม่ได้ยินข้อความบางส่วน]
contribution-background-voices-title = เสียงรบกวนพื้นหลัง
contribution-volume-title = ระดับเสียง
contribution-reader-effects-title = ผลกระทบจากผู้อ่าน
contribution-just-unsure-title = แค่ไม่แน่ใจ?
contribution-just-unsure-description = หากคุณพบสิ่งที่หลักเกณฑ์เหล่านี้ไม่ครอบคลุม โปรดโหวตตามวิจารณญาณที่ดีที่สุดของคุณ หากคุณตัดสินใจไม่ได้จริง ๆ ให้ใช้ปุ่ม ข้าม และตรวจสอบเสียงถัดไป
see-more = <chevron></chevron>ดูเพิ่ม
see-less = <chevron></chevron>ดูน้อยลง

