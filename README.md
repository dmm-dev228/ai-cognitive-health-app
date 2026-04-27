# AI Cognitive Health App

A full-stack AI-powered cognitive wellness platform designed to support users through journaling, memory reinforcement, and routine assistance.

## Overview

This application helps users maintain cognitive engagement and daily structure through:

* Personal memory profiles
* Daily journaling
* Medication reminder support
* Dietary preference tracking
* Cognitive game tracking (planned)
* AI-generated supportive responses (planned)

The AI is designed to act as a supportive companion and assistant. It does **not** diagnose medical conditions or provide medical advice.

---

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Data JPA (Hibernate)
* MySQL
* Maven
* BCrypt (password hashing)

### Frontend

* React
* Vite
* JavaScript

---

## Architecture

The backend follows a layered architecture:

Controller → Service → Repository → Database

### Packages

* model → database entities
* repository → data access layer
* service → business logic
* controller → API endpoints
* dto → request/response validation
* exception → global error handling

---

## Features Implemented

### User API

* Create user with BCrypt password hashing
* Prevent duplicate email registration
* Secure DTO-based responses (no password exposure)

### Memory Profile API

* Create/update memory profile
* One-to-one relationship with user
* Supports personalized AI context

### Journal API

* Create journal entries
* Retrieve entries by user
* One-to-many relationship with user

---

## Security Features

* Password hashing using BCrypt
* DTO pattern to control input/output
* Validation using Jakarta Bean Validation
* Global exception handling for clean API responses
* Protection against SQL injection using JPA repositories

---

## Database Design

Tables:

* users
* memory_profiles
* dietary_profiles
* medication_reminders
* journal_entries
* game_results
* ai_analyses

Relationships:

* One-to-One: User → MemoryProfile, DietaryProfile
* One-to-Many: User → JournalEntry, MedicationReminder, GameResult, AIAnalysis

---

## Current Status

Backend MVP complete with working APIs and security foundations.

Frontend (React) is now being developed and connected to backend services.

---

## Next Steps

* Build React frontend UI
* Add authentication (Clerk or JWT)
* Implement AI integration
* Add rate limiting and advanced security
* Expand analytics and dashboard features
