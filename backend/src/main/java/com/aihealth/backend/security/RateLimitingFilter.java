package com.aihealth.backend.security;

import io.github.bucket4j.Bucket;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/*
 * RateLimitingFilter
 * ------------------
 * Protects CogniHaven from request abuse.
 *
 * Handles:
 * - brute-force login protection
 * - AI request throttling
 * - journal spam protection
 * - goal spam protection
 * - general API abuse prevention
 *
 * MVP note:
 * This is in-memory rate limiting.
 * Good for local/MVP/single-server deployment.
 *
 * Future production improvement:
 * Use Redis-backed rate limiting for multi-server deployment.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String key = buildRateLimitKey(request);
        Bucket bucket = buckets.computeIfAbsent(key, this::createBucketForKey);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(429);
        response.setContentType("application/json");

        String message;

        if (key.startsWith("LOGIN:")) {
            message = "Too many login attempts. Please wait 60 seconds before trying again.";
        } else if (key.startsWith("AI:")) {
            message = "AI request limit reached. Please try again later.";
        } else {
            message = "Too many requests. Please slow down and try again shortly.";
        }

        response.getWriter().write("""
                {
                  "message": "%s",
                  "status": 429
                }
                """.formatted(message));
    }

    /*
     * Builds a rate-limit key using:
     * - endpoint category
     * - client IP address
     *
     * Later we can improve this by including authenticated username/email.
     */
    private String buildRateLimitKey(HttpServletRequest request) {
        String path = request.getRequestURI();
        String ip = request.getRemoteAddr();

        if (path.startsWith("/api/auth/login")) {
            return "LOGIN:" + ip;
        }

        if (path.startsWith("/api/ai-analysis")) {
            return "AI:" + ip;
        }

        if (path.startsWith("/api/journal")) {
            return "JOURNAL:" + ip;
        }

        if (path.startsWith("/api/goals")) {
            return "GOALS:" + ip;
        }

        return "GENERAL:" + ip;
    }

    // Creates different request quotas depending on endpoint type.
    private Bucket createBucketForKey(String key) {

        if (key.startsWith("LOGIN:")) {
            return Bucket.builder()
                    .addLimit(limit -> limit
                            .capacity(5)
                            .refillIntervally(5, Duration.ofMinutes(1)))
                    .build();
        }

        if (key.startsWith("AI:")) {
            return Bucket.builder()
                    .addLimit(limit -> limit
                            .capacity(50)
                            .refillIntervally(50, Duration.ofHours(1)))
                    .build();
        }

        if (key.startsWith("JOURNAL:")) {
            return Bucket.builder()
                    .addLimit(limit -> limit
                            .capacity(20)
                            .refillIntervally(20, Duration.ofMinutes(10)))
                    .build();
        }

        if (key.startsWith("GOALS:")) {
            return Bucket.builder()
                    .addLimit(limit -> limit
                            .capacity(30)
                            .refillIntervally(30, Duration.ofMinutes(10)))
                    .build();
        }

        return Bucket.builder()
                .addLimit(limit -> limit
                        .capacity(100)
                        .refillIntervally(100, Duration.ofMinutes(1)))
                .build();
    }
}