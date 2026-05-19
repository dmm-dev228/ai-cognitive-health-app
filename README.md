# CogniHaven

AI-powered cognitive wellness and daily support platform.

CogniHaven is a full-stack wellness platform focused on cognitive engagement, supportive reflection, wellness routines, goal tracking, and AI-assisted encouragement. The platform combines AI journaling, cognitive games, community interaction, medication reminders, analytics, and supportive goal planning into one modern wellness ecosystem.

---

# Vision

CogniHaven is designed as:

> A safe, AI-powered space for cognitive wellness, reflection, encouragement, and daily support.

The platform is intentionally positioned as:

* supportive
* wellness-focused
* non-medical
* encouraging
* cognitively engaging

The application does NOT:

* diagnose medical conditions
* provide medical advice
* replace professional healthcare
* prescribe treatments

Instead, CogniHaven focuses on:

* healthy routines
* cognitive engagement
* reflection
* wellness tracking
* habit consistency
* supportive AI interactions

---

# Tech Stack

## Frontend

* React (Vite)
* JavaScript
* Tailwind CSS
* Recharts
* React Router

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA (Hibernate)
* Maven

## Database

* MySQL

## AI

* OpenAI API
* GPT-4.1-mini
* Prompt engineering
* AI wellness reflections
* AI analytics summaries
* AI goal planning

---

# Core Features

# Authentication System

Secure JWT-based authentication system.

## Features

* User signup
* User login
* JWT authentication
* Protected routes
* Email verification
* Resend verification email
* Automatic login after verification
* Delete account
* Password validation
* Current-user JWT ownership validation

## Security Architecture

Security is handled through:

* Spring Security
* JWT filters
* protected REST endpoints
* authenticated user loading through SecurityUtils

Frontend never sends user IDs manually.

Ownership is derived securely from the JWT token.

---

# Journal System

Users can create personal wellness journal entries.

## Features

* Create journal entries
* Mood tracking
* Title + content support
* Validation system
* Persistent storage
* Authenticated ownership
* Newest-first loading

## Validation

Frontend + backend validation.

Examples:

* required title
* required content
* character limits
* invalid field handling

---

# AI Reflection System

When users create journal entries, CogniHaven generates supportive AI reflections.

## AI Behavior

AI is instructed to:

* sound calm and supportive
* avoid clinical language
* avoid diagnosis
* avoid medical advice
* encourage healthy reflection
* ask gentle follow-up questions

## Context Used

AI reflections can use:

* journal content
* mood
* memory profile
* cognitive game performance

---

# Cognitive Games System

CogniHaven includes cognitive wellness games designed for engagement and memory support.

All games:

* save results
* track analytics
* support multiple difficulties
* generate AI reflections
* integrate into wellness analytics

---

# Game 1 — Pattern Recall

Users memorize a number pattern and reproduce it.

## Difficulties

### Easy

* 4 numbers
* short display time

### Medium

* 5 numbers
* longer sequence

### Hard

* 6 numbers
* increased challenge

## Scoring

Scoring is partial-credit based.

Example:

Correct pattern:

1234

User answer:

1238

Result:

* correctAnswers = 3
* totalQuestions = 4
* score = 75%

---

# Game 2 — Story Recall

Users read a short story containing 3 hidden memory items.

After a timed delay, they must recall the original items.

## Example

Items:

* car
* house
* shoe

Story:

"A small car drove past a quiet house, and someone left a shoe by the front door."

Later the user recalls the original items.

## Difficulties

### Easy

* story visible for 10 seconds

### Medium

* story visible for 15 seconds

### Hard

* story visible for 20 seconds

## Features

* clue system
* partial-credit scoring
* AI reflections
* separate analytics tracking

---

# AI Game Reflections

After every game session, AI generates a supportive reflection.

The AI:

* encourages progress
* avoids judgment
* avoids medical conclusions
* focuses on consistency and engagement

---

# Analytics Dashboard

Comprehensive wellness analytics dashboard.

## Features

* total games played
* average score
* best score
* average completion time
* AI-generated analytics summaries
* recent game history
* game-specific filtering
* difficulty filtering
* visual analytics

---

# Analytics Filtering

Users can filter analytics by:

## Game Type

* All Games
* Pattern Recall
* Story Recall

## Difficulty

* Overall
* Easy
* Medium
* Hard

---

# Analytics Visualizations

## Bar Graphs

Displays:

* average score
* average completion time
* grouped by difficulty

## Line Graphs

Displays:

* score trends over time
* progress across game attempts

---

# Community Feed

