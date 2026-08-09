package com.sharemeal.notification.service;

import com.sharemeal.notification.dto.NotificationRequestDTO;
import com.sharemeal.notification.dto.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {

    NotificationResponseDTO createNotification(
            NotificationRequestDTO requestDTO);

    NotificationResponseDTO getNotificationById(
            Long id);

    List<NotificationResponseDTO> getAllNotifications();

    List<NotificationResponseDTO> getNotificationsByEmail(
            String email);

    NotificationResponseDTO markAsRead(
            Long id);
}