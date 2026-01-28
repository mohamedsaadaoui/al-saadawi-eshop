package com.clothingstore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            System.out.println("=== UPLOAD FILE DEBUG ===");
            System.out.println("File received: " + (file != null ? file.getOriginalFilename() : "NULL"));
            System.out.println("File size: " + (file != null ? file.getSize() : 0));
            System.out.println("Upload directory: " + uploadDir);

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            System.out.println("Absolute upload path: " + uploadPath.toAbsolutePath());

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory");
            }

            // Generate unique filename
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            System.out.println("Saving to: " + filePath.toAbsolutePath());

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File saved successfully!");
            System.out.println("=========================");

            // Return relative URL that will be served by FileController
            return "/api/files/" + fileName;

        } catch (Exception ex) {
            System.err.println("ERROR uploading file: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Error uploading file to local storage", ex);
        }
    }
}
