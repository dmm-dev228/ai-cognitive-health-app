package com.aihealth.backend;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/*
 * Basic Spring Boot context smoke test.
 *
 * Disabled in CI for now because the full application context requires
 * production-like environment variables such as database, JWT, email,
 * Cloudinary, and OpenAI configuration.
 *
 * Core business logic is covered by focused controller and service tests.
 */
@Disabled("Full Spring context requires production-like environment variables in CI.")
@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}