Supportive wellness-focused community system.

## Features

* create posts
* category system
* newest-first feed
* authenticated posting
* frontend + backend validation
* persistent community feed

## Community Categories

Examples:

* Reflection
* Routine
* Encouragement
* Wellness Tip

## Community Philosophy

Community is designed as:

* supportive
* safe
* wellness-focused
* non-medical

---

# Medication Reminder System

Users can manage wellness medication reminders.

## Features

* medication creation
* dosage tracking
* reminder scheduling
* multiple reminder times
* active/inactive states
* notification preferences
* pill metadata

## Reminder Channels

* in-app reminders
* email reminders
* SMS reminder architecture support

---

# Notification System

In-app notification infrastructure.

## Features

* periodic polling
* dismiss functionality
* medication reminder notifications
* future reminder scalability

---

# MyGoals System

AI-powered goal tracking and supportive habit-building system.

## Features

* create goals
* AI-generated goal plans
* progress logging
* progress bars
* completion tracking
* supportive milestones
* reminder preferences
* progress analytics foundation

---

# Goal Categories

Examples:

* Journaling
* Memory
* Wellness
* Fitness
* Nutrition
* Mindfulness
* Medication
* Personal

---

# AI Goal Planning

When goals are created, AI generates:

* supportive action plans
* realistic habit guidance
* manageable next steps
* encouraging reinforcement

AI avoids:

* shaming
* pressure
* unrealistic expectations
* medical guidance

---

# Goal Progress Tracking

Users can:

* log progress
* add notes
* track completion percentage
* view active goals
* view completed goals

Goals automatically complete when:

currentProgress >= targetCount

---

# Design Philosophy

CogniHaven uses calming and supportive design principles inspired by cognitive wellness research.

## Color Strategy

### Calming Colors

* blue
* green
* purple
* lavender

Used to:

* reduce stress
* encourage calmness
* improve readability
* create emotional safety

### Stimulating Accent Colors

* yellow
* orange
* red

Used sparingly for:

* alerts
* milestones
* progress emphasis
* engagement cues

---

# UI/UX Direction

The frontend is designed to feel:

* modern
* emotionally safe
* welcoming
* interactive
* clean
* supportive

## Styling Features

* Tailwind CSS
* glassmorphism
* soft gradients
* animated transitions
* rounded card systems
* responsive layouts
* supportive visual hierarchy

---

# Current Backend Architecture

## Controllers

* AuthController
* UserController
* JournalEntryController
* AIAnalysisController
* MemoryProfileController
* MedicationReminderController
* NotificationController
* CommunityPostController
* GoalController

## Services

* OpenAIService
* JournalEntryService
* AIAnalysisService
* UserService
* MedicationReminderService
* NotificationService
* GoalService
* CommunityPostService

## Repositories

* UserRepository
* JournalEntryRepository
* AIAnalysisRepository
* GameResultRepository
* MedicationReminderRepository
* NotificationRepository
* CommunityPostRepository
* GoalRepository
* GoalLogRepository

---

# AI Prompt Engineering

OpenAI prompts are carefully structured to:

* maintain supportive tone
* avoid medical risk
* preserve emotional safety
* encourage healthy habits
* remain concise and readable

AI systems include:

* journal reflections
* game reflections
* analytics summaries
* goal planning

---

# Security

## Authentication

* JWT-based auth
* protected routes
* ownership validation

## Validation

Frontend and backend validation throughout the platform.

## Ownership Protection

Users cannot:

* modify another user's goals
* access another user's journal data
* post under another identity
* alter another user's analytics

---

# Future Roadmap

## Planned Features

* additional cognitive games
* advanced analytics
* weekly wellness reports
* achievement system
* reward system
* streak tracking
* smarter AI personalization
* enhanced reminders
* AWS deployment
* Docker support
* CI/CD pipelines
* mobile optimization

---

# Project Status

CogniHaven has evolved from a simple journal application into a full AI-powered cognitive wellness ecosystem.

The platform currently includes:

* AI-assisted journaling
* cognitive games
* analytics dashboards
* supportive community interaction
* wellness reminders
* AI-powered goals
* secure authentication
* modern responsive frontend

The project is actively evolving toward a scalable wellness platform focused on cognitive engagement and supportive daily routines.

---

# Disclaimer

CogniHaven is NOT:

* a medical platform
* a diagnostic tool
* a replacement for healthcare professionals

CogniHaven is intended solely for:

* wellness support
* cognitive engagement
* reflection
* encouragement
* routine building
* supportive AI interaction
