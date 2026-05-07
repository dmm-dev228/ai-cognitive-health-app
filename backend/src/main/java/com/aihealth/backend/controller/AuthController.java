package com.aihealth.backend.controller;

import com.aihealth.backend.dto.AuthRequest;
import com.aihealth.backend.dto.AuthResponse;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.JwtUtil;
import com.aihealth.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserService userService;

    public AuthController(UserRepository userRepository,
            JwtUtil jwtUtil,
            UserService userService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Authenticates a user by email/password and returns a JWT if valid.
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, user.getId()));
    }

    // Verifies a user's email and returns a JWT so they can be logged in automatically.
    @GetMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestParam String token) {
        User user = userService.verifyEmail(token);

        String jwt = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(jwt, user.getId()));
    }
}