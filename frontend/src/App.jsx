import { Routes, Route, Link, NavLink } from "react-router-dom";
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
import "./index.css";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  // Checks for in-app notifications after login and refreshes them every minute.
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!isLoggedIn()) {
          setNotifications([]);
          setVisibleNotifications([]);
          return;
        }

        const data = await getNotifications();
        const notifications = Array.isArray(data) ? data : [];

        setNotifications(notifications);
        setVisibleNotifications(notifications);

        // Auto-hide notification popup after a few seconds so it does not block the UI.
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

  // Reusable NavLink styling so every route has the same active and hover behavior.
  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
      : "text-slate-600 hover:-translate-y-0.5 hover:bg-white hover:text-indigo-700 hover:shadow-sm"
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50 text-slate-800">
      {/* Soft background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header / Navbar */}
        <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 shadow-sm shadow-slate-200/40 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* Brand area */}
              <Link to="/" className="group flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 text-xl font-black text-white shadow-lg shadow-indigo-200 transition group-hover:scale-105">
                  CH
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    Cogni<span className="text-indigo-600">Haven</span>
                  </h1>
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    AI-powered cognitive wellness and daily support.
                  </p>
                </div>
              </Link>

              {/* Navigation links */}
              <nav className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="flex flex-wrap items-center gap-2">                  <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                  <NavLink to="/journal" className={navLinkClass}>
                    Journal
                  </NavLink>
                  <NavLink to="/memory" className={navLinkClass}>
                    Memory
                  </NavLink>
                  <NavLink to="/dietary" className={navLinkClass}>
                    Dietary
                  </NavLink>
                  <NavLink to="/games" className={navLinkClass}>
                    Games
                  </NavLink>
                  <NavLink to="/medication" className={navLinkClass}>
                    Medication
                  </NavLink>
                  <NavLink to="/analytics" className={navLinkClass}>
                    Analytics
                  </NavLink>
                </div>

                {/* Auth actions are separated from primary navigation for cleaner UX. */}
                <div className="flex flex-wrap items-center gap-2">
                  {!isLoggedIn() && (
                    <>
                      <NavLink
                        to="/login"
                        className="rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Login
                      </NavLink>

                      <NavLink
                        to="/signup"
                        className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}

                  {isLoggedIn() && (
                    <>
                      <button
                        onClick={handleLogout}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
                      >
                        Logout
                      </button>

                      <button
                        onClick={handleDeleteAccount}
                        className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
                      >
                        Delete Account
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Notification popup */}
        {visibleNotifications.length > 0 && (
          <div className="fixed right-6 top-28 z-50 w-[calc(100%-3rem)] max-w-sm space-y-3">
            {visibleNotifications.map((n, index) => (
              <div
                key={index}
                className="animate-fade-in rounded-2xl border border-amber-200 bg-amber-50/95 p-4 shadow-xl shadow-amber-100 backdrop-blur"
              >
                <p className="text-sm font-semibold text-amber-900">
                  {n.type}
                </p>
                <p className="mt-1 text-sm text-amber-800">{n.message}</p>

                <div className="mt-3 flex items-center gap-3">
                  {n.actionUrl && (
                    <a
                      href={n.actionUrl}
                      className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
                    >
                      Go
                    </a>
                  )}

                  <button
                    onClick={() =>
                      setVisibleNotifications((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Page content */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="glass-card rounded-3xl p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    Welcome
                  </p>
                  <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    Your calm space for reflection, routines, and cognitive wellness.
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    CogniHaven helps support daily reflection, healthy habits,
                    reminders, cognitive engagement, and AI-guided insights in a
                    warm, non-clinical experience.
                  </p>
                </div>
              }
            />
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
        </section>
      </div>
    </main>
  );
}

export default App;