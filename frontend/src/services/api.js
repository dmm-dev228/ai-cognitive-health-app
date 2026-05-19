const BASE_URL = "http://localhost:8080/api";

// Gets JWT from browser storage and adds it to protected backend requests
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

// ===== AUTH =====
export const loginUser = async (data) => {

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });

    return handleResponse(response);
};

// Verify Email
export const verifyEmail = async (token) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`, {
        method: "GET"
    });

    return response.json();
};

// Resend Verification Email
export const resendVerificationEmail = async (email) => {
    const response = await fetch(
        `${BASE_URL}/auth/resend-verification?email=${encodeURIComponent(email)}`,
        {
            method: "POST"
        }
    );

    return response.text();
};
// ===== USER =====
export const createUser = async (data) => {
    const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response.json();
};

// Delete User Account
export const deleteAccount = async () => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return response;
};

// ===== JOURNAL =====
export const createJournalEntry = async (data) => {
    const response = await fetch(`${BASE_URL}/journal`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return response.json();
};

export const getJournalEntries = async () => {
    const response = await fetch(`${BASE_URL}/journal`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return response.json();
};

// ===== MEMORY PROFILE =====
export const saveMemoryProfile = async (data) => {
    const response = await fetch(`${BASE_URL}/memory-profile`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return response.json();
};

export const getMemoryProfile = async () => {
    const response = await fetch(`${BASE_URL}/memory-profile`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return response.json();
};

// ===== AI ANALYSIS =====
export const generateJournalReflection = async (journalEntryId) => {
    const response = await fetch(`${BASE_URL}/ai-analysis/journal/${journalEntryId}`, {
        method: "POST",
        headers: getAuthHeaders()
    });

    return response.json();
};

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        console.error("API error:", response.status, data);
    }

    return data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
};

export const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
};

// Fetches all conversation messages (USER + AI) for a specific journal entry
// This powers the chat-style UI for each journal
export const getConversationMessages = async (journalEntryId) => {

    // Send GET request to backend endpoint using journalEntryId
    const response = await fetch(
        `${BASE_URL}/conversation-messages/journal/${journalEntryId}`,
        {
            method: "GET",

            // Include JWT token for authentication
            headers: getAuthHeaders()
        }
    );

    // If request fails, throw error for debugging
    if (!response.ok) {
        throw new Error("Failed to fetch conversation messages");
    }

    // Return parsed JSON (array of messages)
    return response.json();
};

// Sends a follow-up message to a specific journal thread.
// Backend saves USER message, generates AI reply, and returns full updated thread.
export const addConversationMessage = async (journalEntryId, message) => {
    const response = await fetch(
        `${BASE_URL}/conversation-messages/journal/${journalEntryId}`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ message })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to send conversation message");
    }

    return response.json();
};


// Generate a supportive AI reflection for a completed game.

export const generateGameReflection = async (gameResultId) => {
    const response = await fetch(
        `${BASE_URL}/ai-analysis/game/${gameResultId}`,
        {
            method: "POST",
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate game reflection");
    }

    return response.json();
};

// ===== DIETARY PROFILE =====

// Save or update dietary profile (JWT-based)
export const saveDietaryProfile = async (data) => {
    const response = await fetch(`${BASE_URL}/dietary-profile`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return response.json();
};

// Get dietary profile for current user
export const getDietaryProfile = async () => {
    const response = await fetch(`${BASE_URL}/dietary-profile`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return response.json();
};

// ===== MEDICATION REMINDERS =====

// Create reminder
export const createMedicationReminder = async (data) => {
    const response = await fetch(`${BASE_URL}/medication-reminders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return response.json();
};

// Get all reminders
export const getMedicationReminders = async () => {
    const response = await fetch(`${BASE_URL}/medication-reminders`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return response.json();
};

// Update reminder
export const updateMedicationReminder = async (id, data) => {
    const response = await fetch(`${BASE_URL}/medication-reminders/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return response.json();
};

// Delete reminder
export const deleteMedicationReminder = async (id) => {
    const response = await fetch(`${BASE_URL}/medication-reminders/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return response;
};

// Toggle active
export const toggleMedicationReminder = async (id) => {
    const response = await fetch(`${BASE_URL}/medication-reminders/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders()
    });

    return response.json();
};

export const getNotifications = async () => {
    const response = await fetch(`${BASE_URL}/notifications`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return response.json();
};

// ===== Game Results =====

/*
 * Save a completed cognitive game result.
 * JWT token automatically identifies the authenticated user.
 */
export const saveGameResult = async (data) => {
    const response = await fetch(`${BASE_URL}/game-results`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to save game result");
    }

    return response.json();
};

/*
 * Fetch all game results for the authenticated user.
 * Used later for:
 * - analytics dashboard
 * - AI performance context
 * - progress tracking
 */
export const getGameResults = async () => {
    const response = await fetch(`${BASE_URL}/game-results`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch game results");
    }

    return response.json();
};


// ===== Analytics AI =====

// Generate AI analytics summary.
export const generateAnalyticsSummary = async () => {
    const response = await fetch(
        `${BASE_URL}/ai-analysis/analytics-summary`,
        {
            method: "POST",
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate analytics summary");
    }

    return response.json();
};

// ===== Community =====

/*
 * Create a new community post.
 * JWT identifies the authenticated user.
 */
export const createCommunityPost = async (data) => {
    const response = await fetch(`${BASE_URL}/community`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create community post");
    }

    return response.json();
};

// Fetch all community posts newest first.
export const getCommunityPosts = async () => {
    const response = await fetch(`${BASE_URL}/community`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch community posts");
    }

    return response.json();
};

// ===== Goals =====

/*
 * Create a new wellness goal.
 * Backend uses JWT to attach the goal to the logged-in user.
 */
export const createGoal = async (data) => {
    const response = await fetch(`${BASE_URL}/goals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create goal");
    }

    return response.json();
};

// Fetch all goals for the logged-in user.
export const getGoals = async () => {
    const response = await fetch(`${BASE_URL}/goals`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch goals");
    }

    return response.json();
};

// Log progress toward a specific goal.
export const logGoalProgress = async (goalId, data) => {
    const response = await fetch(`${BASE_URL}/goals/${goalId}/logs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to log goal progress");
    }

    return response.json();
};


// ===== Achievements  =====

// Fetch unlocked achievements for the logged-in user.
export const getAchievements = async () => {
    const response = await fetch(`${BASE_URL}/achievements`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch achievements");
    }

    return response.json();
};