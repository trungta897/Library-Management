package library.service;

import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;

import java.util.List;

public interface BookService {

    List<BookListResponse> getAllBooks();

    List<BookListResponse> getTopRatedBooks();

    BookResponse getBookById(Integer id);
}
