package com.clothingstore.controller;

import com.clothingstore.model.entity.Banner;
import com.clothingstore.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/active")
    public List<Banner> getActiveBanners() {
        return bannerService.getActiveBanners();
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Banner> getAllBanners() {
        return bannerService.getAllBanners();
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Banner saveBanner(@RequestBody Banner banner) {
        return bannerService.saveBanner(banner);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }
}
