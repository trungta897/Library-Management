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

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookServiceImpl implements BookService {

        private final BookRepository bookRepository;
        private final library.repository.CategoryRepository categoryRepository;
        private final library.repository.AuthorRepository authorRepository;

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

        @Override
        public org.springframework.data.domain.Page<BookListResponse> getAdminBookInventory(
                String keyword,
                Integer categoryId,
                int page,
                int size) {
                // Chuẩn hóa: keyword rỗng → null để query skip LIKE condition
                String normalizedKeyword = (keyword != null && keyword.trim().isEmpty()) ? null : keyword;
                org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
                return bookRepository.findForAdminInventory(normalizedKeyword, categoryId, pageable)
                        .map(this::toBookListResponse);
        }

        @Override
        @Transactional
        public BookResponse createBook(library.dto.request.BookCreateRequest request) {
                BookEntity book = BookEntity.builder()
                                .title(request.getTitle())
                                .isbn(request.getIsbn() != null && request.getIsbn().trim().isEmpty() ? null : request.getIsbn())
                                .publisher(request.getPublisher())
                                .publicationDate(request.getPublicationDate())
                                .pages(request.getPages())
                                .description(request.getDescription())
                                .imageUrl(request.getImageUrl())
                                .shelfLocation(request.getShelfLocation())
                                .depositPrice(request.getDepositPrice())
                                .quantity(0)
                                .availableQuantity(0)
                                .rating(0.0)
                                .reviewCount(0)
                                .build();

                java.util.Set<library.entity.AuthorEntity> authors = new java.util.HashSet<>();
                if (request.getAuthorIds() != null && !request.getAuthorIds().isEmpty()) {
                        authors.addAll(authorRepository.findAllById(request.getAuthorIds()));
                }
                if (request.getNewAuthors() != null && !request.getNewAuthors().isEmpty()) {
                        for (String authorName : request.getNewAuthors()) {
                                java.util.Optional<library.entity.AuthorEntity> existing = authorRepository.findByName(authorName);
                                if (existing.isPresent()) {
                                        authors.add(existing.get());
                                } else {
                                        library.entity.AuthorEntity newAuthor = library.entity.AuthorEntity.builder().name(authorName).build();
                                        authors.add(authorRepository.save(newAuthor));
                                }
                        }
                }
                book.setAuthors(authors);

                java.util.Set<library.entity.CategoryEntity> categories = new java.util.HashSet<>();
                if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
                        categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
                }
                if (request.getNewCategories() != null && !request.getNewCategories().isEmpty()) {
                        for (String categoryName : request.getNewCategories()) {
                                java.util.Optional<library.entity.CategoryEntity> existing = categoryRepository.findByName(categoryName);
                                if (existing.isPresent()) {
                                        categories.add(existing.get());
                                } else {
                                        library.entity.CategoryEntity newCategory = library.entity.CategoryEntity.builder().name(categoryName).build();
                                        categories.add(categoryRepository.save(newCategory));
                                }
                        }
                }
                book.setCategories(categories);

                BookEntity savedBook = bookRepository.save(book);
                return toBookResponse(savedBook);
        }

        @Override
        @Transactional
        public BookResponse updateBook(Integer id, library.dto.request.BookUpdateRequest request) {
                BookEntity book = bookRepository.findById(id)
                                .orElseThrow(() -> new CustomBusinessException(
                                                "Không tìm thấy sách với ID: " + id,
                                                HttpStatus.NOT_FOUND));

                if (request.getTitle() != null) book.setTitle(request.getTitle());
                if (request.getAuthorIds() != null || request.getNewAuthors() != null) {
                        java.util.Set<library.entity.AuthorEntity> authors = new java.util.HashSet<>();
                        if (request.getAuthorIds() != null) {
                                authors.addAll(authorRepository.findAllById(request.getAuthorIds()));
                        }
                        if (request.getNewAuthors() != null) {
                                for (String authorName : request.getNewAuthors()) {
                                        java.util.Optional<library.entity.AuthorEntity> existing = authorRepository.findByName(authorName);
                                        if (existing.isPresent()) {
                                                authors.add(existing.get());
                                        } else {
                                                library.entity.AuthorEntity newAuthor = library.entity.AuthorEntity.builder().name(authorName).build();
                                                authors.add(authorRepository.save(newAuthor));
                                        }
                                }
                        }
                        book.setAuthors(authors);
                }
                if (request.getIsbn() != null) {
                        book.setIsbn(request.getIsbn().trim().isEmpty() ? null : request.getIsbn());
                }
                if (request.getCategoryIds() != null || request.getNewCategories() != null) {
                        java.util.Set<library.entity.CategoryEntity> categories = new java.util.HashSet<>();
                        if (request.getCategoryIds() != null) {
                                categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
                        }
                        if (request.getNewCategories() != null) {
                                for (String categoryName : request.getNewCategories()) {
                                        java.util.Optional<library.entity.CategoryEntity> existing = categoryRepository.findByName(categoryName);
                                        if (existing.isPresent()) {
                                                categories.add(existing.get());
                                        } else {
                                                library.entity.CategoryEntity newCategory = library.entity.CategoryEntity.builder().name(categoryName).build();
                                                categories.add(categoryRepository.save(newCategory));
                                        }
                                }
                        }
                        book.setCategories(categories);
                }
                if (request.getShelfLocation() != null) book.setShelfLocation(request.getShelfLocation());
                if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());


                bookRepository.save(book);
                return toBookResponse(book);
        }

        private BookListResponse toBookListResponse(BookEntity entity) {
                return BookListResponse.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .authors(mapAuthors(entity.getAuthors()))
                                .categories(mapCategories(entity.getCategories()))
                                .imageUrl(entity.getImageUrl())
                                .rating(entity.getRating())
                                .availableQuantity(entity.getAvailableQuantity())
                                .quantity(entity.getQuantity())
                                .isbn(entity.getIsbn())
                                .shelfLocation(entity.getShelfLocation())
                                .build();
        }

        private BookResponse toBookResponse(BookEntity entity) {


                return BookResponse.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .authors(mapAuthors(entity.getAuthors()))
                                .publisher(entity.getPublisher())
                                .publicationDate(entity.getPublicationDate())
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
                                .categories(mapCategories(entity.getCategories()))
                                .build();
        }

        private List<library.dto.response.CategoryResponse> mapCategories(java.util.Set<library.entity.CategoryEntity> categories) {
                if (categories == null) return Collections.emptyList();
                return categories.stream()
                        .map(c -> library.dto.response.CategoryResponse.builder()
                                .id(c.getId())
                                .name(c.getName())
                                .description(c.getDescription())
                                .build())
                        .collect(Collectors.toList());
        }

        private List<library.dto.response.AuthorResponse> mapAuthors(java.util.Set<library.entity.AuthorEntity> authors) {
                if (authors == null) return Collections.emptyList();
                return authors.stream()
                        .map(a -> library.dto.response.AuthorResponse.builder()
                                .id(a.getId())
                                .name(a.getName())
                                .biography(a.getBiography())
                                .build())
                        .collect(Collectors.toList());
        }
}
