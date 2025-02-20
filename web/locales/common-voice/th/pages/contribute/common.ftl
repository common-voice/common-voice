action-click = คลิก
action-tap = แตะ
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
no-sentences-for-variants = หน่วยย่อยภาษาของคุณอาจไม่มีประโยคเหลืออยู่! ถ้าคุณสะดวก คุณสามารถเปลี่ยนการตั้งค่าเพื่อให้เห็นประโยคอื่นๆ ที่เป็นภาษาของคุณได้
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
change-preferences = เปลี่ยนค่าปรับแต่ง
login-signup = เข้าสู่ระบบ / ลงทะเบียน
vote-yes = ใช่
vote-no = ไม่
datasets = ชุดข้อมูล
languages = ภาษา
about = เกี่ยวกับ
partner = พันธมิตร
submit-form-action = ส่ง

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
contribution-misreadings-description-extended-list-1 = ขาดคำว่า <strong>'A'</strong> หรือ <strong>'The'</strong> ที่ช่วงต้นของเสียงที่บันทึก (สำหรับภาษาอังกฤษ)
contribution-misreadings-description-extended-list-2 = ขาด <strong>'s'</strong> ที่ช่วงท้ายของคำ (สำหรับภาษาอังกฤษ)
contribution-misreadings-description-extended-list-3 = การอ่านคำไม่ตรงตามรูปของคำที่ปรากฏจริง เช่น การอ่านว่า "We're" แทนที่จะเป็น "We are" หรือตรงกันข้าม (สำหรับภาษาอังกฤษ) หรือการอ่านว่า "กำลัง" แทนที่จะเป็น "กำลังจะ" (สำหรับภาษาไทย)
contribution-misreadings-description-extended-list-4 = อัดคำสุดท้ายขาด เพราะกดหยุดอัดเร็วเกินไป
contribution-misreadings-description-extended-list-5 = พยายามอ่านคำหนึ่งหลายครั้ง
contribution-misreadings-example-1-title = เหล่าไดโนเสาร์ยักษ์แห่งยุคไทรแอสซิก
contribution-misreadings-example-2-title = ไดโนเสาร์ยักษ์แห่งยุคไทรแอสซิก
contribution-misreadings-example-2-explanation = [ควรจะเป็น ‘เหล่าไดโนเสาร์’]
contribution-misreadings-example-3-title = เหล่าไดโนเสาร์ยักษ์แห่งยุคไทรแอสซิ-
contribution-misreadings-example-3-explanation = [กดหยุดอัดก่อนที่จะอัดคำสุดท้ายจบ]
contribution-misreadings-example-4-title = ไดโนเสาร์ยักษ์แห่งยุคไทรแอสซิก อืม
contribution-misreadings-example-4-explanation = [มีการอัดคำอื่นที่อยู่นอกเหนือจากข้อความที่ต้องการ]
contribution-misreadings-example-5-title = เรากำลังจะออกไปซื้อกาแฟ
contribution-misreadings-example-6-title = เรากำลังออกไปซื้อกาแฟ
contribution-misreadings-example-6-explanation = [ควรจะเป็น “กำลังจะ”]
contribution-misreadings-example-7-title = เรากำลังจะออกไปซื้อกาแฟหน่อย
contribution-misreadings-example-7-explanation = [ไม่มีคำว่า ‘หน่อย’ ในข้อความต้นฉบับ]
contribution-misreadings-example-8-title = ผึ้งบัมเบิ้ลบีบินผ่านไป
contribution-misreadings-example-8-explanation = [เนื้อหาไม่ตรง]
contribution-varying-pronunciations-title = การออกเสียงที่แตกต่างกัน
contribution-varying-pronunciations-description = ให้ระมัดระวังก่อนที่จะปฏิเสธคลิปเสียงด้วยเหตุผลที่ว่าผู้อ่านออกเสียงคำผิด เน้นคำไม่ถูกจุด หรืออ่านโดยไม่ได้สังเกตเครื่องหมายคำถามท้ายประโยค เนื่องจากภาษาอังกฤษทั่วโลก หรือภาษาไทยทั่วประเทศจะมีการออกเสียงที่ใช้กันหลายแบบ ซึ่งบางแบบนั้นคุณอาจไม่เคยได้ยินมาก่อนในชุมชนท้องถิ่นของคุณ ดังนั้นโปรดเผื่อใจไว้สำหรับผู้ที่อาจออกเสียงไม่เหมือนคุณด้วย
contribution-varying-pronunciations-description-extended = กลับกัน ถ้าคุณคิดว่าผู้อ่านอาจไม่เคยพบคำนี้มาก่อน และออกเสียงโดยการคาดเดาซึ่งไม่ถูกต้อง โปรดปฏิเสธคลิปเสียงดังกล่าว ถ้าคุณไม่แน่ใจ ให้กดปุ่มข้าม
contribution-varying-pronunciations-example-1-title = On his head he wore a beret.
contribution-varying-pronunciations-example-1-explanation = [คำว่า ‘Beret’ สามารถเน้นเสียงทั้งในพยางค์แรก (แบบอังกฤษ) หรือพยางค์หลัง (แบบอเมริกัน) ก็ได้]
contribution-varying-pronunciations-example-2-title = อุณหภูมิในห้องมีค่าเท่าไร
contribution-varying-pronunciations-example-2-explanation = [คำว่า ‘อุณหภูมิ’ นั้นออกเสียงสามพยางค์ (อุน-หะ-พูม) ไม่ได้ออกเสียงสี่พยางค์ (อุน-นะ-หะ-พูม)]
contribution-background-noise-title = เสียงรบกวนพื้นหลัง
contribution-background-noise-description = เราต้องการให้อัลกอริทึมการเรียนรู้ของเครื่องสามารถรับมือกับเสียงรบกวนพื้นหลังชนิดต่างๆ ได้ แม้แต่เสียงรบกวนซึ่งค่อนข้างดังเช่นกัน แต่ต้องไม่มากเกินไปจนคุณไม่ได้ยินข้อความครบทั้งหมด ดนตรีพื้นหลังที่เงียบนั้นสามารถใช้ได้ แต่เสียงเพลงที่ดังจนคุณไม่ได้ยินคำบางคำหรือทุกคำนั้นใช้ไม่ได้
contribution-background-noise-description-extended = ถ้าเสียงที่อัดมานั้นมีการขาดหาย หรือมีเสียงแตก ให้ปฏิเสธ เว้นแต่จะยังสามารถได้ยินข้อความครบทั้งหมด
contribution-background-noise-example-1-fixed-title = <strong>[จาม]</strong> เหล่าไดโนเสาร์ยักษ์แห่งยุค <strong>[ไอ]</strong> ไทรแอสซิก
contribution-background-noise-example-2-fixed-title = เหล่าไดโน <strong>[ไอ]</strong> ยักษ์แห่งยุคไทรแอสซิก
contribution-background-noise-example-2-explanation = [ไม่ได้ยินข้อความบางส่วน]
contribution-background-noise-example-3-fixed-title = <strong>[เสียงแตก]</strong> ไดโนเสาร์ยักษ์แห่ง <strong>[เสียงแตก]</strong> -ทรแอสซิก
contribution-background-voices-title = เสียงรบกวนพื้นหลัง
contribution-background-voices-description = เสียงรบกวนพื้นหลังที่เงียบนั้นใช้ได้ แต่เราไม่ต้องการเสียงอื่นๆ ที่อาจทำให้อัลกอริทึมระบุคำที่ไม่ได้อยู่ในข้อความที่เขียนได้ ถ้าคุณได้ยินคำอื่นๆ ที่นอกเหนือไปจากในข้อความเหล่านั้นอย่างชัดเจน คุณควรจะปฏิเสธคลิปเสียงนั้น โดยปกติแล้วเหตุการณ์นี้จะเกิดขึ้นในกรณีที่เปิดทีวีทิ้งไว้ หรือมีคนพูดคุยอยู่บริเวณใกล้เคียง
contribution-background-voices-description-extended = ถ้าเสียงที่อัดมานั้นมีการขาดหาย หรือมีเสียงแตก ให้ปฏิเสธ เว้นแต่จะยังสามารถได้ยินข้อความครบทั้งหมด
contribution-background-voices-example-1-title = เหล่าไดโนเสาร์ยักษ์แห่งยุคไทรแอสซิก <strong>[ออกเสียงโดยคนหนึ่ง]</strong>
contribution-background-voices-example-1-explanation = ไปด้วยกันไหม? <strong>[เสียงจากอีกคนหนึ่ง]</strong>
contribution-volume-title = ระดับเสียง
contribution-volume-description = ระดับเสียงของผู้อ่านแต่ละคนจะมีช่วงที่แตกต่างกันตามธรรมชาติ ให้ปฏิเสธก็ต่อเมื่อระดับเสียงดังเกินไปจนคลิปเสียงที่อัดนั้นใช้ไม่ได้ หรือเบาเกินไปจนคุณไม่ได้ยินเนื้อหาที่พูดถ้าไม่เห็นข้อความที่เขียน (ซึ่งพบได้บ่อยกว่า)
contribution-reader-effects-title = ผลกระทบจากผู้อ่าน
contribution-reader-effects-description = คลิปเสียงที่อัดส่วนใหญ่จะเป็นเสียงของผู้อ่านที่พูดด้วยเสียงธรรมชาติของตนเอง คุณสามารถยอมรับคลิปเสียงที่ไม่ได้อัดด้วยเสียงธรรมชาติที่พบได้บางครั้งซึ่งเป็นการตะโกน กระซิบ หรือออกเสียงแบบ ‘เร้าใจจนเกินจริง’ อย่างชัดเจนได้ แต่โปรดปฏิเสธคลิปเสียงที่อัดด้วยเสียงเหมือนร้องเพลงและที่อัดด้วยเสียงซึ่งได้จากการสังเคราะห์ด้วยคอมพิวเตอร์
contribution-just-unsure-title = ยังไม่แน่ใจใช่ไหม?
contribution-just-unsure-description = ถ้าคุณพบสิ่งที่หลักเกณฑ์เหล่านี้ไม่ครอบคลุม โปรดโหวตตามวิจารณญาณที่ดีที่สุดของคุณ ถ้าคุณตัดสินใจไม่ได้จริง ๆ ให้ใช้ปุ่ม ข้าม และตรวจสอบเสียงถัดไป
see-more = <chevron></chevron>ดูเพิ่ม
see-less = <chevron></chevron>ดูน้อยลง
