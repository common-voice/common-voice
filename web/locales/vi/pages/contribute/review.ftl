## REVIEW

sc-review-lang-not-selected =
    Bạn chưa chọn bất kỳ ngôn ngữ nào. Xin vui lòng đi đến <profileLink>hồ sơ</profileLink>
    của bạn để chọn ngôn ngữ.
sc-review-title = Đánh giá câu
sc-review-loading = Đang tải câu…
sc-review-select-language = Vui lòng chọn một ngôn ngữ để đánh giá các câu.
sc-review-no-sentences =
    Không có câu nào để đánh giá.
    <addLink>Thêm các câu khác ngay bây giờ!</addLink>
sc-review-form-prompt =
    .message = Các câu đã đánh giá không được gửi, có chắc chắn không?
sc-review-form-usage =
    Vuốt sang phải để phê duyệt câu. Vuốt sang trái để từ chối.
    Vuốt lên để bỏ qua. <strong>Đừng quên gửi đánh giá của bạn!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Nguồn: { $sentenceSource }
sc-review-form-button-reject = Từ chối
sc-review-form-button-skip = Bỏ qua
sc-review-form-button-approve = Phê duyệt
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Bạn cũng có thể sử dụng phím tắt bàn phím: { sc-review-form-button-approve-shortcut } để Phê duyệt, { sc-review-form-button-reject-shortcut } để Từ chối, { sc-review-form-button-skip-shortcut } để Bỏ qua
sc-review-form-button-submit =
    .submitText = Kết thúc đánh giá
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Không có câu nào được đánh giá.
       *[other] { $sentences } câu đã được đánh giá. Cảm ơn bạn!
    }
sc-review-form-review-failure = Không thể lưu đánh giá. Vui lòng thử lại sau.
sc-review-link = Đánh giá

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Tiêu chí đánh giá
sc-criteria-title = Tiêu chí đánh giá
sc-criteria-make-sure = Đảm bảo câu đáp ứng các tiêu chí sau:
sc-criteria-item-1 = Câu phải được viết đúng chính tả.
sc-criteria-item-2 = Câu phải đúng ngữ pháp.
sc-criteria-item-3 = Câu phải nói được.
sc-criteria-item-4 = Nếu câu đáp ứng tiêu chí, hãy nhấp vào nút &quot;Phê duyệt&quot; ở bên phải.
sc-criteria-item-5-2 = Nếu câu không đáp ứng các tiêu chí trên, hãy nhấp vào nút &quot;Từ chối&quot; bên trái. Nếu bạn không chắc chắn về câu, bạn cũng có thể bỏ qua nó và chuyển sang câu tiếp theo.
sc-criteria-item-6 = Nếu hết câu cần xem lại, hãy giúp chúng tôi sưu tầm thêm các câu khác nhé!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kiểm tra <icon></icon> đây có phải là một câu đúng về mặt ngôn ngữ không?
sc-review-rules-title = Liệu câu đáp ứng các nguyên tắc?
sc-review-empty-state = Hiện tại không có câu nào để xem lại bằng ngôn ngữ này.
report-sc-different-language = Ngôn ngữ khác
report-sc-different-language-detail = Nó được viết bằng một ngôn ngữ khác với những gì tôi đang xem xét.
sentences-fetch-error = Đã xảy ra lỗi khi tải câu
review-error = Đã xảy ra lỗi khi xem xét câu này
review-error-rate-limit-exceeded = Bạn đang đi quá nhanh. Hãy dành một chút thời gian để xem lại câu để đảm bảo nó đúng.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Chúng tôi đang thực hiện một số thay đổi lớn
sc-redirect-page-subtitle-1 = Trình thu thập câu đang chuyển sang nền tảng cốt lõi của Common Voice. Giờ đây, bạn có thể <writeURL>viết</writeURL> một câu hoặc <reviewURL>xem xét</reviewURL> các bài gửi một câu trên Common Voice.
sc-redirect-page-subtitle-2 = Đặt câu hỏi cho chúng tôi trên <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> hoặc <emailLink>email</emailLink>.

