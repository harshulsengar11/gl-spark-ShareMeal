package com.sharemeal.notification.controller;

import com.sharemeal.notification.dto.NotificationRequestDTO;
import com.sharemeal.notification.dto.NotificationResponseDTO;
import com.sharemeal.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService
            notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponseDTO>
    createNotification(
            @Valid
            @RequestBody
            NotificationRequestDTO requestDTO) {

        return new ResponseEntity<>(
                notificationService
                        .createNotification(
                                requestDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>>
    getAllNotifications() {

        return ResponseEntity.ok(
                notificationService
                        .getAllNotifications()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDTO>
    getNotificationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService
                        .getNotificationById(id)
        );
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<NotificationResponseDTO>>
    getNotificationsByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                notificationService
                        .getNotificationsByEmail(
                                email)
        );
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<NotificationResponseDTO>
    markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(id)
        );
    }
}