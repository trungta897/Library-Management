package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookListResponse {

    private Integer id;
    private String title;
    private String author;
    private String category;
    private String imageUrl;
    private Double rating;
    private int availableQuantity;
}
