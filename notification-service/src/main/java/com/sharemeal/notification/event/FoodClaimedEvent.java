package com.sharemeal.notification.event;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Mirrors com.sharemeal.claim.event.FoodClaimedEvent in claim-service.
 * Field names/types must stay in sync on both sides since JSON is
 * deserialized by field name — there's no shared library between
 * services in this project.
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
