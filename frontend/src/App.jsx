import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CogniHavenLogo from "./components/CogniHavenLogo";
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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import IdleSessionManager from "./components/IdleSessionManager";
import Navbar from "./components/Navbar";
import UnifiedNotificationSystem from "./components/UnifiedNotificationSystem";
import FeedbackCard from "./components/FeedbackCard";
import VerifyEmailChangePage from "./pages/VerifyEmailChangePage";
import ToastProvider from "./components/notifications/ToastProvider";

import {
  logoutUser,
  isLoggedIn,
  getNotifications,
  deleteAccount,
} from "./services/api";

import "./index.css";

// Prevents the journal reminder popup from showing more than once per day.
const shouldShowJournalReminderToday = () => {
  const today = new Date().toISOString().split("T")[0];
  const lastShownDate = localStorage.getItem("journalReminderShownDate");

  return lastShownDate !== today;
};

// Marks today's journal reminder as shown.
const markJournalReminderShownToday = () => {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("journalReminderShownDate", today);
};

function App() {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("cognihavenDarkMode") === "true";
  });

  /*
   * Fetch in-app notifications for the logged-in user.
   * These are displayed through the unified notification popup system.
   */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!isLoggedIn()) {
          setVisibleNotifications([]);
          return;
        }

        const data = await getNotifications();
        const notifications = Array.isArray(data) ? data : [];

        const filteredNotifications = notifications.filter((notification) => {
          if (notification.type !== "JOURNAL") {
            return true;
          }

          return shouldShowJournalReminderToday();
        });

        if (
          filteredNotifications.some(
            (notification) => notification.type === "JOURNAL"
          )
        ) {
          markJournalReminderShownToday();
        }

        setVisibleNotifications(filteredNotifications);

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

  // Saves dark mode so refresh/login does not reset it.
  useEffect(() => {
    localStorage.setItem("cognihavenDarkMode", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteAccount();

      logoutUser();
      window.location.href = "/signup";
    } catch (err) {
      console.error("Delete account failed:", err);
      alert(
        "Could not delete your account. Please check the console/backend logs."
      );
    }
  };

  return (
    <ToastProvider>
      <main
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "dark bg-gradient-to-br from-slate-950 via-indigo-950 to-emerald-950 text-slate-100"
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

          {isLoggedIn() && <IdleSessionManager />}

          {/*
           * Main route container.
           *
           * Mobile uses tighter spacing so content does not feel
           * pushed away from the navigation bar.
           */}
          <section className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="animate-fade-in space-y-6 sm:space-y-8 lg:space-y-10">
                    {/* =====================================================
                        HERO SECTION
                        ===================================================== */}
                    <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 px-5 py-8 text-white shadow-xl shadow-indigo-200/60 sm:rounded-[2rem] sm:px-8 sm:py-12 lg:rounded-[2.5rem] lg:px-16 lg:py-16 lg:shadow-2xl lg:shadow-indigo-200">
                      {/* Decorative background glows */}
                      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-float" />
                      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-200/20 blur-3xl animate-float" />

                      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_350px] lg:gap-10">
                        <div>
                          <p className="inline-flex rounded-full bg-white/15 px-3 py-2 text-xs font-semibold leading-5 backdrop-blur sm:px-4 sm:text-sm">
                            AI-powered cognitive wellness platform
                          </p>

                          <h2 className="mt-5 max-w-4xl text-3xl font-black leading-[1.12] tracking-tight min-[390px]:text-4xl sm:mt-7 sm:text-5xl lg:mt-8 lg:text-6xl">
                            A calm daily space for reflection, routines, and
                            supportive AI insights.
                          </h2>

                          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
                            CogniHaven is a calm, AI-powered wellness ecosystem
                            focused on reflection, cognitive engagement,
                            supportive routines, community encouragement, goal
                            tracking, and emotionally safe AI-guided insights.
                          </p>

                          {/* Hero actions */}
                          <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
                            <Link
                              to="/signup"
                              className="w-full rounded-2xl bg-white px-6 py-3 text-center text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                            >
                              Get Started
                            </Link>

                            <Link
                              to="/journal"
                              className="w-full rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                            >
                              Open Journal
                            </Link>
                          </div>
                        </div>

                        {/* Large decorative logo for desktop */}
                        <div className="hidden justify-center lg:flex">
                          <CogniHavenLogo className="h-85 w-85 object-contain animate-float drop-shadow-2xl" />
                        </div>
                      </div>
                    </section>

                    {/* =====================================================
                        FEATURE CARDS
                        ===================================================== */}
                    <section className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
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
                          title: "My Goals",
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
                          className={`rounded-[1.5rem] p-5 shadow-lg transition hover:-translate-y-1 sm:rounded-3xl sm:p-6 ${
                            isDarkMode
                              ? "border border-white/10 bg-white/10 text-white backdrop-blur-xl"
                              : "glass-card"
                          }`}
                        >
                          <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl sm:mb-5 sm:h-14 sm:w-14 sm:text-3xl ${feature.color}`}
                          >
                            {feature.icon}
                          </div>

                          <h3
                            className={`text-lg font-bold sm:text-xl ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {feature.title}
                          </h3>

                          <p
                            className={`mt-2 text-sm leading-6 sm:mt-3 ${
                              isDarkMode ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {feature.text}
                          </p>
                        </div>
                      ))}
                    </section>

                    {/* =====================================================
                        PRODUCT STORY / EXPERIENCE FLOW
                        ===================================================== */}
                    <section className="grid items-start gap-6 lg:grid-cols-[1fr_0.85fr] lg:gap-8">
                      {/* Why CogniHaven */}
                      <div
                        className={`rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8 ${
                          isDarkMode
                            ? "border border-white/10 bg-white/10 backdrop-blur-xl"
                            : "glass-card"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500 sm:text-sm sm:tracking-[0.25em]">
                          Why CogniHaven
                        </p>

                        <h3
                          className={`mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          Designed to feel supportive, simple, and non-clinical.
                        </h3>

                        <p
                          className={`mt-4 text-sm leading-7 ${
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          CogniHaven brings together reflection, wellness
                          routines, memory reinforcement, and AI-guided insights
                          in one calming experience. The goal is to help users
                          stay engaged with daily support tools without feeling
                          overwhelmed.
                        </p>

                        {/* Product highlights */}
                        <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
                          {[
                            ["AI", "Supportive insights", "text-indigo-600"],
                            ["24/7", "Daily support space", "text-emerald-600"],
                            ["Calm", "Wellness-first design", "text-violet-600"],
                          ].map(([big, small, color]) => (
                            <div
                              key={big}
                              className={`rounded-2xl p-4 shadow-sm sm:rounded-3xl sm:p-5 ${
                                isDarkMode ? "bg-white/10" : "bg-white"
                              }`}
                            >
                              <p
                                className={`text-2xl font-black sm:text-3xl ${color}`}
                              >
                                {big}
                              </p>

                              <p
                                className={`mt-1.5 text-sm font-semibold sm:mt-2 ${
                                  isDarkMode
                                    ? "text-slate-200"
                                    : "text-slate-700"
                                }`}
                              >
                                {small}
                              </p>
                            </div>
                          ))}
                        </div>

                        <FeedbackCard isDarkMode={isDarkMode} />
                      </div>

                      {/* Experience Flow */}
                      <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-900 p-5 text-white shadow-xl sm:rounded-[2rem] sm:p-8">
                        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
                        <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

                        <div className="relative z-10">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-sm sm:tracking-[0.25em]">
                            Experience Flow
                          </p>

                          <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                            Your daily wellness loop
                          </h3>

                          <p className="mt-3 text-sm leading-7 text-white/60">
                            CogniHaven connects reflection, routines, goals,
                            community, and insights into one supportive
                            experience.
                          </p>

                          <div className="relative mt-6 space-y-3 sm:mt-8 sm:space-y-5">
                            {/* Timeline line */}
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
                                className="group relative flex gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10 sm:gap-4 sm:rounded-3xl sm:p-4"
                              >
                                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-lg">
                                  {step.icon}
                                </div>

                                <div className="min-w-0">
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
              <Route
                path="/medication"
                element={<MedicationReminderPage />}
              />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/games" element={<GamePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/goals" element={<MyGoalsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
              />
              <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/verify-email-change"
                element={<VerifyEmailChangePage />}
              />
            </Routes>
          </section>
        </div>
      </main>
    </ToastProvider>
  );
}

export default App;