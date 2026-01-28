package com.clothingstore.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private List<OrderItemRequest> items;
    private GuestInfo guestInfo; // Optional for guest checkout

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestInfo {
        private String email;
        private String fullName;
        private String address;
    }
}
