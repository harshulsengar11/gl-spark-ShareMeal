package com.sharemeal.claim.repository;

import com.sharemeal.claim.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClaimRepository
        extends JpaRepository<Claim, Long> {

    boolean existsByFoodId(Long foodId);

    Optional<Claim> findByFoodId(Long foodId);

    java.util.List<Claim> findByDonorEmailAndRatingIsNotNull(String donorEmail);
}