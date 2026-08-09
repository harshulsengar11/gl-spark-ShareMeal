package com.sharemeal.claim.service;

import com.sharemeal.claim.dto.*;
import com.sharemeal.claim.entity.*;
import com.sharemeal.claim.event.FoodClaimedEvent;
import com.sharemeal.claim.exception.*;
import com.sharemeal.claim.feign.AuthFeignClient;
import com.sharemeal.claim.feign.FoodFeignClient;
import com.sharemeal.claim.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimServiceImpl
        implements ClaimService {

    private static final String FOOD_CLAIMED_TOPIC = "food-claimed-events";

    private final ClaimRepository claimRepository;

    private final AuthFeignClient authFeignClient;

    private final FoodFeignClient foodFeignClient;

    private final KafkaTemplate<String, FoodClaimedEvent> kafkaTemplate;

    @Override
    public ClaimResponseDTO claimFood(
            ClaimRequestDTO requestDTO) {

        AuthUserDTO user =
                authFeignClient.getUserByEmail(
                        requestDTO.getClaimerEmail()
                );

        if (!"NGO".equals(user.getRole())) {

            throw new RuntimeException(
                    "Only NGO can claim food"
            );
        }

        FoodResponseDTO food =
                foodFeignClient.getFoodById(
                        requestDTO.getFoodId()
                );

        if (claimRepository.existsByFoodId(
                requestDTO.getFoodId())) {

            throw new FoodAlreadyClaimedException(
                    "Food already claimed"
            );
        }

        // Snapshot the donor's contact details at claim time so the NGO
        // can reach out, without needing a live call back to auth-service
        // every time the claim is displayed.
        AuthUserDTO donor =
                authFeignClient.getUserByEmail(
                        food.getDonorEmail()
                );

        Claim claim = Claim.builder()
                .foodId(requestDTO.getFoodId())
                .claimerEmail(
                        requestDTO.getClaimerEmail()
                )
                .claimerRole(user.getRole())
                .claimerPhone(user.getPhoneNumber())
                .donorEmail(food.getDonorEmail())
                .donorPhone(donor.getPhoneNumber())
                .status(ClaimStatus.APPROVED)
                .claimTime(LocalDateTime.now())
                .build();

        Claim savedClaim =
                claimRepository.save(claim);

        // Update food status
        foodFeignClient.claimFood(
                requestDTO.getFoodId()
        );

        // Publish a single event to Kafka instead of calling
        // notification-service synchronously twice (once for the NGO,
        // once for the donor). notification-service's listener creates
        // both notifications asynchronously off this one message.
        kafkaTemplate.send(
                FOOD_CLAIMED_TOPIC,
                String.valueOf(savedClaim.getId()),
                FoodClaimedEvent.builder()
                        .claimId(savedClaim.getId())
                        .foodId(food.getId())
                        .foodName(food.getFoodName())
                        .quantity(food.getQuantity())
                        .donorEmail(food.getDonorEmail())
                        .claimerEmail(requestDTO.getClaimerEmail())
                        .claimTime(savedClaim.getClaimTime())
                        .build()
        );

        return mapToResponse(savedClaim);
    }

    @Override
    public ClaimResponseDTO rateClaim(
            Long claimId,
            RatingRequestDTO requestDTO) {

        Claim claim =
                claimRepository.findById(claimId)
                        .orElseThrow(() ->
                                new ClaimNotFoundException(
                                        "Claim not found with id : " + claimId
                                ));

        if (!claim.getClaimerEmail()
                .equalsIgnoreCase(requestDTO.getNgoEmail())) {

            throw new InvalidRatingException(
                    "Only the NGO that claimed this food can rate it"
            );
        }

        if (claim.getRating() != null) {

            throw new InvalidRatingException(
                    "This claim has already been rated"
            );
        }

        claim.setRating(requestDTO.getRating());
        claim.setReview(requestDTO.getReview());

        Claim savedClaim =
                claimRepository.save(claim);

        return mapToResponse(savedClaim);
    }

    @Override
    public ClaimResponseDTO getClaimByFoodId(
            Long foodId) {

        Claim claim =
                claimRepository.findByFoodId(foodId)
                        .orElseThrow(() ->
                                new ClaimNotFoundException(
                                        "No claim found for food id : " + foodId
                                ));

        return mapToResponse(claim);
    }

    @Override
    public ClaimResponseDTO getClaimById(
            Long id) {

        Claim claim =
                claimRepository.findById(id)
                        .orElseThrow(() ->
                                new ClaimNotFoundException(
                                        "Claim not found with id : " + id
                                ));

        return mapToResponse(claim);
    }

    @Override
    public List<ClaimResponseDTO> getAllClaims() {

        return claimRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DonorRatingResponseDTO getDonorRating(
            String donorEmail) {

        List<Claim> ratedClaims =
                claimRepository
                        .findByDonorEmailAndRatingIsNotNull(
                                donorEmail
                        );

        int totalRatings = ratedClaims.size();

        double averageRating = totalRatings == 0
                ? 0.0
                : ratedClaims.stream()
                        .mapToInt(Claim::getRating)
                        .average()
                        .orElse(0.0);

        return DonorRatingResponseDTO.builder()
                .donorEmail(donorEmail)
                .averageRating(
                        Math.round(averageRating * 10.0) / 10.0
                )
                .totalRatings(totalRatings)
                .build();
    }

    private ClaimResponseDTO mapToResponse(
            Claim claim) {

        return ClaimResponseDTO.builder()
                .id(claim.getId())
                .foodId(claim.getFoodId())
                .claimerEmail(
                        claim.getClaimerEmail()
                )
                .claimerRole(
                        claim.getClaimerRole()
                )
                .claimerPhone(
                        claim.getClaimerPhone()
                )
                .donorEmail(
                        claim.getDonorEmail()
                )
                .donorPhone(
                        claim.getDonorPhone()
                )
                .status(claim.getStatus())
                .claimTime(claim.getClaimTime())
                .rating(claim.getRating())
                .review(claim.getReview())
                .build();
    }
}