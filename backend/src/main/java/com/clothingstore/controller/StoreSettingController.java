package com.clothingstore.controller;

import com.clothingstore.model.entity.StoreSetting;
import com.clothingstore.service.StoreSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class StoreSettingController {

    private final StoreSettingService settingService;

    @GetMapping
    public List<StoreSetting> getAllSettings() {
        return settingService.getAllSettings();
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public StoreSetting updateSetting(@RequestBody Map<String, String> payload) {
        String key = payload.get("key");
        String value = payload.get("value");
        return settingService.updateSetting(key, value);
    }
}
