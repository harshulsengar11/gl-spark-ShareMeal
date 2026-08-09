package com.sharemeal.food.controller;

import com.sharemeal.food.dto.DonorRankingDTO;
import com.sharemeal.food.dto.FoodRequestDTO;
import com.sharemeal.food.dto.FoodResponseDTO;
import com.sharemeal.food.security.JwtUtil;
import com.sharemeal.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<FoodResponseDTO> addFood(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody FoodRequestDTO requestDTO) {

        // Donor email comes from the logged-in user's JWT, not the request
        // body — a donor can never list food on someone else's behalf.
        String donorEmail =
                jwtUtil.extractEmail(authorizationHeader);

        return new ResponseEntity<>(

                foodService.addFood(
                        requestDTO,
                        donorEmail
                ),

                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<FoodResponseDTO>>
    getAllFoods() {

        return ResponseEntity.ok(
                foodService.getAllFoods()
        );
    }

    // Top 10 donors leaderboard, shown on the ranking page for both
    // donors and NGOs. Must be declared before "/{id}" so it isn't
    // swallowed by the path-variable route (different segment count
    // avoids the clash, but keeping it near the top for readability).
    @GetMapping("/ranking/donors")
    public ResponseEntity<List<DonorRankingDTO>>
    getDonorRanking() {

        return ResponseEntity.ok(
                foodService.getDonorRanking()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponseDTO>
    getFoodById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                foodService.getFoodById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodResponseDTO>
    updateFood(
            @PathVariable Long id,
            @Valid @RequestBody
            FoodRequestDTO requestDTO) {

        return ResponseEntity.ok(
                foodService.updateFood(
                        id,
                        requestDTO
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteFood(
            @PathVariable Long id) {

        foodService.deleteFood(id);

        return ResponseEntity.ok(
                "Food deleted successfully"
        );
    }

    @PutMapping("/claim/{id}")
    public ResponseEntity<FoodResponseDTO>
    claimFood(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                foodService.claimFood(id)
        );
    }

    @PutMapping("/purchase/{id}")
    public ResponseEntity<FoodResponseDTO>
    purchaseFood(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                foodService.purchaseFood(id)
        );
    }
}