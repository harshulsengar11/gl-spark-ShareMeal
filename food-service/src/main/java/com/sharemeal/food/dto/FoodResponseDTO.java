package com.sharemeal.food.dto;

import com.sharemeal.food.entity.FoodStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FoodResponseDTO {

    private Long id;

    private String foodName;

    private Integer quantity;

    private String description;

    private Double originalPrice;

    private Double discountedPrice;

    private String donorEmail;

    private String donorPhone;

    private String city;

    private String donorAddress;

    private String imageUrl;

    private FoodStatus status;

    private LocalDateTime expiryDate;
}