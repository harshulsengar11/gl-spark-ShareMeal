package com.sharemeal.claim.event;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Published to the "food-claimed-events" Kafka topic every time an NGO
 * successfully claims a food listing. notification-service consumes this
 * to create the donor + NGO notifications asynchronously, decoupling
 * claim-service from notification-service (previously a synchronous
 * Feign call to notification-service on the request thread).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodClaimedEvent {

    private Long claimId;

    private Long foodId;

    private String foodName;

    private Integer quantity;

    private String donorEmail;

    private String claimerEmail;

    private LocalDateTime claimTime;
}
