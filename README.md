# AI Cognitive Health App

A full-stack AI-powered cognitive wellness platform designed to support users through journaling, memory reinforcement, and routine assistance.

---

## Overview

This application helps users maintain cognitive engagement and daily structure through:

* Personal memory profiles
* Daily journaling
* Medication reminder support
* Dietary preference tracking
* Cognitive game tracking (planned)
* AI-generated supportive responses (planned)

The AI is designed to act as a supportive companion and assistant. It does **not** diagnose medical conditions, prescribe medication, or provide unsafe medical advice.

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

* **model** → database entities
* **repository** → data access layer
* **service** → business logic
* **controller** → API endpoints
* **dto** → request/response validation
* **exception** → global error handling

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

### Tables

* users
* memory_profiles
* dietary_profiles
* medication_reminders
* journal_entries
* game_results
* ai_analyses

### Relationships

* One-to-One:

  * User → MemoryProfile
  * User → DietaryProfile

* One-to-Many:

  * User → JournalEntry
  * User → MedicationReminder
  * User → GameResult
  * User → AIAnalysis

---

## Frontend Progress

* React (Vite) initialized
* Project structure created
* Connecting frontend to backend APIs
* Journal feature integrated with backend

---

## Current Status

Backend MVP complete with working APIs and security foundations.

Frontend (React + Vite) has been initialized and is now being connected to backend services.

---

## Next Steps

* Build full frontend UI (Journal, Memory Profile, Navigation)
* Implement authentication (Clerk or JWT)
* Add AI integration for journal analysis and companion responses
* Implement rate limiting and advanced security measures
* Expand analytics and dashboard features

---

## Future Vision

This platform aims to provide a safe, supportive environment for users to maintain cognitive engagement and emotional well-being through technology-assisted routines and AI companionship.
