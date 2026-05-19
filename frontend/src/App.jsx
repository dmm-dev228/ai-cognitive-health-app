import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import JournalPage from "./pages/JournalPage";
import MemoryProfilePage from "./pages/MemoryProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DietaryProfilePage from "./pages/DietaryProfilePage";
import MedicationReminderPage from "./pages/MedicationReminderPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import GamePage from "./pages/GamePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CommunityPage from "./pages/CommunityPage";
import MyGoalsPage from "./pages/MyGoalsPage";
import AchievementsPage from "./pages/AchievementsPage";

import Navbar from "./components/Navbar";
import UnifiedNotificationSystem from "./components/UnifiedNotificationSystem";
import {
  logoutUser,
  isLoggedIn,
  getNotifications,
  deleteAccount
} from "./services/api";

import "./index.css";

function App() {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!isLoggedIn()) {
          setVisibleNotifications([]);
          return;
        }

        const data = await getNotifications();
        const notifications = Array.isArray(data) ? data : [];

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
    <main
      className={`min-h-screen transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-emerald-950 text-slate-100"
        : "bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50 text-slate-800"
        }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          handleLogout={handleLogout}
          handleDeleteAccount={handleDeleteAccount}
        />

        {isLoggedIn() && (
          <UnifiedNotificationSystem
            visibleNotifications={visibleNotifications}
            setVisibleNotifications={setVisibleNotifications}
          />
        )}
        
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="animate-fade-in space-y-10">
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
                        CogniHaven is a calm, AI-powered wellness ecosystem
                        focused on reflection, cognitive engagement,
                        supportive routines, community encouragement, goal
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

                  <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      {
                        icon: "✍️",
                        title: "Daily Reflection",
                        text: "Write journal entries and receive supportive AI reflections.",
                        color: "bg-indigo-50"
                      },
                      {
                        icon: "🧠",
                        title: "Cognitive Games",
                        text: "Practice memory and attention with interactive activities.",
                        color: "bg-violet-50"
                      },
                      {
                        icon: "🎯",
                        title: "MyGoals",
                        text: "Create AI-supported goals, log progress, and celebrate milestones.",
                        color: "bg-amber-50"
                      },
                      {
                        icon: "💜",
                        title: "Community",
                        text: "Share routines, reflections, encouragement, and wellness tips.",
                        color: "bg-pink-50"
                      },
                      {
                        icon: "💊",
                        title: "Medication Reminders",
                        text: "Create supportive reminder schedules with in-app and email alerts.",
                        color: "bg-emerald-50"
                      },
                      {
                        icon: "📊",
                        title: "Wellness Analytics",
                        text: "Track scores, trends, progress, and AI-generated summaries.",
                        color: "bg-sky-50"
                      }
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
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

export default App;