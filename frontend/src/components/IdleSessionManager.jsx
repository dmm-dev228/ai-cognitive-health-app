import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../services/api";

/*
 * IdleSessionManager
 * ------------------
 * Logs users out after inactivity for privacy/security.
 *
 * Flow:
 * - 15 minutes inactive → warning popup
 * - 60 second countdown
 * - user can stay signed in
 * - no response → logout
 */
function IdleSessionManager() {
  const navigate = useNavigate();

  const IDLE_LIMIT_MS = 15 * 60 * 1000;
  const WARNING_SECONDS = 60;

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_SECONDS);

  useEffect(() => {
    if (!isLoggedIn()) return;

    let idleTimer;
    let countdownTimer;

    const clearTimers = () => {
      clearTimeout(idleTimer);
      clearInterval(countdownTimer);
    };

    const logoutDueToIdle = () => {
      clearTimers();
      logoutUser();
      navigate("/login");
    };

    const startCountdown = () => {
      setShowWarning(true);
      setSecondsLeft(WARNING_SECONDS);

      countdownTimer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            logoutDueToIdle();
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    };

    const resetIdleTimer = () => {
      if (!isLoggedIn()) return;

      clearTimers();
      setShowWarning(false);
      setSecondsLeft(WARNING_SECONDS);

      idleTimer = setTimeout(() => {
        startCountdown();
      }, IDLE_LIMIT_MS);
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart"
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      clearTimers();

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [navigate]);

  const staySignedIn = () => {
    setShowWarning(false);
    setSecondsLeft(WARNING_SECONDS);
    window.dispatchEvent(new Event("mousemove"));
  };

  const logoutNow = () => {
    logoutUser();
    navigate("/login");
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-2xl shadow-slate-900/20">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-3xl">
          ⏳
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
          Session Timeout
        </p>

        <h2 className="mt-3 text-2xl font-black text-slate-900">
          Are you still there?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          For your privacy, CogniHaven will sign you out in{" "}
          <span className="font-bold text-amber-600">{secondsLeft}</span>{" "}
          seconds.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={staySignedIn}
            className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
          >
            Stay Signed In
          </button>

          <button
            onClick={logoutNow}
            className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default IdleSessionManager;