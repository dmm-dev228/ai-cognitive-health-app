package com.aihealth.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/*
 * ProfileImageService
 * -------------------
 * Handles uploading user profile images to Cloudinary.
 */
@Service
public class ProfileImageService {

    private final Cloudinary cloudinary;

    public ProfileImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Uploads an image file and returns the secure Cloudinary URL.
    public String uploadProfileImage(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "cognihaven/profile-images",
                            "resource_type", "image"
                    )
            );

            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload profile image.", e);
        }
    }
}