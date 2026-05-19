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
import CommunityPage from "./pages/CommunityPage";
import MyGoalsPage from "./pages/MyGoalsPage";
import "./index.css";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  // Controls app-wide dark mode styling.
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      : isDarkMode
        ? "text-slate-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
        : "text-slate-600 hover:-translate-y-0.5 hover:bg-white hover:text-indigo-700 hover:shadow-sm"
    }`;

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-emerald-950 text-slate-100"
        : "bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50 text-slate-800"
        }`}
    >
      {/* Soft background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header / Navbar */}
        <header
          className={`sticky top-0 z-40 border-b shadow-sm backdrop-blur-xl transition-colors duration-300 ${isDarkMode
            ? "border-white/10 bg-slate-950/75 shadow-black/30"
            : "border-white/60 bg-white/75 shadow-slate-200/40"
            }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* Brand area */}
              <Link to="/" className="group flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 text-xl font-black text-white shadow-lg shadow-indigo-200 transition group-hover:scale-105">
                  CH
                </div>

                <div>
                  <h1
                    className={`text-2xl font-black tracking-tight sm:text-3xl ${isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                  >
                    Cogni<span className="text-indigo-500">Haven</span>
                  </h1>
                  <p
                    className={`text-xs font-medium sm:text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                  >
                    AI-powered cognitive wellness and daily support.
                  </p>
                </div>
              </Link>

              {/* Navigation links */}
              <nav className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <NavLink to="/" className={navLinkClass}>
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
                  <NavLink to="/community" className={navLinkClass}>
                    Community
                  </NavLink>
                  <NavLink to="/goals" className={navLinkClass}>
                    MyGoals
                  </NavLink>
                </div>

                {/* Auth actions are separated from primary navigation for cleaner UX. */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsDarkMode((prev) => !prev)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode
                      ? "bg-slate-800 text-yellow-200 hover:bg-slate-700"
                      : "bg-white text-slate-700 hover:text-indigo-700"
                      }`}
                  >
                    {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                  </button>

                  {!isLoggedIn() && (
                    <>
                      <NavLink
                        to="/login"
                        className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDarkMode
                          ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                          : "border-indigo-100 bg-white text-indigo-700"
                          }`}
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
                        className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDarkMode
                          ? "border-white/10 bg-white/10 text-slate-200 hover:bg-white/15"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700"
                          }`}
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
                        A calm daily space for reflection, routines, and
                        supportive AI insights.
                      </h2>

                      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
                        CogniHaven is a calm, AI-powered wellness ecosystem focused on reflection,
                        cognitive engagement, supportive routines, community encouragement, goal
                        tracking, and emotionally safe AI-guided insights.
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
                  <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      {
                        icon: "✍️",
                        title: "Daily Reflection",
                        text: "Write journal entries and receive supportive AI reflections.",
                        color: "bg-indigo-50",
                      },
                      {
                        icon: "🧠",
                        title: "Cognitive Games",
                        text: "Practice memory and attention with interactive activities.",
                        color: "bg-violet-50",
                      },
                      {
                        icon: "🎯",
                        title: "MyGoals",
                        text: "Create AI-supported goals, log progress, and celebrate milestones.",
                        color: "bg-amber-50",
                      },
                      {
                        icon: "💜",
                        title: "Community",
                        text: "Share routines, reflections, encouragement, and wellness tips.",
                        color: "bg-pink-50",
                      },
                      {
                        icon: "💊",
                        title: "Medication Reminders",
                        text: "Create supportive reminder schedules with in-app and email alerts.",
                        color: "bg-emerald-50",
                      },
                      {
                        icon: "📊",
                        title: "Wellness Analytics",
                        text: "Track scores, trends, progress, and AI-generated summaries.",
                        color: "bg-sky-50",
                      },
                    ].map((feature) => (
                      <div
                        key={feature.title}
                        className={`rounded-3xl p-6 shadow-lg transition hover:-translate-y-1 ${isDarkMode
                          ? "border border-white/10 bg-white/10 text-white backdrop-blur-xl"
                          : "glass-card"
                          }`}
                      >
                        <div
                          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} text-3xl`}
                        >
                          {feature.icon}
                        </div>

                        <h3
                          className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"
                            }`}
                        >
                          {feature.title}
                        </h3>

                        <p
                          className={`mt-3 text-sm leading-6 ${isDarkMode ? "text-slate-300" : "text-slate-600"
                            }`}
                        >
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </section>

                  {/* Product Story / Value Section */}
                  <section className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
                    <div
                      className={`rounded-[2rem] p-8 ${isDarkMode
                        ? "border border-white/10 bg-white/10 backdrop-blur-xl"
                        : "glass-card"
                        }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
                        Why CogniHaven
                      </p>

                      <h3
                        className={`mt-3 text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                      >
                        Designed to feel supportive, simple, and non-clinical.
                      </h3>

                      <p
                        className={`mt-4 text-sm leading-7 ${isDarkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                      >
                        CogniHaven brings together reflection, wellness
                        routines, memory reinforcement, and AI-guided insights
                        in one calming experience. The goal is to help users
                        stay engaged with daily support tools without feeling
                        overwhelmed.
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[
                          ["AI", "Supportive insights", "text-indigo-600"],
                          ["24/7", "Daily support space", "text-emerald-600"],
                          ["Calm", "Wellness-first design", "text-violet-600"],
                        ].map(([big, small, color]) => (
                          <div
                            key={big}
                            className={`rounded-3xl p-5 shadow-sm ${isDarkMode ? "bg-white/10" : "bg-white"
                              }`}
                          >
                            <p className={`text-3xl font-black ${color}`}>
                              {big}
                            </p>
                            <p
                              className={`mt-2 text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"
                                }`}
                            >
                              {small}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
                      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
                      <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

                      <div className="relative z-10">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                          Experience Flow
                        </p>

                        <h3 className="mt-3 text-3xl font-bold tracking-tight">
                          Your daily wellness loop
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-white/60">
                          CogniHaven connects reflection, routines, goals, community, and insights
                          into one supportive experience.
                        </p>

                        <div className="relative mt-8 space-y-5">
                          <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-indigo-400 via-emerald-400 to-violet-400" />

                          {[
                            {
                              icon: "✍️",
                              title: "Reflect",
                              text: "Write journal entries and receive supportive AI reflections.",
                            },
                            {
                              icon: "💊",
                              title: "Build routines",
                              text: "Stay consistent with reminders and daily support tools.",
                            },
                            {
                              icon: "🧠",
                              title: "Engage cognition",
                              text: "Practice memory with Pattern Recall and Story Recall.",
                            },
                            {
                              icon: "🎯",
                              title: "Track goals",
                              text: "Follow AI-supported plans and celebrate milestones.",
                            },
                            {
                              icon: "💜",
                              title: "Connect",
                              text: "Share encouragement and routines in the community space.",
                            },
                            {
                              icon: "📊",
                              title: "Review insights",
                              text: "Use analytics and AI summaries to understand progress.",
                            },
                          ].map((step, index) => (
                            <div
                              key={step.title}
                              className="group relative flex gap-4 rounded-3xl bg-white/5 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
                            >
                              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-lg">
                                {step.icon}
                              </div>

                              <div>
                                <p className="text-sm font-bold text-white">
                                  {index + 1}. {step.title}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-white/65">
                                  {step.text}
                                </p>
                              </div>
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
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/goals" element={<MyGoalsPage />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

export default App;