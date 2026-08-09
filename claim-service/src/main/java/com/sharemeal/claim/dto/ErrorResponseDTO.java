package com.sharemeal.claim.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponseDTO {

    private String message;

    private Integer status;

    private LocalDateTime timestamp;
}