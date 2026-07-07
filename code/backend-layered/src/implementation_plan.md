# Kế hoạch Refactor Hệ Thống (Tách các file dài)

Sau khi rà soát toàn bộ mã nguồn của dự án (cả Frontend và Backend), tôi đã phát hiện một số file có kích thước quá lớn (trên 250 dòng). Việc duy trì các file dài này sẽ gây khó khăn cho quá trình đọc hiểu, bảo trì và mở rộng sau này. 

Dưới đây là danh sách các file cần refactor và phương án tách nhỏ:

## 1. Frontend (`Next-frontend/src/`)

Hầu hết các file dài ở frontend là các Page Component hoặc Modal chứa quá nhiều logic (gọi API, xử lý state form, hiển thị UI bảng, hiển thị chi tiết).

| Tên File | Độ dài (dòng) | Phương án xử lý |
| :--- | :--- | :--- |
| `AuditLogsPageContent.tsx` | 602 | - Tách phần hiển thị bảng (`AuditLogTable.tsx`).<br>- Tách phần bộ lọc tìm kiếm (`AuditLogFilters.tsx`).<br>- Tách phần hiển thị chi tiết log (`AuditLogDetail.tsx`). |
| `SettingsPageContent.tsx` | 529 | - Tách các section cài đặt thành các component riêng biệt (ví dụ: `GeneralSettings.tsx`, `NotificationSettings.tsx`, `SecuritySettings.tsx`). |
| `AddBookModal.tsx` | 397 | - Tách phần form upload ảnh.<br>- Tách phần xử lý form logic ra một custom hook `useAddBookForm`. |
| `AnalyticsSections.tsx` | 366 | - Tách từng biểu đồ/bảng thống kê ra thành các file module riêng (ví dụ: `RevenueChart.tsx`, `TopBooksTable.tsx`). |
| `BorrowTable.tsx` | 366 | - Tách các logic filter, pagination và action buttons ra các sub-components. |
| `EditBookModal.tsx` | 335 | - Tách logic xử lý form ra custom hook tương tự `AddBookModal`. |
| `BookTable.tsx` | 289 | - Tách phần cột (columns definition) và action menu. |
| `ReturnBookModal.tsx` | 273 | - Tách các phần tính toán phí trễ hạn và form kiểm tra tình trạng sách. |
| `BorrowForm.tsx` | 270 | - Tách các step của form mượn sách. |
| `ReturnInvoiceModal.tsx` | 258 | - Tách phần giao diện hóa đơn in ấn. |
| `ContactContent.tsx` | 251 | - Tách phần hiển thị thông tin và phần Form gửi liên hệ. |

## 2. Backend (`backend-layered/src/`)

Ở phía Backend, các class Service đang đảm nhận quá nhiều logic nghiệp vụ, vi phạm nguyên tắc SRP (Single Responsibility Principle).

| Tên File | Độ dài (dòng) | Phương án xử lý |
| :--- | :--- | :--- |
| `BorrowOrderServiceImpl.java` | ~933 | Đây là file dài nhất. Cần tách thành:<br>- `BorrowOrderCreateService`: Chuyên xử lý logic tạo đơn mượn.<br>- `BorrowOrderQueryService`: Chuyên xử lý việc truy xuất lịch sử, thống kê.<br>- `BorrowOrderPaymentService`: Chuyên xử lý logic thanh toán VNPAY.<br>- `BorrowOrderReturnService`: Xử lý logic trả sách (có thể gom chung với `BookReturnService`). |
| `BookReturnServiceImpl.java` | 371 | Tương tự, tách các phần logic tính phí phạt, kiểm tra tình trạng sách thành các helper hoặc component riêng (`PenaltyCalculationHelper`). |
| `AdminBorrowServiceImpl.java`| 347 | Tách các logic phê duyệt đơn mượn, từ chối đơn mượn thành các use-case riêng biệt. |
| `BookServiceImpl.java` | 280 | Tách các logic quản lý đầu sách và bản sao (BookCopy) ra khỏi nhau. |

> [!WARNING]
> **Rủi ro ảnh hưởng:** Việc refactor backend đòi hỏi phải thay đổi các injection (`@Autowired` / `@RequiredArgsConstructor`) ở tầng Controller. Đối với Frontend, có thể sẽ phải truyền nhiều props giữa các component con hơn.

## Câu hỏi / Quyết định từ bạn

> [!IMPORTANT]
> 1. **Phạm vi thực hiện:** Bạn muốn tôi refactor **toàn bộ** các file trên, hay bắt đầu làm mẫu từ một số file cụ thể trước (ví dụ: làm Frontend trước, hoặc làm file dài nhất `BorrowOrderServiceImpl` trước)?
> 2. **Kiến trúc thay thế ở Backend:** Khi tách `BorrowOrderServiceImpl`, bạn có đồng ý tách thành nhiều class Service nhỏ (Facade pattern) để tiêm (inject) vào Controller không?

Vui lòng bấm **Proceed** hoặc trả lời qua chat để xác nhận hướng đi. Cảm ơn bạn!
