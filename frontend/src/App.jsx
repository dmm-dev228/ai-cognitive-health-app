import { Routes, Route, Link } from "react-router-dom";
import JournalPage from "./pages/JournalPage";
import MemoryProfilePage from "./pages/MemoryProfilePage";

function App() {
  return (
    <main>
      <h1>CogniCare</h1>

      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/journal">Journal</Link> |{" "}
        <Link to="/memory">Memory Profile</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<p>Welcome to CogniCare</p>} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/memory" element={<MemoryProfilePage />} />
      </Routes>
    </main>
  );
}

export default App;