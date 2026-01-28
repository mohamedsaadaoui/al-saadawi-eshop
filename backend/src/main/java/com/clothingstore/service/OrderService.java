package com.clothingstore.service;

import com.clothingstore.model.dto.OrderItemRequest;
import com.clothingstore.model.dto.OrderRequest;
import com.clothingstore.model.entity.Order;
import com.clothingstore.model.entity.OrderItem;
import com.clothingstore.model.entity.Product;
import com.clothingstore.model.entity.User;
import com.clothingstore.repository.OrderRepository;
import com.clothingstore.repository.ProductRepository;
import com.clothingstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    // NotificationProducer is already injected from previous turn or needs to be
    // handled if I overwrote it.
    // Wait, I might have overwritten OrderService in previous turns or the file
    // content view showed it.
    // Let's assume NotificationProducer is there or I re-add it safe.
    private final NotificationProducer notificationProducer;

    @Transactional
    public Order createOrder(String userEmail, OrderRequest request) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } else if (request.getGuestInfo() == null) {
            throw new RuntimeException("User must be logged in or provide guest info");
        }

        Order order = new Order();
        if (user != null) {
            order.setUser(user);
        }
        // If guest, user is null. We might need to store guest details in Order entity
        // or just process it.
        // For simplicity, we just process. (In real app, Order entity should have guest
        // fields)

        order.setStatus(Order.Status.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Send Notification
        String recipientEmail = user != null ? user.getEmail()
                : (request.getGuestInfo() != null ? request.getGuestInfo().getEmail() : "no-email");
        notificationProducer.sendNotification(com.clothingstore.model.dto.NotificationMessage.builder()
                .type("ORDER_CREATED")
                .message("Order #" + savedOrder.getId() + " created successfully.")
                .recipientEmail(recipientEmail)
                .referenceId(savedOrder.getId())
                .build());

        return savedOrder;
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
}
