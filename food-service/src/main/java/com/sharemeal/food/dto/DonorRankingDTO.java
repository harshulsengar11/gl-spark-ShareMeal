package com.sharemeal.food.dto;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class DonorRankingDTO {

    private String donorEmail;

    private String donorName;

    private Integer totalDonations;

    private Integer totalQuantity;
}
