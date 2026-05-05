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