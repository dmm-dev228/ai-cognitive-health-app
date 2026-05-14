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
                <div className="animate-fade-in space-y-10">
                  {/* Hero Section */}
                  <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 px-8 py-16 text-white shadow-2xl shadow-indigo-200 sm:px-12 lg:px-16">
                    <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-float" />
                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-200/20 blur-3xl animate-float" />

                    <div className="relative z-10 max-w-4xl">
                      <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                        AI-powered cognitive wellness platform
                      </p>

                      <h2 className="mt-8 max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
                        A calm daily space for reflection, routines, and supportive AI insights.
                      </h2>

                      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
                        CogniHaven helps users build healthier daily habits through
                        journaling, reminders, cognitive engagement, wellness profiles,
                        analytics, and warm AI-guided support.
                      </p>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                          to="/signup"
                          className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                          Get Started
                        </Link>

                        <Link
                          to="/journal"
                          className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                        >
                          Open Journal
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* Feature Cards */}
                  <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        icon: "✍️",
                        title: "Daily Reflection",
                        text: "Write journal entries and receive supportive AI reflections.",
                        color: "bg-indigo-50",
                      },
                      {
                        icon: "💊",
                        title: "Routine Reminders",
                        text: "Create medication and wellness reminders for consistency.",
                        color: "bg-emerald-50",
                      },
                      {
                        icon: "🧠",
                        title: "Cognitive Games",
                        text: "Practice memory and attention with interactive activities.",
                        color: "bg-violet-50",
                      },
                      {
                        icon: "📊",
                        title: "Wellness Analytics",
                        text: "Track progress with charts, summaries, and AI insights.",
                        color: "bg-sky-50",
                      },
                    ].map((feature) => (
                      <div
                        key={feature.title}
                        className="glass-card rounded-3xl p-6 hover-lift"
                      >
                        <div
                          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} text-3xl`}
                        >
                          {feature.icon}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {feature.title}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </section>

                  {/* Product Story / Value Section */}
                  <section className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
                    <div className="glass-card rounded-[2rem] p-8">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
                        Why CogniHaven
                      </p>

                      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        Designed to feel supportive, simple, and non-clinical.
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        CogniHaven brings together reflection, wellness routines, memory
                        reinforcement, and AI-guided insights in one calming experience.
                        The goal is to help users stay engaged with daily support tools
                        without feeling overwhelmed.
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                          <p className="text-3xl font-black text-indigo-600">AI</p>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            Supportive insights
                          </p>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                          <p className="text-3xl font-black text-emerald-600">24/7</p>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            Daily support space
                          </p>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                          <p className="text-3xl font-black text-violet-600">Calm</p>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            Wellness-first design
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
                      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
                      <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

                      <div className="relative z-10">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                          Experience Flow
                        </p>

                        <div className="mt-8 space-y-5">
                          {[
                            "Reflect in your journal",
                            "Receive supportive AI insight",
                            "Stay consistent with reminders",
                            "Practice with cognitive games",
                            "Review progress in analytics",
                          ].map((step, index) => (
                            <div key={step} className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold">
                                {index + 1}
                              </div>

                              <p className="text-sm font-semibold text-white/85">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
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