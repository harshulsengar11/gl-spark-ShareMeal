package com.sharemeal.auth.dto;

import com.sharemeal.auth.entity.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RegisterRequestDTO {

    @NotBlank(message = "Full name is required")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Full name can contain only alphabets and spaces"
    )
    @Size(min = 3, max = 100,
            message = "Full name must be between 3 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,20}$",
            message = "Password must be 8-20 characters and contain at least 1 digit and 1 special character"
    )
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Enter a valid 10-digit phone number"
    )
    private String phoneNumber;

    @NotNull(message = "Role is required")
    private Role role;

    @Data
    @Builder
    @AllArgsConstructor
    public static class ErrorResponseDTO {

        private String message;

        private int status;

        private LocalDateTime timestamp;

    }
}