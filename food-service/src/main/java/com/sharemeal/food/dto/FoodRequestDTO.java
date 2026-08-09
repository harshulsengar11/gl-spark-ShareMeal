package com.sharemeal.food.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRequestDTO {

    @NotBlank(message = "Food name cannot be empty")
    private String foodName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Original price is required")
    @Positive(message = "Original price must be greater than 0")
    private Double originalPrice;

    @NotNull(message = "Discounted price is required")
    @PositiveOrZero(message = "Discounted price cannot be negative")
    private Double discountedPrice;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    @NotBlank(message = "City cannot be empty")
    private String city;

    @NotBlank(message = "Address cannot be empty")
    private String donorAddress;

    private String imageUrl;
}