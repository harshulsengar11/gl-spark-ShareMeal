package com.sharemeal.auth.dto;

import com.sharemeal.auth.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Role role;

    private LocalDateTime createdAt;
}