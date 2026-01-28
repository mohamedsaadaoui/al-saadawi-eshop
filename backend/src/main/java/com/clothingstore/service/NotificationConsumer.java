package com.clothingstore.service;

import com.clothingstore.model.dto.NotificationMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationConsumer {

    @JmsListener(destination = "notifications")
    public void receiveNotification(NotificationMessage message) {
        log.info("Received notification from ActiveMQ: {}", message);
        // Logic to send email, SMS, or push notification would go here
        // For now, we just log it as "processed"
        System.out.println("ALERT: " + message.getMessage() + " [Sent to: " + message.getRecipientEmail() + "]");
    }
}
