package com.sharemeal.food.dto;

import lombok.Data;

@Data
public class AuthUserDTO {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String role;
}