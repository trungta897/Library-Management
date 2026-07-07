package library.service.impl;

import library.dto.admin.AdminBorrowOrderDto;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.service.AdminBorrowService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBorrowServiceImpl implements AdminBorrowService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final library.repository.CustomerRepository customerRepository;
    private final library.repository.BookCopyRepository bookCopyRepository;
    private final library.repository.BorrowExtensionRepository borrowExtensionRepository;
    private final library.repository.PaymentRepository paymentRepository;
    private final library.service.FeeCalculatorService feeCalculatorService;
    private final SystemLogService systemLogService;
    private final library.mapper.AdminBorrowOrderMapper adminBorrowOrderMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AdminBorrowOrderDto> getAllBorrowOrders() {
        List<BorrowOrderEntity> orders = borrowOrderRepository.findAll();
        orders.sort((o1, o2) -> {
            if (o1.getCreatedAt() == null) return 1;
            if (o2.getCreatedAt() == null) return -1;
            return o2.getCreatedAt().compareTo(o1.getCreatedAt());
        });

        return orders.stream().map(adminBorrowOrderMapper::toAdminBorrowOrderDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateBorrowStatus(String orderCode, BorrowOrderStatus newStatus) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Borrow order not found",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        order.setStatus(newStatus);

        if (newStatus == BorrowOrderStatus.BORROWED) {
            order.setBorrowDate(LocalDate.now()); // Confirm pickup
        }

        if (newStatus == BorrowOrderStatus.RETURNED) {
            order.setActualReturnDate(LocalDate.now()); // Confirm return date
            
            // Solidify penalty if overdue
            java.math.BigDecimal overdueFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), LocalDate.now());
            if (overdueFee.compareTo(java.math.BigDecimal.ZERO) > 0) {
                java.math.BigDecimal currentTotalFee = order.getTotalFee() != null ? order.getTotalFee() : (order.getSubtotalFee() != null ? order.getSubtotalFee() : java.math.BigDecimal.ZERO);
                order.setTotalFee(currentTotalFee.add(overdueFee));
            }
        }

        if (newStatus == BorrowOrderStatus.RETURNED || newStatus == BorrowOrderStatus.CANCELLED) {
            List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());
            for (BorrowOrderDetailEntity detail : details) {
                if (detail.getBookCopy() != null) {
                    library.entity.BookCopyEntity copy = detail.getBookCopy();
                    copy.setStatus(library.entity.BookCopyStatus.AVAILABLE);
                    // Saving copy might not be strictly necessary if it's cascade persisted or we
                    // use copyRepository,
                    // but it's managed so hibernate will update it.
                }
                if (newStatus == BorrowOrderStatus.RETURNED) {
                    detail.setStatus(library.entity.BorrowOrderDetailStatus.RETURNED);
                } else if (newStatus == BorrowOrderStatus.CANCELLED) {
                    detail.setStatus(library.entity.BorrowOrderDetailStatus.CANCELLED);
                }
            }
        }

        borrowOrderRepository.save(order);
        systemLogService.logAction("Cập nhật trạng thái đơn mượn", "Admin cập nhật đơn " + orderCode + " thành " + newStatus.name());
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.admin.AdminBorrowOrderDetailDto getBorrowOrderDetail(String orderCode) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Borrow order not found",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        return adminBorrowOrderMapper.toAdminBorrowOrderDetailDto(order);
    }

    @Override
    @Transactional
    public AdminBorrowOrderDto createBorrowOrder(library.dto.admin.AdminCreateBorrowOrderRequest request) {
        library.entity.CustomerEntity customer = customerRepository.findByLibraryCardNoOrPhone(request.getPhone())
                .orElseGet(() -> {
                    if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                        throw new library.common.exception.CustomBusinessException("Phone number is required",
                                org.springframework.http.HttpStatus.BAD_REQUEST);
                    }
                    library.entity.CustomerEntity newCustomer = library.entity.CustomerEntity.builder()
                            .phone(request.getPhone())
                            .fullName(request.getFullName() != null && !request.getFullName().trim().isEmpty()
                                    ? request.getFullName()
                                    : "Khách vãng lai")
                            .email(request.getEmail())
                            .address("Tại quầy")
                            .build();
                    return customerRepository.save(newCustomer);
                });

        if (request.getBookBarcodes() == null || request.getBookBarcodes().isEmpty()) {
            throw new library.common.exception.CustomBusinessException("At least one book barcode is required",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        java.math.BigDecimal totalDeposit = java.math.BigDecimal.ZERO;
        java.util.List<library.entity.BookCopyEntity> copiesToBorrow = new java.util.ArrayList<>();

        for (String barcode : request.getBookBarcodes()) {
            library.entity.BookCopyEntity copy = bookCopyRepository.findByBarcode(barcode)
                    .orElseThrow(() -> new library.common.exception.CustomBusinessException(
                            "Book copy not found: " + barcode, org.springframework.http.HttpStatus.NOT_FOUND));

            if (copy.getStatus() != library.entity.BookCopyStatus.AVAILABLE) {
                throw new library.common.exception.CustomBusinessException(
                        "Book copy is not available: " + barcode + " (Status: " + copy.getStatus() + ")",
                        org.springframework.http.HttpStatus.BAD_REQUEST);
            }

            copiesToBorrow.add(copy);
            if (copy.getBook() != null && copy.getBook().getDepositPrice() != null) {
                totalDeposit = totalDeposit.add(copy.getBook().getDepositPrice());
            }
        }

        String orderCode = "BO-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .borrowDate(LocalDate.now())
                .pickupDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(BorrowOrderStatus.BORROWED)
                .subtotalFee(java.math.BigDecimal.ZERO)
                .discountPercent(java.math.BigDecimal.ZERO)
                .discountAmount(java.math.BigDecimal.ZERO)
                .totalFee(java.math.BigDecimal.ZERO)
                .totalDeposit(totalDeposit)
                .build();

        BorrowOrderEntity savedOrder = borrowOrderRepository.save(borrowOrder);

        String firstBookTitle = "N/A";
        String firstBookAuthor = "N/A";

        for (library.entity.BookCopyEntity copy : copiesToBorrow) {
            copy.setStatus(library.entity.BookCopyStatus.BORROWED);
            bookCopyRepository.save(copy);

            java.math.BigDecimal depositPrice = copy.getBook() != null && copy.getBook().getDepositPrice() != null
                    ? copy.getBook().getDepositPrice()
                    : java.math.BigDecimal.ZERO;

            BorrowOrderDetailEntity detail = BorrowOrderDetailEntity.builder()
                    .borrowOrder(savedOrder)
                    .bookCopy(copy)
                    .rentalFee(java.math.BigDecimal.ZERO)
                    .depositPrice(depositPrice)
                    .status(library.entity.BorrowOrderDetailStatus.BORROWING)
                    .build();
            borrowOrderDetailRepository.save(detail);

            if (firstBookTitle.equals("N/A") && copy.getBook() != null) {
                firstBookTitle = copy.getBook().getTitle();
                if (copy.getBook().getAuthors() != null && !copy.getBook().getAuthors().isEmpty()) {
                    firstBookAuthor = copy.getBook().getAuthors().iterator().next().getName();
                }
            }
        }

        systemLogService.logAction("Tạo đơn mượn", "Admin tạo đơn mượn: " + orderCode + " cho khách: " + customer.getPhone());

        return AdminBorrowOrderDto.builder()
                .id(savedOrder.getOrderCode())
                .customerName(customer.getFullName())
                .customerCode(customer.getLibraryCardNo() != null ? customer.getLibraryCardNo() : customer.getPhone())
                .bookTitle(firstBookTitle
                        + (copiesToBorrow.size() > 1 ? " (và " + (copiesToBorrow.size() - 1) + " sách khác)" : ""))
                .bookAuthor(firstBookAuthor)
                .borrowDate(savedOrder.getBorrowDate())
                .dueDate(savedOrder.getDueDate())
                .status(savedOrder.getStatus())
                .overdayCount(null)
                .build();
    }

    @Override
    @Transactional
    public void processRenewal(String orderCode, library.dto.admin.AdminRenewalRequestDto request) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Borrow order not found",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        // Bỏ check PENDING_RENEWAL ở đây, chỉ cần có BorrowExtensionEntity trạng thái PENDING là đủ để duyệt gia hạn.

        library.entity.BorrowExtensionEntity extension = borrowExtensionRepository
                .findFirstByBorrowOrderIdAndStatusOrderByRequestedAtDesc(order.getId(), library.entity.BorrowExtensionStatus.PENDING)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy yêu cầu gia hạn đang chờ xử lý",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        if (request.isApproved()) {
            extension.setStatus(library.entity.BorrowExtensionStatus.APPROVED);
            
            // Calculate penalty if they were overdue when requested
            LocalDate requestedDate = extension.getRequestedAt().toLocalDate();
            LocalDate oldDueDate = order.getDueDate();
            if (oldDueDate != null && requestedDate.isAfter(oldDueDate)) {
                long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(order.getDueDate(), requestedDate);
                if (overdueDays > 0) {
                    java.math.BigDecimal overdueFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), requestedDate);
                    
                    java.math.BigDecimal currentTotalFee = order.getTotalFee() != null ? order.getTotalFee() : (order.getSubtotalFee() != null ? order.getSubtotalFee() : java.math.BigDecimal.ZERO);
                    order.setTotalFee(currentTotalFee.add(overdueFee));
                }
            }
            
            // Calculate extension fee
            LocalDate baseDate = oldDueDate;
            if (baseDate == null || baseDate.isBefore(requestedDate)) {
                baseDate = requestedDate;
            }
            long extensionDays = java.time.temporal.ChronoUnit.DAYS.between(baseDate, extension.getRequestedDueDate());
            if (extensionDays > 0) {
                // extensionFee corresponds to the rental fee for the extended days
                int numberOfBooks = borrowOrderDetailRepository.findByBorrowOrderId(order.getId()).size();
                java.math.BigDecimal extensionFee = feeCalculatorService.calculateRentalFee(baseDate, extension.getRequestedDueDate(), numberOfBooks);
                java.math.BigDecimal currentSubtotal = order.getSubtotalFee() != null ? order.getSubtotalFee() : java.math.BigDecimal.ZERO;
                java.math.BigDecimal currentTotalFee = order.getTotalFee() != null ? order.getTotalFee() : java.math.BigDecimal.ZERO;
                order.setSubtotalFee(currentSubtotal.add(extensionFee));
                order.setTotalFee(currentTotalFee.add(extensionFee));
            }

            order.setDueDate(extension.getRequestedDueDate());
            order.setStatus(BorrowOrderStatus.BORROWED);
        } else {
            extension.setStatus(library.entity.BorrowExtensionStatus.REJECTED);
            // Revert status
            if (order.getDueDate() != null && order.getDueDate().isBefore(LocalDate.now())) {
                order.setStatus(BorrowOrderStatus.OVERDUE);
            } else {
                order.setStatus(BorrowOrderStatus.BORROWED);
            }
        }

        borrowExtensionRepository.save(extension);
        borrowOrderRepository.save(order);
        systemLogService.logAction("Xử lý gia hạn đơn mượn", "Admin " + (request.isApproved() ? "duyệt" : "từ chối") + " gia hạn đơn " + orderCode);
    }
}
