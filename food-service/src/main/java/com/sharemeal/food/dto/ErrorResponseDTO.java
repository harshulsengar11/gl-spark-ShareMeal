package com.sharemeal.food.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponseDTO {

    private String message;

    private Integer status;

    private LocalDateTime timestamp;
}