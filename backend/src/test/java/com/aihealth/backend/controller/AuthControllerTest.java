package com.aihealth.backend.controller;

import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.JwtUtil;
import com.aihealth.backend.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserService userService;

    @Test
    void loginShouldFailWhenEmailIsNotVerified() throws Exception {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = new User();
        user.setUsername("demarquis");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setRole("USER");
        user.setEmailVerified(false);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        String requestBody = """
                {
                    "email": "test@example.com",
                    "password": "Password123"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(requestBody))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void loginShouldFailWhenPasswordIsIncorrect() throws Exception {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Arrange
        // Create a verified user with a stored BCrypt password.
        User user = new User();
        user.setUsername("demarquis");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("CorrectPassword123"));
        user.setRole("USER");
        user.setEmailVerified(true);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        String requestBody = """
                {
                    "email": "test@example.com",
                    "password": "WrongPassword123"
                }
                """;

        // Act + Assert
        // Login should fail because the submitted password does not match.
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(requestBody))
                .andExpect(status().isUnauthorized());

        // Assert
        // A failed password check should never generate a JWT.
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void loginShouldFailWhenEmailDoesNotExist() throws Exception {
        // Arrange
        // Simulate the repository not finding a user with the submitted email.
        when(userRepository.findByEmail("missing@example.com"))
                .thenReturn(Optional.empty());

        String requestBody = """
                {
                    "email": "missing@example.com",
                    "password": "Password123"
                }
                """;

        // Act + Assert
        // Login should fail because the account does not exist.
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(requestBody))
                .andExpect(status().isUnauthorized());
        // Assert
        // No user means no token should be generated.
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void loginShouldReturnJwtWhenCredentialsAreValid() throws Exception {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Arrange
        // Create a verified user with a password that matches the login request.
        User user = new User();
        user.setUsername("demarquis");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setRole("USER");
        user.setEmailVerified(true);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken("test@example.com"))
                .thenReturn("fake-jwt-token");

        String requestBody = """
                {
                    "email": "test@example.com",
                    "password": "Password123"
                }
                """;

        // Act + Assert
        // Login should succeed and return the generated JWT.
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.username").value("demarquis"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}