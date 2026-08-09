package com.sharemeal.food.service;

import com.sharemeal.food.dto.DonorRankingDTO;
import com.sharemeal.food.dto.FoodRequestDTO;
import com.sharemeal.food.dto.FoodResponseDTO;

import java.util.List;

public interface FoodService {

    FoodResponseDTO addFood(
            FoodRequestDTO requestDTO,
            String donorEmail
    );

    List<FoodResponseDTO> getAllFoods();

    FoodResponseDTO getFoodById(Long id);

    FoodResponseDTO updateFood(Long id, FoodRequestDTO requestDTO);

    void deleteFood(Long id);

    FoodResponseDTO claimFood(Long foodId);

    FoodResponseDTO purchaseFood(Long foodId);

    List<DonorRankingDTO> getDonorRanking();
}