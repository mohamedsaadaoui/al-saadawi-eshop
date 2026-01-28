package com.clothingstore.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessage implements Serializable {
    private String type; // ORDER_CREATED, PRODUCT_UPDATED
    private String message;
    private String recipientEmail;
    private Long referenceId;
}
