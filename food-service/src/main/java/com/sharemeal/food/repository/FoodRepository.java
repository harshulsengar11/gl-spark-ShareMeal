package com.sharemeal.food.repository;

import com.sharemeal.food.entity.Food;
import com.sharemeal.food.entity.FoodStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FoodRepository
        extends JpaRepository<Food, Long> {

    List<Food> findByStatus(
            FoodStatus status
    );

    List<Food> findByStatusNotInAndExpiryDateBefore(
            List<FoodStatus> statuses,
            LocalDateTime dateTime
    );
}