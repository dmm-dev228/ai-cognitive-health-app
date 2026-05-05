import { Routes, Route, Link } from "react-router-dom";
import JournalPage from "./pages/JournalPage";
import MemoryProfilePage from "./pages/MemoryProfilePage";
import LoginPage from "./pages/LoginPage";
import { logoutUser, isLoggedIn } from "./services/api";
import SignUpPage from "./pages/SignUpPage";
import DietaryProfilePage from "./pages/DietaryProfilePage";
import MedicationReminderPage from "./pages/MedicationReminderPage";

function App() {
  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
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
        <Link to="/medication">Medication</Link> |

        {isLoggedIn() && <button onClick={handleLogout}>Logout</button>}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<p>Welcome to CogniHaven</p>} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/memory" element={<MemoryProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dietary" element={<DietaryProfilePage />} />
        <Route path="/medication" element={<MedicationReminderPage />} />
      </Routes>
    </main>
  );
}

export default App;