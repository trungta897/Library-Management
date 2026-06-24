package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

        private final BookRepository bookRepository;

        @Override
        public List<BookListResponse> getAllBooks() {
                return bookRepository.findAll().stream()
                                .map(this::toBookListResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<BookListResponse> getTopRatedBooks() {
                return bookRepository.findTop10ByOrderByRatingDesc().stream()
                                .map(this::toBookListResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public BookResponse getBookById(Integer id) {
                BookEntity book = bookRepository.findById(id)
                                .orElseThrow(() -> new CustomBusinessException(
                                                "Không tìm thấy sách với ID: " + id,
                                                HttpStatus.NOT_FOUND));
                return toBookResponse(book);
        }

        private BookListResponse toBookListResponse(BookEntity entity) {
                return BookListResponse.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .author(entity.getAuthor())
                                .category(entity.getCategory())
                                .imageUrl(entity.getImageUrl())
                                .rating(entity.getRating())
                                .availableQuantity(entity.getAvailableQuantity())
                                .build();
        }

        private BookResponse toBookResponse(BookEntity entity) {
                // Tách category string thành danh sách (phân cách bằng dấu phẩy)
                List<String> categories = Collections.emptyList();
                if (entity.getCategory() != null && !entity.getCategory().isBlank()) {
                        categories = Arrays.stream(entity.getCategory().split(","))
                                        .map(String::trim)
                                        .filter(s -> !s.isEmpty())
                                        .collect(Collectors.toList());
                }

                return BookResponse.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .author(entity.getAuthor())
                                .publisher(entity.getPublisher())
                                .publishYear(entity.getPublishYear())
                                .pages(entity.getPages())
                                .isbn(entity.getIsbn())
                                .description(entity.getDescription())
                                .imageUrl(entity.getImageUrl())
                                .rating(entity.getRating())
                                .reviewCount(entity.getReviewCount())
                                .availableQuantity(entity.getAvailableQuantity())
                                .quantity(entity.getQuantity())
                                .shelfLocation(entity.getShelfLocation())
                                .depositPrice(entity.getDepositPrice())
                                .categories(categories)
                                .build();
        }
}
