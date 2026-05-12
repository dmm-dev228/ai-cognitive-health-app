import { Routes, Route, Link } from "react-router-dom";
import JournalPage from "./pages/JournalPage";
import MemoryProfilePage from "./pages/MemoryProfilePage";
import LoginPage from "./pages/LoginPage";
import { logoutUser, isLoggedIn } from "./services/api";
import SignUpPage from "./pages/SignUpPage";
import DietaryProfilePage from "./pages/DietaryProfilePage";
import MedicationReminderPage from "./pages/MedicationReminderPage";
import { useEffect, useState } from "react";
import { getNotifications } from "./services/api";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { deleteAccount } from "./services/api";
import GamePage from "./pages/GamePage";
import AnalyticsPage from "./pages/AnalyticsPage";


function App() {
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!isLoggedIn()) {
          setNotifications([]);
          setVisibleNotifications([]);
          return;
        }

        const data = await getNotifications();

        console.log("NOTIFICATION DATA:", data);

        const notifications = Array.isArray(data) ? data : [];

        console.log("VISIBLE NOTIFICATIONS:", notifications);

        setNotifications(notifications);
        setVisibleNotifications(notifications);

        setTimeout(() => {
          setVisibleNotifications([]);
        }, 8000);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, []);
  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    await deleteAccount();

    logoutUser();
    window.location.href = "/signup";
  };
  return (
    <main>
      <h1>CogniHaven</h1>
      <p>A safe, AI-powered space for cognitive wellness, reflection, and daily support.</p>

      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/signup">Sign Up</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/journal">Journal</Link> |{" "}
        <Link to="/memory">Memory Profile</Link> |{" "}
        <Link to="/dietary">Dietary Profile</Link> |{" "}
        <Link to="/games">Games</Link> |{" "}
        <Link to="/medication">Medication</Link> | 
        <Link to="/analytics">Analytics</Link>


        {isLoggedIn() && (
          <>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </>
        )}
      </nav>
      {visibleNotifications.length > 0 && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#fff3cd",
          padding: "12px",
          border: "1px solid #ffeeba",
          borderRadius: "8px",
          zIndex: 1000,
          maxWidth: "350px"
        }}>
          {visibleNotifications.map((n, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <strong>{n.type}:</strong> {n.message}

              <div>
                {n.actionUrl && (
                  <a href={n.actionUrl} style={{ marginRight: "10px" }}>
                    Go
                  </a>
                )}

                <button
                  onClick={() =>
                    setVisibleNotifications((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Routes */}
      <Routes>
        <Route path="/" element={<p>Welcome to CogniHaven</p>} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/memory" element={<MemoryProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dietary" element={<DietaryProfilePage />} />
        <Route path="/medication" element={<MedicationReminderPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </main>
  );
}

export default App;