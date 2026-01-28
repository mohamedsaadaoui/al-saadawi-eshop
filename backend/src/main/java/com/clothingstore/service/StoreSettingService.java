package com.clothingstore.service;

import com.clothingstore.repository.StoreSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreSettingService {

    private final StoreSettingRepository settingRepository;

    public List<com.clothingstore.model.entity.StoreSetting> getAllSettings() {
        return settingRepository.findAll();
    }

    public com.clothingstore.model.entity.StoreSetting updateSetting(String key, String value) {
        com.clothingstore.model.entity.StoreSetting setting = settingRepository.findBySettingKey(key)
                .orElse(com.clothingstore.model.entity.StoreSetting.builder().settingKey(key).build());
        setting.setSettingValue(value);
        return settingRepository.save(setting);
    }
}
