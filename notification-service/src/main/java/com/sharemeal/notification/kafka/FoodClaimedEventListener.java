package com.sharemeal.notification.kafka;

import com.sharemeal.notification.dto.NotificationRequestDTO;
import com.sharemeal.notification.event.FoodClaimedEvent;
import com.sharemeal.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

/**
 * Consumes "food-claimed-events" published by claim-service and turns
 * each one into two notifications: a confirmation for the NGO that
 * claimed the food, and an alert for the donor whose food was claimed
 * (including how much was claimed and when).
 *
 * This replaces what used to be two synchronous Feign calls made by
 * claim-service directly to this service's REST API — claim-service now
 * only has to publish one Kafka message and move on, and this listener
 * does the notification fan-out asynchronously.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class FoodClaimedEventListener {

    private static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "food-claimed-events",
            groupId = "notification-service"
    )
    public void onFoodClaimed(FoodClaimedEvent event) {

        log.info(
                "Received food-claimed event for claimId={}, foodId={}",
                event.getClaimId(), event.getFoodId()
        );

        String claimedTime =
                event.getClaimTime() != null
                        ? event.getClaimTime().format(TIME_FORMAT)
                        : "just now";

        // Confirmation notification for the NGO/user who claimed the food.
        notificationService.createNotification(
                NotificationRequestDTO.builder()
                        .recipientEmail(event.getClaimerEmail())
                        .title("Food Claimed Successfully")
                        .message(
                                "You claimed '" + event.getFoodName() +
                                        "' (qty: " + event.getQuantity() +
                                        ") at " + claimedTime + "."
                        )
                        .build()
        );

        // Alert notification for the donor whose food was claimed.
        notificationService.createNotification(
                NotificationRequestDTO.builder()
                        .recipientEmail(event.getDonorEmail())
                        .title("Your food has been claimed!")
                        .message(
                                "'" + event.getFoodName() + "' (qty: " +
                                        event.getQuantity() + ") was claimed by " +
                                        event.getClaimerEmail() + " at " +
                                        claimedTime + "."
                        )
                        .build()
        );
    }
}
