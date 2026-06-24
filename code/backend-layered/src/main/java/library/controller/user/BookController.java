package library.controller.user;

import library.common.base.ApiResponse;
import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookListResponse>>> getAllBooks() {
        List<BookListResponse> books = bookService.getAllBooks();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sách thành công", books));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<BookListResponse>>> getTopRatedBooks() {
        List<BookListResponse> books = bookService.getTopRatedBooks();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách top sách thành công", books));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Integer id) {
        BookResponse book = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sách thành công", book));
    }
}
