# CogniHaven

**Tagline:**
*A calm, AI-powered cognitive wellness and daily support platform.*

CogniHaven is a deployed full-stack AI-powered wellness ecosystem designed to support reflection, cognitive engagement, healthy routines, memory reinforcement, medication support, community encouragement, analytics, and emotionally safe AI-guided experiences.

The platform focuses on cognitive wellness rather than medical diagnosis and provides users with a calm daily environment for growth, reflection, encouragement, healthy habit building, and supportive daily interaction.

CogniHaven is intentionally positioned as a cognitive wellness and daily support platform, not a medical diagnostic tool.

---

# 🌐 Live Application

**Live Site:**
https://cognihaven.net

**Backend Health Check:**
https://cognihaven-backend.onrender.com/health

CogniHaven is deployed using a production-style cloud architecture:

* Vercel Frontend Hosting
* Render Backend Hosting
* Railway MySQL Database
* Dockerized Spring Boot Backend
* Custom Domain Deployment
* Gmail SMTP Email Delivery
* Environment Variable Configuration

---

# 🎥 Demos

## Journal System Demo

[![Watch Demo](./assets/JournalDemo.png)](https://www.youtube.com/watch?v=wLBaWi6hfa8)

## Authentication & Email Verification Demo

[![Watch Demo](./assets/EmailVerificationDemo.png)](https://youtu.be/Ng3uUpbvEks?si=lAmn-HeKzPWdehgq)

## Cognitive Games Demo

🎬 **Watch Demo**
(Add Link)

## Community Experience Demo

🎬 **Watch Demo**
(Add Link)

---

# 🔒 Authentication & Security

CogniHaven includes a secure authentication system built with Spring Security and JWT authentication.

## Features

* JWT Authentication
* Protected Routes
* Email Verification
* Resend Verification Flow
* Automatic Login After Verification
* Password Reset Flow
* Password Strength Validation
* Session-Based Authentication
* Idle Session Timeout Protection
* Automatic Logout After Inactivity
* Login Rate Limiting
* API Rate Limiting
* Spring Security Integration
* Current Password Verification For Sensitive Account Changes
* Secure Email Change Verification Workflow
* Secure Username Change Workflow
* Secure Account Deletion Flow

## Email Verification Flow

Signup flow:

1. User creates an account
2. User is saved with email verification disabled
3. Verification token is generated
4. Verification email is sent
5. User clicks verification link
6. Backend validates token
7. JWT is generated
8. User is automatically logged in
9. User is redirected into the application

Login blocks unverified users until email ownership is confirmed.

---

# ⚙ Account & Settings System

CogniHaven includes a production-quality account and settings experience designed to give users control over their profile, security, notifications, and session behavior.

## Settings Drawer Architecture

The settings experience is organized into expandable sections:

* Account
* Appearance
* Security
* Session Timeout
* Notifications

This replaced the original flat settings layout with a cleaner SaaS-style interface.

## Profile Image Management

Users can:

* Upload Profile Images
* Remove Profile Images
* See Live Navbar Avatar Updates
* Use Fallback Avatar Initials
* Refresh Profile State Without Reloading

Profile image updates synchronize through session storage and user refresh events.

## Username Management

Users can securely update their username.

Backend protections include:

* Username Uniqueness Validation
* Case-Insensitive Duplicate Checking
* Username Validation Rules
* Current Password Requirement

Frontend improvements include:

* Dedicated Expandable Username Section
* Success/Error Feedback
* Live Navbar Username Updates
* No Logout/Login Required

## Email Change System

CogniHaven includes a secure email change flow.

Flow:

1. User enters new email
2. User enters current password
3. Verification email is sent to the new address
4. User clicks verification link
5. Email is updated only after verification

Benefits:

* Prevents Email Typos
* Prevents Account Lockouts
* Prevents Unauthorized Email Changes
* Confirms Ownership Of Destination Email

## Password Management

Users can update their password through a dedicated security panel.

Features:

* Current Password Requirement
* New Password Field
* Confirm Password Field
* Validation Checks
* Success/Error Feedback
* Professional Expandable UI

## Delete Account

The delete account workflow is visually separated and styled with strong warning language.

This improves clarity and reduces accidental destructive actions.

---

# ⏳ Session Management

CogniHaven includes advanced session timeout handling designed for privacy and security.

## Features

* Configurable Session Timeout Controls
* Continuous Inactivity Monitoring
* Real-Time Idle Calculations
* Countdown Warning Modal
* Stay Signed In Option
* Automatic Logout
* Return To Home Page After Logout

## Session Timeout Fix

A major session bug was resolved.

Old behavior:

User left the site open
↓
No browser activity events fired
↓
Countdown did not begin until the user returned

New behavior:

User leaves the site open
↓
Last activity timestamp is tracked
↓
Continuous checker monitors inactivity
↓
Warning appears automatically
↓
User is logged out after countdown expires

This transformed session timeout from a convenience feature into a true security feature.

---

# 🧠 Conversational AI Journal System

CogniHaven includes a custom conversational AI companion designed to create emotionally supportive, context-aware conversations rather than isolated AI-generated reflections.

## Journal Features

* Create Journal Entries
* Mood Tracking
* Conversation Continuation
* User-Specific Journal History
* Daily Reflection Experience
* Dynamic Daily Prompts
* AI Responses Saved Into Conversation Threads
* Text-to-Speech On AI Messages
* Speech-to-Text Journal Input

## AI Features

### Multi-Turn Conversations

* Conversation Threads
* Context Awareness
* Follow-Up Understanding
* Emotional Continuity
* Recent Conversation Context

### Conversation Analysis

The AI analyzes:

* User Intent
* Emotional Tone
* Direct Questions
* Emotional Disclosures
* Safety Signals
* Conversation Continuation

### AI Reflection Features

* Context-Aware Responses
* Reduced Repetition
* Natural Conversation Flow
* Direct Question Handling
* Wellness-Focused Responses
* Memory-Aware Responses
* Game Performance Awareness

### Emotional Tone Support

Supported emotional states include:

* Positive
* Neutral
* Sad
* Stressed
* Worried
* Angry

## AI Prompting Direction

CogniHaven's AI is designed to:

* Respond Naturally
* Avoid Robotic Repetition
* Avoid Forced Positivity
* Avoid Diagnosis
* Prioritize The Latest User Message
* Treat Journal Titles As Low-Priority Context
* Use Memory Profile Information Only When Relevant

---

# 🌐 Community System

The Community experience is designed around emotional safety, encouragement, personal growth, and meaningful interaction.

CogniHaven intentionally avoids toxic social media patterns and instead focuses on calm, supportive community interaction.

## Community Feed

Users can share:

* Reflections
* Encouragement
* Wellness Tips
* Personal Growth Updates
* Daily Wins

## Community Guidelines Onboarding

First-time visitors receive onboarding guidelines emphasizing:

* Support Over Judgment
* Respectful Communication
* Safe Sharing
* Encouragement
* No Medical Advice

## Community Discover

Curated discovery experience focused on:

🌱 Growth & Support
🤖 Tech & AI
💜 Wellbeing & Resilience

Powered by:

* Guardian Open Platform API
* Backend Safety Filtering
* Curated Positive Discovery

The Discover section is designed for learning, growth, wellness, and curiosity rather than doom scrolling.

## Community Trends

Dynamic trend tracking is powered by:

* Spring Data JPA Aggregation
* Backend Analytics
* Real-Time Community Activity

Trends show live category activity instead of hardcoded tags.

## AI Moderation System

Moderation outcomes:

* APPROVED
* NEEDS_REVISION
* BLOCKED
* CRISIS

The moderation system helps:

* Reduce Toxicity
* Prevent Harassment
* Detect Harmful Content
* Encourage Respectful Interaction
* Preserve Emotional Safety

Frontend moderation messages are designed to be supportive rather than harsh.

---

# 💬 Feedback System

CogniHaven includes an authenticated homepage feedback system.

## Purpose

The feedback system allows users to submit product feedback directly inside the application.

## Architecture

Feedback flow:

FeedbackCard
↓
api.js
↓
FeedbackController
↓
EmailService
↓
Gmail SMTP Email

## Features

Users can:

* Submit Feedback From The Homepage
* Receive Success Confirmation
* See Loading State
* See Professional Error Messages

## Security Improvements

The feedback endpoint is protected by JWT authentication.

Guest users see:

"Please sign in to send feedback. This helps us keep feedback meaningful and secure."

Authenticated users can submit feedback successfully.

## Identity Handling

The feedback form does not ask for name or email.

Reason:

* User identity already exists in JWT
* Backend obtains user email from SecurityContext
* Prevents fake names
* Prevents fake emails
* Reduces spam submissions

Feedback emails include:

* Authenticated User Email
* Feedback Message
* Submission Source

---

# 💊 Medication Reminder System

## Reminder Creation

Users can create:

* Medication Name
* Dosage
* Pill Shape
* Pill Color
* Pill Size
* Notes
* Reminder Frequency
* Multiple Reminder Times

## Reminder Channels

Supported delivery methods:

* In-App Notifications
* Email Reminders

## Reminder Management

* Active Status Indicators
* Pause Reminder
* Resume Reminder
* Delete Reminder
* Reminder Channel Display
* Success/Error Feedback

## Automation

Backend schedulers automatically:

* Check Reminder Schedules
* Send Notifications
* Send Reminder Emails
* Manage Active/Inactive Reminders

## User Preference Integration

Medication reminders respect user notification preferences.

Users can enable or disable medication notifications through the settings experience.

---

# 🎯 Goal System

CogniHaven includes goal tracking and goal reminder infrastructure.

## Goal Features

* Create Goals
* Track Goal Progress
* Log Goal Activity
* View Goal Status
* Receive Goal Reminders
* Email Reminder Support

## Goal Reminder Rules

Goal reminders use intelligent reminder logic.

A goal must:

* Be ACTIVE
* Have Email Reminders Enabled

Cooldown rules:

* Maximum One Reminder Every 24 Hours
* Reminder After 24 Hours If No Progress Has Been Logged
* Reminder After 48 Hours If Previous Progress Exists But Activity Has Stopped

Purpose:

* Encourage Consistency
* Avoid Reminder Spam
* Support Healthy Momentum

---

# 🔔 Notification System

## Unified Notification Center

Supports:

* Medication Notifications
* Journal Notifications
* Goal Notifications
* Community Notifications
* Dismiss Actions
* Auto Polling
* Popup Notification UI

## Notification Preferences

Users can individually control:

* Journal Reminders
* Goal Reminders
* Medication Reminders
* Community Notifications

Preferences are persisted per user in the database.

## Backend Preference Fields

User notification preferences include:

* journalReminderEnabled
* goalReminderEnabled
* medicationReminderEnabled
* communityNotificationEnabled

## Preference Endpoints

The backend supports preference updates through endpoints including:

* /users/me/journal-reminder
* /users/me/goal-reminder
* /users/me/medication-reminder
* /users/me/community-notifications

## Notification UI

Notification settings use expandable panels and animated toggles for:

* Journal Reminders
* Medication Reminders
* Goal Reminders
* Community Updates

Changes update immediately and synchronize with session storage.

---

# 🎮 Cognitive Games

CogniHaven includes multiple cognitive engagement experiences.

---

## Story Recall

Features:

* AI-Generated Stories
* Dynamic Target Words
* Difficulty Scaling
* Speech Narration
* Replay Audio
* Speech-to-Text Answers
* Clue System
* AI Reflections
* Analytics Tracking

Metrics:

* Accuracy
* Recall Score
* Completion Time

---

## Memory Match

Features:

* Card Matching Gameplay
* Difficulty Levels
* Memorization Preview Phase
* Countdown System
* Timer
* Move Tracking
* Score Tracking
* AI Reflections
* Analytics Tracking
* Play Again
* Change Game

Metrics:

* Accuracy
* Completion Time
* Score

---

## Pattern Recall

Features:

* Visual Pattern Memorization
* Recall Challenges
* Cognitive Engagement Tracking
* AI Reflection Support

---

## Word Bloom

CogniHaven's wellness-focused word puzzle experience.

Features:

* AI-Generated Secret Words
* AI-Generated Subtle Hints
* Difficulty Scaling
* Dynamic Hint Unlocking
* Keyboard-First Gameplay
* Timer
* Scoring
* AI Reflections
* Analytics Integration

Word Bloom avoids direct-definition hints and instead provides observation-based clues designed to encourage deeper cognitive engagement.

---

# 📈 AI-Powered Analytics Dashboard

CogniHaven includes an AI-powered cognitive analytics dashboard that combines data visualization, performance tracking, and personalized AI-generated insights.

## Dashboard Tracks

* Total Games Played
* Accuracy Trends
* Completion Statistics
* Cognitive Activity History
* Score Tracking
* Completion Time Tracking
* Difficulty Tracking
* Individual Game Statistic Cards
* Performance Summaries
* AI Insights
* AI Recommendations

## Visualizations

The dashboard includes:

* Line Graphs
* Bar Graphs
* Game-Specific Statistic Cards
* Performance Trend Views

## AI Insights

The AI can:

* Summarize Performance
* Encourage Continued Engagement
* Suggest Games To Practice More Often
* Provide Supportive Recommendations

Analytics are designed to encourage awareness rather than competition.

---

# 🎙 Voice Features

## Text-to-Speech

* Speaker Toggle Controls
* Click To Read
* Click To Stop
* Active Speaker Indicators
* Automatic Voice Selection
* Enhanced Voice Quality Selection

## Speech-to-Text

* Embedded Microphone Controls
* Direct Input Integration
* Auto Transcription
* Browser Speech Recognition Support

Voice features are used across journal and cognitive game experiences.

---

# 🧠 Memory Profile System

CogniHaven includes a memory profile system designed to help personalize the user experience.

The memory profile can support:

* Favorite Things
* Meaningful Memories
* Personal Interests
* Comfort Activities
* Memory-Aware AI Responses

The AI can use stored memory information when relevant, while avoiding unnecessary or repetitive references.

---

# 🥗 Dietary Profile System

CogniHaven includes a dietary profile system aligned with cognitive wellness and healthy routine support.

The dietary system is positioned around:

* Healthy Habits
* Routine Awareness
* Wellness Support
* Cognitive Wellness
* Non-Judgmental Tracking

It is not intended as a strict dieting tool or medical nutrition system.

---

# 🧠 AI Integration

Powered by:

* OpenAI API
* Context-Aware Prompting
* Conversation Analysis
* Dynamic Reflection Generation
* Dynamic Story Generation
* Dynamic Daily Prompt Generation
* Memory-Aware Responses
* Cognitive Activity Awareness
* Community Moderation Analysis
* AI-Powered Analytics Recommendations

---

# 📧 Email System

CogniHaven uses Gmail SMTP for production email delivery.

Current email types:

* Email Verification
* Resend Verification
* Password Reset
* Medication Reminders
* Goal Reminders
* User Feedback

Emails are branded as CogniHaven while being sent through a configured Gmail SMTP account using an app password.

---

# 🧱 Architecture

CogniHaven follows a layered full-stack architecture.

Frontend:

React UI
↓
services/api.js
↓
REST API Calls

Backend:

Controller
↓
Service
↓
Repository
↓
MySQL Database

AI workflows:

Frontend Request
↓
Spring Boot Service Layer
↓
OpenAIService
↓
AI Response
↓
Database Persistence
↓
Frontend Display

This keeps API keys secure and centralizes AI prompting logic on the backend.

---

# 🌿 Branching Workflow

CogniHaven uses a professional development workflow.

Current process:

dev
↓
feature development
↓
commit
↓
push origin dev
↓
GitHub Pull Request
↓
merge into main

This mirrors real development team workflows and keeps main stable.

---

# 💻 Frontend Stack

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Browser Speech Recognition API
* Browser Speech Synthesis API
* Session Storage Synchronization

---

# ⚙ Backend Stack

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* MySQL
* Maven
* Docker
* Gmail SMTP Integration
* Scheduled Notification Services
* RESTful API Architecture
* DTO Pattern
* Layered Service Architecture

---

# ☁️ Production Deployment

CogniHaven is fully deployed using a modern cloud architecture.

## Infrastructure

* Frontend Hosting: Vercel
* Backend Hosting: Render
* Database Hosting: Railway MySQL
* Backend Containerization: Docker
* Email Delivery: Gmail SMTP
* Custom Domain: cognihaven.net

## Production Features

* Live Custom Domain
* Email Verification
* Password Reset
* Secure Authentication
* Live Database Persistence
* Production Environment Variables
* Backend Health Check Endpoint
* React Router Refresh Support Through Vercel Rewrites

---

# 🔮 Future Roadmap

## AI Awareness Expansion

* Deeper AI Context Awareness
* Improved Memory Relevance
* Better Long-Term Personalization
* More Natural AI Recommendations

## Journal Reminder Improvements

* Fix Journal Reminder Spam
* Move Toward Once-Per-Day Journal Reminder Logic
* Recommended Behavior: 7 PM Daily Reminder If User Has Not Journaled

## Goal System Evolution

* AI Goal Planning
* Goal Coaching
* Milestone Rewards
* Consistency Analytics

## Analytics Dashboard Improvements

* More Advanced Visualizations
* More Personalized AI Insights
* Deeper Trend Analysis
* Usage Analytics

## Dietary Wellness Expansion

* Wellness Nutrition Tracking
* Hydration Tracking
* Healthy Habit Reinforcement
* AI Dietary Wellness Summaries

## Memory Reinforcement Expansion

* Favorite Things Tracking
* Meaningful Memories
* AI Memory Relevance System
* Memory Timeline

## Community Expansion

* Community Wins
* Reaction Analytics
* Wellness Circles
* Positive Contribution Recognition

## Engineering Improvements

* Automated Testing
* CI/CD Pipelines
* Monitoring & Logging
* AWS/Azure Cloud Learning
* Production Observability

---

# 🎯 Project Positioning

CogniHaven is intentionally positioned as:

**"A calm, AI-powered cognitive wellness and daily support platform."**

The platform is designed to support:

* Cognitive Wellness
* Reflection
* Memory Reinforcement
* Healthy Routines
* Medication Support
* Goal Progress
* Emotional Support
* Community Engagement
* Analytics Awareness
* Personal Growth
* Daily Encouragement

CogniHaven is **not intended as a medical diagnostic platform and does not provide medical advice.**
