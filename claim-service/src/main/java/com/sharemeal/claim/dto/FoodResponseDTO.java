package com.sharemeal.claim.dto;

import com.sharemeal.claim.entity.FoodStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    private FoodStatus status;

    private LocalDateTime expiryDate;
}