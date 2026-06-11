import { useEffect, useRef, useState } from "react";
import { isLoggedIn, logoutUser } from "../services/api";

/*
 * IdleSessionManager
 * ------------------
 * Logs users out after inactivity for privacy/security.
 *
 * Important behavior:
 * - Tracks the actual time of last activity.
 * - Checks inactivity every second.
 * - Timer continues even if the user walks away and does nothing.
 * - Once the warning appears, mouse movement does NOT dismiss it.
 * - User must click Stay Signed In or Log Out.
 */
function IdleSessionManager() {
  const DEFAULT_IDLE_LIMIT_MS = 15 * 60 * 1000;
  const WARNING_SECONDS = 60;

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_SECONDS);

  const lastActivityRef = useRef(Date.now());
  const inactivityCheckerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const showWarningRef = useRef(false);

  const getIdleLimit = () => {
    const savedTimeout = sessionStorage.getItem("sessionTimeoutMinutes");

    if (!savedTimeout) {
      return DEFAULT_IDLE_LIMIT_MS;
    }

    if (savedTimeout === "never") {
      return null;
    }

    return Number(savedTimeout) * 60 * 1000;
  };

  const clearTimers = () => {
    clearInterval(inactivityCheckerRef.current);
    clearInterval(countdownTimerRef.current);
  };

  const returnToHomeAfterLogout = () => {
    clearTimers();
    logoutUser();
    window.location.href = "/";
  };

  const startCountdown = () => {
    if (showWarningRef.current) return;

    showWarningRef.current = true;
    setShowWarning(true);
    setSecondsLeft(WARNING_SECONDS);

    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          returnToHomeAfterLogout();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const recordActivity = () => {
    if (!isLoggedIn()) return;

    /*
     * Once the warning is visible, activity should NOT dismiss it.
     * The user must intentionally click Stay Signed In.
     */
    if (showWarningRef.current) return;

    lastActivityRef.current = Date.now();
  };

  const startInactivityChecker = () => {
    clearInterval(inactivityCheckerRef.current);

    const idleLimit = getIdleLimit();

    // If user chooses "Never", do not start an inactivity checker.
    if (idleLimit === null) return;

    inactivityCheckerRef.current = setInterval(() => {
      if (!isLoggedIn()) {
        clearTimers();
        return;
      }

      if (showWarningRef.current) return;

      const inactiveFor = Date.now() - lastActivityRef.current;

      if (inactiveFor >= idleLimit) {
        startCountdown();
      }
    }, 1000);
  };

  useEffect(() => {
    if (!isLoggedIn()) return;

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

    lastActivityRef.current = Date.now();
    startInactivityChecker();

    return () => {
      clearTimers();

      activityEvents.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });
    };
  }, []);

  const staySignedIn = () => {
    clearTimers();

    showWarningRef.current = false;
    setShowWarning(false);
    setSecondsLeft(WARNING_SECONDS);

    lastActivityRef.current = Date.now();
    startInactivityChecker();
  };

  const logoutNow = () => {
    clearTimers();
    logoutUser();
    window.location.href = "/";
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
          home page in{" "}
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