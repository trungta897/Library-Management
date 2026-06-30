package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String token;
    private String refreshToken;
    private LocalDateTime createdAt;
}
