export const ADMIN = {
    SIDEBAR: {
        NAV_OVERVIEW: "Tổng quan",
        NAV_BOOKS: "Kho sách",
        NAV_CATEGORIES: "Thể loại",
        NAV_AUTHORS: "Tác giả",
        NAV_BORROWS: "Lượt mượn",
        NAV_MEMBERS: "Thành viên",
        NAV_STATS: "Thống kê",
        NAV_SETTINGS: "Cài đặt",
        ROLE_ADMIN: "Quản trị viên",
        SYS_NAME: "Hệ thống quản lý",
        HEADING_NAV: "Điều hướng",
        ADD_BOOK: "Thêm sách mới",
        SUPPORT: "Hỗ trợ",
        LOGOUT: "Đăng xuất",
    },
    PENDING_REQUESTS: {
        TITLE: "Yêu cầu chờ duyệt",
        VIEW_ALL: "Xem tất cả",
        EMPTY_STATE: "Không còn yêu cầu nào đang chờ. Mọi thứ đã được xử lý.",
        TABLE_MEMBER: "Thành viên",
        TABLE_BOOK_TITLE: "Tựa sách yêu cầu",
        TABLE_MATCH: "Độ khớp",
        TABLE_ACTIONS: "Thao tác",
        BTN_REJECT: "Từ chối",
        BTN_APPROVE: "Duyệt",
    },
    SMART_CATALOGING: {
        TITLE: "Lên danh mục tự động",
        SUBTITLE: "Tải ảnh gáy sách hoặc mã ISBN — AI sẽ tự trích xuất thông tin.",
        DRAG_DROP: "Thả ảnh vào đây",
        OR_CLICK: "hoặc bấm để chọn tệp",
        MANUAL_ENTRY: "Nhập thủ công",
    },
    THONG_KE: {
        TITLE: "Thống kê",
        DESCRIPTION: "Trang thống kê sẽ chứa biểu đồ và số liệu tại đây.",
    },
    MODAL: {
        ADD_BOOK: {
            TITLE: "Thêm Sách Mới",
            TITLE_INPUT: "Tiêu đề *",
            AUTHOR_INPUT: "Tác giả *",
            ISBN_INPUT: "ISBN",
            CATEGORY_INPUT: "Thể loại",
            PUBLISHER_INPUT: "Nhà xuất bản",
            PUBLICATION_DATE_INPUT: "Ngày xuất bản",
            PAGES_INPUT: "Số trang",
            DESCRIPTION_INPUT: "Mô tả sách",
            SHELF_LOCATION_INPUT: "Vị trí kệ sách",
            IMAGE_URL_INPUT: "URL Ảnh bìa",
            DEPOSIT_PRICE_INPUT: "Giá cọc",
            CANCEL: "Hủy bỏ",
            SUBMIT: "Thêm sách",
            SUCCESS: "Thêm sách thành công!",
            ERROR: "Lỗi khi thêm sách",
            LOADING: "Đang xử lý...",
            SELECT_AUTHOR_PLACEHOLDER: "Chọn hoặc nhập tác giả mới...",
            CREATE_AUTHOR: "Tạo tác giả",
            NO_AUTHOR_FOUND: "Không tìm thấy tác giả",
            SELECT_CATEGORY_PLACEHOLDER: "Chọn hoặc nhập thể loại mới...",
            CREATE_CATEGORY: "Tạo thể loại",
            NO_CATEGORY_FOUND: "Không tìm thấy thể loại"
        },
        EDIT_BOOK: {
            TITLE: "Chỉnh sửa sách",
            TITLE_INPUT: "Tiêu đề *",
            AUTHOR_INPUT: "Tác giả *",
            ISBN_INPUT: "ISBN",
            CATEGORY_INPUT: "Thể loại",
            QUANTITY_TOTAL: "Tổng số lượng",
            QUANTITY_AUTO_NOTE: "Tự động cập nhật từ danh sách bản sao",
            QUANTITY_AVAILABLE: "Số lượng có sẵn",
            SHELF_LOCATION_INPUT: "Vị trí kệ sách",
            IMAGE_URL_INPUT: "URL Ảnh bìa",
            CANCEL: "Hủy bỏ",
            SUBMIT: "Lưu thay đổi",
            SUCCESS: "Cập nhật sách thành công!",
            ERROR: "Lỗi khi lưu sách",
            LOADING: "Đang xử lý...",
            SELECT_AUTHOR_PLACEHOLDER: "Chọn hoặc nhập tác giả mới...",
            CREATE_AUTHOR: "Tạo tác giả",
            NO_AUTHOR_FOUND: "Không tìm thấy tác giả",
            SELECT_CATEGORY_PLACEHOLDER: "Chọn hoặc nhập thể loại mới...",
            CREATE_CATEGORY: "Tạo thể loại",
            NO_CATEGORY_FOUND: "Không tìm thấy thể loại"
        },
        DELETE_AUTHOR: {
            TITLE: "Xác nhận xoá tác giả",
            DESCRIPTION: "Bạn có chắc chắn muốn xoá tác giả này? Các sách thuộc tác giả này sẽ không còn hiển thị tác giả này nữa. Hành động này không thể hoàn tác.",
            CANCEL: "Hủy",
            CONFIRM: "Xóa tác giả"
        }
    }
};

export const ADMIN_LAYOUT = {
    TOPBAR: {
        HEADING: "Tổng quan",
        SUBHEADING: "Chào mừng trở lại, Admin. Đây là tình hình hôm nay.",
        SEARCH_PLACEHOLDER: "Tìm kho sách bằng ngữ nghĩa AI…",
        SEARCH_SHORTCUT: "⌘K",
    },
    ALERTS: {
        HEADING: "Cảnh báo hệ thống",
        SYNC_DELAY_TITLE: "Đồng bộ máy chủ bị trễ",
        SYNC_DELAY_DESC: "Kho Chi nhánh 8 chưa đồng bộ trong 2 giờ qua.",
        AI_UPDATE_TITLE: "Cập nhật mô hình AI",
        AI_UPDATE_DESC: "Tìm kiếm ngữ nghĩa được cải thiện cho thể loại lịch sử.",
    },
};

export const ADMIN_PAGES = {
    DASHBOARD: {
        BOOKS_TODAY: "Sách mượn hôm nay",
        BOOKS_TODAY_TREND: "+12% so với tuần trước",
        PENDING_APPROVAL: "Chờ phê duyệt",
        PENDING_APPROVAL_DESC: "Cần xem xét trong 24h",
        OVERDUE_BOOKS: "Sách quá hạn",
        OVERDUE_BOOKS_DESC: "Cần xử lý ngay",
    },
    MEMBERS: {
        TITLE: "Thành viên",
        DESC: "Trang quản lý thành viên thư viện sẽ hiển thị ở đây.",
    },
    BORROW_LOGS: {
        TITLE: "Lượt mượn",
        DESC: "Trang quản lý lượt mượn sách sẽ hiển thị thông tin ở đây.",
    },
    INVENTORY: {
        TITLE: "Kho sách",
        DESC: "Đây là trang kho sách. Bạn có thể thêm nội dung quản lý sách ở đây.",
    },
    SETTINGS: {
        TITLE: "Cài đặt",
        DESC: "Trang cài đặt của hệ thống quản lý thư viện.",
    },
};
