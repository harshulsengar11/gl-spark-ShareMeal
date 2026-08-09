package com.sharemeal.claim.dto;

import com.sharemeal.claim.entity.ClaimStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponseDTO {

    private Long id;

    private Long foodId;

    private String claimerEmail;

    private String claimerRole;

    private String claimerPhone;

    private String donorEmail;

    private String donorPhone;

    private ClaimStatus status;

    private LocalDateTime claimTime;

    private Integer rating;

    private String review;
}