package com.clothingstore.controller;

import com.clothingstore.model.entity.Product;
import com.clothingstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("query") String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {

        System.out.println("=== CREATE PRODUCT DEBUG ===");
        System.out.println("Name: " + name);
        System.out.println("Description: " + description);
        System.out.println("Price: " + price);
        System.out.println("Stock: " + stock);
        System.out.println("Image received: " + (image != null ? image.getOriginalFilename() : "NULL"));
        System.out.println("Image size: " + (image != null ? image.getSize() : 0));

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .imageUrl(imageUrl)
                .build();

        System.out.println("Step 1: Product object built");

        Product savedProduct = productService.createProduct(product, image);

        System.out.println("Step 2: ProductService.createProduct result - ID: " + savedProduct.getId());
        System.out.println("Step 3: Final Image URL in DB: " + savedProduct.getImageUrl());
        System.out.println("============================");

        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
