package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * User
 * ----
 * Represents an authenticated CogniHaven user.
 * Stores login credentials, role information,
 * and email verification state.
 */
@Entity
@Table(name = "users")
public class User {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Public username
    @Column(nullable = false, length = 50)
    private String username;

    // Unique login email
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // BCrypt hashed password
    @Column(nullable = false, length = 255)
    private String password;

    // User role
    @Column(nullable = false, length = 20)
    private String role;

    // Email verification state
    @Column(name = "email_verified")
    private Boolean emailVerified;

    // Verification token sent via email
    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    // Account creation timestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}