package com.sharemeal.claim.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorRatingResponseDTO {

    private String donorEmail;

    private Double averageRating;

    private Integer totalRatings;
}
