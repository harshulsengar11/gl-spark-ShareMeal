package com.sharemeal.notification.repository;

import com.sharemeal.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByRecipientEmail(String recipientEmail);
}