package com.clothingstore.service;

import com.clothingstore.model.entity.Notification;
import com.clothingstore.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public Notification createNotification(String email, String message, String type, Long referenceId) {
        Notification notification = Notification.builder()
                .recipientEmail(email)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .build();
        return notificationRepository.save(notification);
    }
}
