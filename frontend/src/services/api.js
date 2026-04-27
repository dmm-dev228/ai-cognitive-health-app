const BASE_URL = "http://localhost:8080/api";

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
export const createJournalEntry = async (userId, data) => {
  const response = await fetch(`${BASE_URL}/journal/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
};

export const getJournalEntries = async (userId) => {
  const response = await fetch(`${BASE_URL}/journal/${userId}`);
  return response.json();
};