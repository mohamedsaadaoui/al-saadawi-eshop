package com.clothingstore.config;

import com.clothingstore.model.entity.*;
import com.clothingstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreSettingRepository settingRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Initialize Default Admin
        if (userRepository.findByEmail("admin@alsadawishop.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("admin@alsadawishop.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Admin User")
                    .role(User.Role.ROLE_ADMIN)
                    .build());
            System.out.println("Default admin created: admin@alsadawishop.com / admin123");
        }

        // 2. Initialize Default Settings
        initializeSetting("store_name", "AL SADAWI SHOP");
        initializeSetting("store_email", "contact@alsadawishop.com");
        initializeSetting("currency", "USD ($)");
        initializeSetting("maintenance_mode", "false");

        // 3. Initialize Default Categories
        initializeCategory("Men", "Clothing for men");
        initializeCategory("Women", "Clothing for women");
        initializeCategory("Accessories", "Fashion accessories");

        // 4. Initialize Default Banners
        if (bannerRepository.count() == 0) {
            bannerRepository.save(Banner.builder()
                    .title("Premium Winter Collection")
                    .subtitle("Discover our new luxury arrivals for the season")
                    .buttonText("Shop Collection")
                    .linkUrl("/products")
                    .imageUrl(
                            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop")
                    .active(true)
                    .build());
            System.out.println("Default banner initialized");
        }

        // 5. Initialize Default Products if empty
        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .name("Classic Black Suit")
                    .description("Expertly tailored premium wool suit")
                    .price(new BigDecimal("599.99"))
                    .stock(10)
                    .category("Men")
                    .imageUrl(
                            "https://images.unsplash.com/photo-1594932224010-74f6e6fb1f2c?q=80&w=2000&auto=format&fit=crop")
                    .build());

            productRepository.save(Product.builder()
                    .name("Silk Evening Gown")
                    .description("Elegant silk dress for special occasions")
                    .price(new BigDecimal("349.50"))
                    .stock(5)
                    .category("Women")
                    .imageUrl(
                            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1700&auto=format&fit=crop")
                    .build());
            System.out.println("Default products initialized");
        }
    }

    private void initializeSetting(String key, String value) {
        if (settingRepository.findBySettingKey(key).isEmpty()) {
            settingRepository.save(StoreSetting.builder()
                    .settingKey(key)
                    .settingValue(value)
                    .build());
        }
    }

    private void initializeCategory(String name, String desc) {
        if (categoryRepository.findAll().stream().noneMatch(c -> c.getName().equals(name))) {
            categoryRepository.save(Category.builder()
                    .name(name)
                    .description(desc)
                    .build());
        }
    }
}
