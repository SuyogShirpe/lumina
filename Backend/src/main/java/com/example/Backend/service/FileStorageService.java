package com.example.Backend.service;

import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init(){
        try{
            Files.createDirectories(Path.of(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory"+e);
        }
    }

    public String storeFile(MultipartFile file){
        if(file.isEmpty()){
            throw new IllegalArgumentException("File is empty");
        }
        if(file.getContentType() == null || !file.getContentType().startsWith("image/")){
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;

        Path path = Path.of(uploadDir).resolve(uniqueFileName);

        try{
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file"+e);
        }

        return "/uploads/" + uniqueFileName;
    }
}
