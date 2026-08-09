package com.sharemeal.claim.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long foodId;

    @Column(nullable = false)
    private String claimerEmail;

    @Column(nullable = false)
    private String claimerRole;

    private String claimerPhone;

    private String donorEmail;

    private String donorPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    @Column(nullable = false)
    private LocalDateTime claimTime;

    private Integer rating;

    @Column(length = 500)
    private String review;
}