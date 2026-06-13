package com.aihealth.backend.controller;

import com.aihealth.backend.model.User;
import com.aihealth.backend.security.JwtUtil;
import com.aihealth.backend.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthVerificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private com.aihealth.backend.repository.UserRepository userRepository;

    @Test
    void verifyEmailShouldReturnJwtWhenTokenIsValid() throws Exception {

        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("demarquis");
        user.setEmailVerified(true);

        when(userService.verifyEmail("valid-token"))
                .thenReturn(user);

        when(jwtUtil.generateToken("test@example.com"))
                .thenReturn("jwt-token");

        // Act + Assert
        mockMvc.perform(
                get("/api/auth/verify-email")
                        .param("token", "valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token")
                        .value("jwt-token"))
                .andExpect(jsonPath("$.username")
                        .value("demarquis"))
                .andExpect(jsonPath("$.email")
                        .value("test@example.com"));
    }

    @Test
    void verifyEmailShouldFailWhenTokenIsInvalid() throws Exception {

        // Arrange
        when(userService.verifyEmail("bad-token"))
                .thenThrow(new RuntimeException("Invalid verification token"));

        // Act + Assert
        mockMvc.perform(
                get("/api/auth/verify-email")
                        .param("token", "bad-token"))
                .andExpect(status().isBadRequest());
    }
}