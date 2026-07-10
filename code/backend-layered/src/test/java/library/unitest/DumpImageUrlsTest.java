package library.unitest;

import library.entity.BookEntity;
import library.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;

@SpringBootTest
public class DumpImageUrlsTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    public void dumpUrls() {
        List<BookEntity> books = bookRepository.findAll();
        System.out.println("=== IMAGE URLS ===");
        for (int i = 0; i < Math.min(20, books.size()); i++) {
            System.out.println(books.get(i).getTitle() + " -> " + books.get(i).getImageUrl());
        }
        System.out.println("==================");
    }
}
