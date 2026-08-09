package com.sharemeal.claim.feign;

import com.sharemeal.claim.dto.FoodResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "FOOD-SERVICE")
public interface FoodFeignClient {

    @GetMapping("/foods/{id}")
    FoodResponseDTO getFoodById(
            @PathVariable Long id
    );

    @PutMapping("/foods/claim/{id}")
    FoodResponseDTO claimFood(
            @PathVariable Long id
    );
}