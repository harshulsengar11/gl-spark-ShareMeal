package com.sharemeal.notification.service;

import com.sharemeal.notification.dto.NotificationRequestDTO;
import com.sharemeal.notification.dto.NotificationResponseDTO;
import com.sharemeal.notification.entity.Notification;
import com.sharemeal.notification.exception.NotificationNotFoundException;
import com.sharemeal.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository
            notificationRepository;

    @Override
    public NotificationResponseDTO createNotification(
            NotificationRequestDTO requestDTO) {

        Notification notification =
                Notification.builder()
                        .recipientEmail(
                                requestDTO.getRecipientEmail())
                        .title(
                                requestDTO.getTitle())
                        .message(
                                requestDTO.getMessage())
                        .isRead(false)
                        .createdAt(
                                LocalDateTime.now())
                        .build();

        Notification saved =
                notificationRepository.save(
                        notification);

        return mapToResponse(saved);
    }

    @Override
    public NotificationResponseDTO getNotificationById(
            Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new NotificationNotFoundException(
                                        "Notification not found with id : " + id
                                ));

        return mapToResponse(notification);
    }

    @Override
    public List<NotificationResponseDTO>
    getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<NotificationResponseDTO>
    getNotificationsByEmail(
            String email) {

        return notificationRepository
                .findByRecipientEmail(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponseDTO markAsRead(
            Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new NotificationNotFoundException(
                                        "Notification not found with id : " + id
                                ));

        notification.setIsRead(true);

        Notification updated =
                notificationRepository.save(
                        notification);

        return mapToResponse(updated);
    }

    private NotificationResponseDTO mapToResponse(
            Notification notification) {

        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .recipientEmail(
                        notification.getRecipientEmail())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(
                        notification.getCreatedAt())
                .build();
    }
}