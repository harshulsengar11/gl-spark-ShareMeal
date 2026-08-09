package com.sharemeal.claim.controller;

import com.sharemeal.claim.dto.ClaimRequestDTO;
import com.sharemeal.claim.dto.ClaimResponseDTO;
import com.sharemeal.claim.dto.RatingRequestDTO;
import com.sharemeal.claim.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ClaimResponseDTO>
    claimFood(
            @Valid
            @RequestBody ClaimRequestDTO requestDTO) {

        return new ResponseEntity<>(
                claimService.claimFood(requestDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<ClaimResponseDTO>>
    getAllClaims() {

        return ResponseEntity.ok(
                claimService.getAllClaims()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDTO>
    getClaimById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.getClaimById(id)
        );
    }

    @GetMapping("/food/{foodId}")
    public ResponseEntity<ClaimResponseDTO>
    getClaimByFoodId(
            @PathVariable Long foodId) {

        return ResponseEntity.ok(
                claimService.getClaimByFoodId(foodId)
        );
    }

    // Lets an NGO see a donor's average rating/review count before
    // deciding whether to claim their food.
    @GetMapping("/donor-rating/{email}")
    public ResponseEntity<com.sharemeal.claim.dto.DonorRatingResponseDTO>
    getDonorRating(
            @PathVariable String email) {

        return ResponseEntity.ok(
                claimService.getDonorRating(email)
        );
    }

    @PutMapping("/{id}/rate")
    public ResponseEntity<ClaimResponseDTO>
    rateClaim(
            @PathVariable Long id,
            @Valid
            @RequestBody RatingRequestDTO requestDTO) {

        return ResponseEntity.ok(
                claimService.rateClaim(id, requestDTO)
        );
    }
}