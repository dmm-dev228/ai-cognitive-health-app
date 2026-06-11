import { useEffect, useRef, useState } from "react";
import { isLoggedIn, logoutUser } from "../services/api";

/*
 * IdleSessionManager
 * ------------------
 * Logs users out after inactivity for privacy/security.
 *
 * Flow:
 * - User-selected idle time passes
 * - Warning countdown appears
 * - Logout deadline is stored with an absolute timestamp
 * - If browser throttles timers while tab is hidden, user is logged out
 *   immediately when they return after the deadline
 */
function IdleSessionManager() {
  const DEFAULT_IDLE_LIMIT_MS = 15 * 60 * 1000;
  const WARNING_SECONDS = 60;
  const LOGOUT_AT_KEY = "idleSessionLogoutAt";

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_SECONDS);

  const lastActivityRef = useRef(Date.now());
  const showWarningRef = useRef(false);
  const inactivityCheckerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn()) return;

    const getIdleLimit = () => {
      const savedTimeout = sessionStorage.getItem("sessionTimeoutMinutes");

      if (!savedTimeout) return DEFAULT_IDLE_LIMIT_MS;
      if (savedTimeout === "never") return null;

      return Number(savedTimeout) * 60 * 1000;
    };

    const clearTimers = () => {
      clearInterval(inactivityCheckerRef.current);
      clearInterval(countdownTimerRef.current);
    };

    const logoutAndRedirect = () => {
      clearTimers();
      sessionStorage.removeItem(LOGOUT_AT_KEY);
      logoutUser();
      window.location.href = "/login";
    };

    const syncCountdownWithLogoutDeadline = () => {
      const logoutAt = Number(sessionStorage.getItem(LOGOUT_AT_KEY));

      if (!logoutAt) return;

      const remainingMs = logoutAt - Date.now();

      if (remainingMs <= 0) {
        logoutAndRedirect();
        return;
      }

      setSecondsLeft(Math.ceil(remainingMs / 1000));
    };

    const startCountdown = () => {
      if (showWarningRef.current) return;

      const logoutAt = Date.now() + WARNING_SECONDS * 1000;

      sessionStorage.setItem(LOGOUT_AT_KEY, String(logoutAt));

      showWarningRef.current = true;
      setShowWarning(true);
      setSecondsLeft(WARNING_SECONDS);

      countdownTimerRef.current = setInterval(() => {
        syncCountdownWithLogoutDeadline();
      }, 1000);
    };

    const recordActivity = () => {
      if (!isLoggedIn()) return;

      if (showWarningRef.current) return;

      lastActivityRef.current = Date.now();
    };

    const startInactivityChecker = () => {
      clearInterval(inactivityCheckerRef.current);

      const idleLimit = getIdleLimit();

      if (idleLimit === null) return;

      inactivityCheckerRef.current = setInterval(() => {
        if (!isLoggedIn()) {
          clearTimers();
          return;
        }

        if (showWarningRef.current) {
          syncCountdownWithLogoutDeadline();
          return;
        }

        const inactiveFor = Date.now() - lastActivityRef.current;

        if (inactiveFor >= idleLimit) {
          startCountdown();
        }
      }, 1000);
    };

    const handleVisibilityOrFocusReturn = () => {
      if (!isLoggedIn()) return;

      const logoutAt = Number(sessionStorage.getItem(LOGOUT_AT_KEY));

      if (logoutAt && Date.now() >= logoutAt) {
        logoutAndRedirect();
        return;
      }

      if (logoutAt && showWarningRef.current) {
        syncCountdownWithLogoutDeadline();
      }
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, recordActivity);
    });

    document.addEventListener("visibilitychange", handleVisibilityOrFocusReturn);
    window.addEventListener("focus", handleVisibilityOrFocusReturn);

    window.resetIdleSessionTimer = () => {
      clearTimers();
      sessionStorage.removeItem(LOGOUT_AT_KEY);

      showWarningRef.current = false;
      setShowWarning(false);
      setSecondsLeft(WARNING_SECONDS);

      lastActivityRef.current = Date.now();
      startInactivityChecker();
    };

    lastActivityRef.current = Date.now();
    startInactivityChecker();

    return () => {
      clearTimers();

      activityEvents.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityOrFocusReturn
      );

      window.removeEventListener("focus", handleVisibilityOrFocusReturn);

      delete window.resetIdleSessionTimer;
    };
  }, []);

  const staySignedIn = () => {
    if (window.resetIdleSessionTimer) {
      window.resetIdleSessionTimer();
    }
  };

  const logoutNow = () => {
    sessionStorage.removeItem("idleSessionLogoutAt");
    logoutUser();
    window.location.href = "/login";
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
          For your privacy, CogniHaven will sign you out and return you to the
          login page in{" "}
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