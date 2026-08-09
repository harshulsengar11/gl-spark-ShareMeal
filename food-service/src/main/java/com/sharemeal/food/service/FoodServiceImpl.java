package com.sharemeal.food.service;

import com.sharemeal.food.dto.DonorRankingDTO;
import com.sharemeal.food.dto.FoodRequestDTO;
import com.sharemeal.food.dto.FoodResponseDTO;
import com.sharemeal.food.entity.Food;
import com.sharemeal.food.entity.FoodStatus;
import com.sharemeal.food.exception.FoodNotFoundException;
import com.sharemeal.food.feign.AuthFeignClient;
import com.sharemeal.food.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.sharemeal.food.dto.AuthUserDTO;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;

    private final AuthFeignClient authFeignClient;

    @Override
    public FoodResponseDTO addFood(
            FoodRequestDTO requestDTO,
            String donorEmail) {

        AuthUserDTO user =
                authFeignClient.getUserByEmail(
                        donorEmail
                );

        if (!"DONOR".equals(user.getRole())) {

            throw new RuntimeException(
                    "Only DONOR can add food"
            );
        }

        if (requestDTO.getDiscountedPrice() >
                requestDTO.getOriginalPrice()) {

            throw new IllegalArgumentException(
                    "Discounted price cannot be greater than original price"
            );
        }

        Food food = Food.builder()
                .foodName(requestDTO.getFoodName())
                .quantity(requestDTO.getQuantity())
                .description(requestDTO.getDescription())
                .originalPrice(requestDTO.getOriginalPrice())
                .discountedPrice(requestDTO.getDiscountedPrice())
                .donorEmail(donorEmail)
                .donorPhone(user.getPhoneNumber())
                .city(requestDTO.getCity())
                .donorAddress(requestDTO.getDonorAddress())
                .imageUrl(requestDTO.getImageUrl())
                .status(FoodStatus.AVAILABLE_FOR_NGO)
                .createdAt(LocalDateTime.now())
                .ngoReservedTill(
                        LocalDateTime.now().plusHours(2)
                )
                .expiryDate(requestDTO.getExpiryDate())
                .build();

        Food savedFood =
                foodRepository.save(food);

        return mapToResponse(savedFood);
    }

    @Override
    public List<FoodResponseDTO> getAllFoods() {

        return foodRepository.findAll()
                .stream()
                .map(this::expireIfNeeded)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public FoodResponseDTO getFoodById(Long id) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new FoodNotFoundException(
                                "Food not found with id : " + id
                        ));

        return mapToResponse(expireIfNeeded(food));
    }

    private Food expireIfNeeded(Food food) {

        if (food.getExpiryDate() != null
                && food.getStatus() != FoodStatus.SOLD
                && food.getStatus() != FoodStatus.EXPIRED
                && LocalDateTime.now().isAfter(food.getExpiryDate())) {

            food.setStatus(FoodStatus.EXPIRED);
            return foodRepository.save(food);
        }

        return food;
    }

    @Scheduled(fixedRate = 60000)
    public void markExpiredFoods() {

        List<Food> expiredFoods =
                foodRepository.findByStatusNotInAndExpiryDateBefore(
                        List.of(FoodStatus.SOLD, FoodStatus.EXPIRED),
                        LocalDateTime.now()
                );

        expiredFoods.forEach(food ->
                food.setStatus(FoodStatus.EXPIRED)
        );

        foodRepository.saveAll(expiredFoods);
    }

    private FoodResponseDTO mapToResponse(
            Food food) {

        return FoodResponseDTO.builder()
                .id(food.getId())
                .foodName(food.getFoodName())
                .quantity(food.getQuantity())
                .description(food.getDescription())
                .originalPrice(food.getOriginalPrice())
                .discountedPrice(food.getDiscountedPrice())
                .donorEmail(food.getDonorEmail())
                .donorPhone(food.getDonorPhone())
                .city(food.getCity())
                .donorAddress(food.getDonorAddress())
                .imageUrl(food.getImageUrl())
                .status(food.getStatus())
                .expiryDate(food.getExpiryDate())
                .build();
    }

    @Override
    public FoodResponseDTO updateFood(
            Long id,
            FoodRequestDTO requestDTO) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new FoodNotFoundException(
                                "Food not found with id : " + id
                        ));

        if (requestDTO.getDiscountedPrice() >
                requestDTO.getOriginalPrice()) {

            throw new IllegalArgumentException(
                    "Discounted price cannot be greater than original price"
            );
        }

        food.setFoodName(
                requestDTO.getFoodName()
        );

        food.setQuantity(
                requestDTO.getQuantity()
        );

        food.setDescription(
                requestDTO.getDescription()
        );

        food.setOriginalPrice(
                requestDTO.getOriginalPrice()
        );

        food.setDiscountedPrice(
                requestDTO.getDiscountedPrice()
        );

        food.setExpiryDate(
                requestDTO.getExpiryDate()
        );

        if (requestDTO.getCity() != null) {
            food.setCity(requestDTO.getCity());
        }

        if (requestDTO.getDonorAddress() != null) {
            food.setDonorAddress(requestDTO.getDonorAddress());
        }

        if (requestDTO.getImageUrl() != null) {
            food.setImageUrl(requestDTO.getImageUrl());
        }

        Food updatedFood =
                foodRepository.save(food);

        return mapToResponse(updatedFood);
    }

    @Override
    public void deleteFood(Long id) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new FoodNotFoundException(
                                "Food not found with id : " + id
                        ));

        foodRepository.delete(food);
    }

    @Override
    public FoodResponseDTO claimFood(
            Long foodId) {

        Food food =
                foodRepository.findById(foodId)
                        .orElseThrow(() ->
                                new FoodNotFoundException(
                                        "Food not found"
                                ));

        food = expireIfNeeded(food);

        if (food.getStatus() !=
                FoodStatus.AVAILABLE_FOR_NGO) {

            throw new IllegalArgumentException(
                    food.getStatus() == FoodStatus.EXPIRED
                            ? "Food has expired and can no longer be claimed"
                            : "Food is not available for NGO claim"
            );
        }

        food.setStatus(
                FoodStatus.CLAIMED_BY_NGO
        );

        Food savedFood =
                foodRepository.save(food);

        return mapToResponse(savedFood);
    }

    @Override
    public FoodResponseDTO purchaseFood(
            Long foodId) {

        Food food =
                foodRepository.findById(foodId)
                        .orElseThrow(() ->
                                new FoodNotFoundException(
                                        "Food not found"
                                ));

        if (food.getStatus() ==
                FoodStatus.SOLD) {

            throw new IllegalArgumentException(
                    "Food is already sold"
            );
        }

        food.setStatus(
                FoodStatus.SOLD
        );

        Food savedFood =
                foodRepository.save(food);

        return mapToResponse(savedFood);
    }

    @Override
    public List<DonorRankingDTO> getDonorRanking() {

        // "Donated" = food that actually reached someone (claimed by an
        // NGO or sold) — same definition the donor dashboard stats use —
        // rather than just everything a donor has ever listed.
        List<Food> fulfilledFoods =
                foodRepository.findAll()
                        .stream()
                        .filter(food ->
                                food.getStatus() == FoodStatus.CLAIMED_BY_NGO
                                        || food.getStatus() == FoodStatus.SOLD
                        )
                        .toList();

        Map<String, Integer> quantityByDonor = new LinkedHashMap<>();
        Map<String, Integer> countByDonor = new LinkedHashMap<>();

        for (Food food : fulfilledFoods) {
            quantityByDonor.merge(
                    food.getDonorEmail(), food.getQuantity(), Integer::sum
            );
            countByDonor.merge(
                    food.getDonorEmail(), 1, Integer::sum
            );
        }

        return quantityByDonor.entrySet()
                .stream()
                .sorted(
                        Map.Entry.<String, Integer>comparingByValue()
                                .reversed()
                )
                .limit(10)
                .map(entry -> {
                    String donorEmail = entry.getKey();
                    String donorName = donorEmail;

                    try {
                        AuthUserDTO donor =
                                authFeignClient.getUserByEmail(donorEmail);
                        if (donor != null && donor.getFullName() != null) {
                            donorName = donor.getFullName();
                        }
                    } catch (Exception ignored) {
                        // Fall back to showing the email if auth-service
                        // can't be reached or the user was removed.
                    }

                    return DonorRankingDTO.builder()
                            .donorEmail(donorEmail)
                            .donorName(donorName)
                            .totalDonations(countByDonor.get(donorEmail))
                            .totalQuantity(entry.getValue())
                            .build();
                })
                .sorted(
                        Comparator.comparing(
                                DonorRankingDTO::getTotalQuantity
                        ).reversed()
                )
                .toList();
    }
}