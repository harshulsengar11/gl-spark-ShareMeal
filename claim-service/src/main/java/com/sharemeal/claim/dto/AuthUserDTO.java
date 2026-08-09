package com.sharemeal.claim.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthUserDTO {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String role;
}