package com.aihealth.backend.security;

import org.springframework.security.core.context.SecurityContextHolder;

/*
 * Utility class to extract the currently authenticated user's email
 * from the Spring Security context (set by JWT filter).
 */
public class SecurityUtils {

    public static String getCurrentUserEmail() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }
}