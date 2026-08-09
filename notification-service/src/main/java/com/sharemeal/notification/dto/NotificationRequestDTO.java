package com.sharemeal.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequestDTO {

    @NotBlank(message = "Recipient email cannot be empty")
    private String recipientEmail;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Message cannot be empty")
    private String message;
}