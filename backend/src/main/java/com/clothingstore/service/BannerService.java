package com.clothingstore.service;

import com.clothingstore.model.entity.Banner;
import com.clothingstore.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    public List<Banner> getActiveBanners() {
        return bannerRepository.findByActiveTrue();
    }

    public Banner saveBanner(Banner banner) {
        return bannerRepository.save(banner);
    }

    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
}
