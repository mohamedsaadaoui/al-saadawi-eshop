package com.clothingstore.controller;

import com.clothingstore.model.entity.Order;
import com.clothingstore.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @GetMapping("/users")
    public ResponseEntity<List<com.clothingstore.model.entity.User>> getAllUsers() {
        List<com.clothingstore.model.entity.User> users = adminService.getAllUsers();
        System.out.println("Admin requested all users. Found: " + users.size());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<com.clothingstore.model.entity.User> updateUserRole(@PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String role = payload.get("role");
        return ResponseEntity
                .ok(adminService.updateUserRole(id, com.clothingstore.model.entity.User.Role.valueOf(role)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(adminService.updateOrderStatus(id, status));
    }
}
