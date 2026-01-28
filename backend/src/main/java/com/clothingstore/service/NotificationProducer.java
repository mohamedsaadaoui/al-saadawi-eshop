package com.clothingstore.service;

import com.clothingstore.model.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {

    private final JmsTemplate jmsTemplate;

    public void sendNotification(NotificationMessage message) {
        log.info("Sending notification: {}", message);
        jmsTemplate.convertAndSend("notifications", message);
    }
}
