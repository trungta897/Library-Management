package library.config;

import library.entity.BookEntity;
import library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BucketUrlFixer implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking and fixing broken image URLs...");
        List<BookEntity> books = bookRepository.findAll();
        int count = 0;
        for (BookEntity book : books) {
            String url = book.getImageUrl();
            if (url != null && !url.trim().isEmpty()) {
                boolean changed = false;
                
                // If it is just an ID (e.g. not starting with http), prepend the correct bucket URL
                if (!url.startsWith("http")) {
                    url = "https://storage.googleapis.com/lms2-bucket/" + url;
                    changed = true;
                }
                
                // If it contains the wrong bucket name from the previous script
                if (url.contains("storage.googleapis.com/lms2/") || url.contains("storage.google.apis.comlms2/")) {
                    url = url.replace("storage.googleapis.com/lms2/", "storage.googleapis.com/lms2-bucket/")
                             .replace("storage.google.apis.comlms2/", "storage.googleapis.com/lms2-bucket/");
                    changed = true;
                }

                if (changed) {
                    book.setImageUrl(url);
                    bookRepository.save(book);
                    count++;
                }
            }
        }
        if (count > 0) {
            log.info("Fixed {} book image URLs to correctly use lms2-bucket.", count);
        }
    }
}
