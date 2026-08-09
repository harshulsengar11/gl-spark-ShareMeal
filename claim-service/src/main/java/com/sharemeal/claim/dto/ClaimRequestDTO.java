package com.sharemeal.claim.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequestDTO {

    @NotNull(message = "Food Id is required")
    private Long foodId;

    @NotBlank(message = "Claimer email cannot be empty")
    @Email(message = "Please enter a valid email address")
    private String claimerEmail;
}