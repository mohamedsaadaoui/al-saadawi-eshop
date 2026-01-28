package com.clothingstore.service;

import com.clothingstore.model.dto.NotificationMessage;
import com.clothingstore.model.entity.Order;
import com.clothingstore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final com.clothingstore.repository.UserRepository userRepository;
    private final NotificationProducer notificationProducer;
    private final NotificationService notificationService;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<com.clothingstore.model.entity.User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public com.clothingstore.model.entity.User updateUserRole(Long userId,
            com.clothingstore.model.entity.User.Role role) {
        com.clothingstore.model.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(Order.Status.valueOf(status));
        Order savedOrder = orderRepository.save(order);

        // Notify User via JMS
        notificationProducer.sendNotification(NotificationMessage.builder()
                .type("ORDER_UPDATE")
                .message("Your order #" + orderId + " is now " + status)
                .recipientEmail(order.getUser().getEmail())
                .referenceId(orderId)
                .build());

        // Save notification to DB
        notificationService.createNotification(
                order.getUser().getEmail(),
                "Your order #" + orderId + " is now " + status,
                "ORDER_UPDATE",
                orderId);

        return savedOrder;
    }
}
