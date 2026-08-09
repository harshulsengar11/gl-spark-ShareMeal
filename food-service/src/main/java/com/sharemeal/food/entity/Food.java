package com.sharemeal.food.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

    private Integer quantity;

    private String description;

    private Double originalPrice;

    private Double discountedPrice;

    private String donorEmail;

    private String donorPhone;

    private String city;

    private String donorAddress;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private FoodStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime ngoReservedTill;

    private LocalDateTime expiryDate;
}