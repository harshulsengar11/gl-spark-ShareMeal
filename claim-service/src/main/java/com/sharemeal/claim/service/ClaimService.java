package com.sharemeal.claim.service;

import com.sharemeal.claim.dto.ClaimRequestDTO;
import com.sharemeal.claim.dto.ClaimResponseDTO;
import com.sharemeal.claim.dto.DonorRatingResponseDTO;
import com.sharemeal.claim.dto.RatingRequestDTO;

import java.util.List;

public interface ClaimService {

    ClaimResponseDTO claimFood(
            ClaimRequestDTO requestDTO
    );

    ClaimResponseDTO getClaimById(
            Long id
    );

    List<ClaimResponseDTO> getAllClaims();

    ClaimResponseDTO rateClaim(
            Long claimId,
            RatingRequestDTO requestDTO
    );

    ClaimResponseDTO getClaimByFoodId(
            Long foodId
    );

    DonorRatingResponseDTO getDonorRating(
            String donorEmail
    );
}