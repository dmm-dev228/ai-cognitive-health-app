import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";

/*
 * VerifyEmailPage
 * ---------------
 * Handles email verification after a user clicks the email link.
 *
 * Fixes:
 * - Uses sessionStorage instead of localStorage.
 * - Saves username/email for the profile avatar menu.
 * - Prevents duplicate verification calls caused by React Strict Mode.
 * - Avoids showing an error if the user was already successfully logged in.
 */
function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading");

  // Prevents React Strict Mode from verifying the same token twice in development.
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Missing verification token.");
      setStatus("error");
      return;
    }

    // React Strict Mode can run effects twice in development.
    // This prevents a second request from falsely showing an error after success.
    if (hasVerifiedRef.current) return;

    hasVerifiedRef.current = true;

    const confirmEmail = async () => {
      try {
        const data = await verifyEmail(token);

        console.log("VERIFY EMAIL DATA:", data);

        if (data.token && data.userId) {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userId", data.userId);

          // Store user profile info for navbar avatar/settings drawer.
          if (data.username) {
            sessionStorage.setItem("username", data.username);
          }

          if (data.email) {
            sessionStorage.setItem("email", data.email);
          }

          setMessage("Email verified successfully. Redirecting you to your journal...");
          setStatus("success");

          setTimeout(() => {
            window.location.href = "/journal";
          }, 2000);

          return;
        }

        setMessage(data.message || "Email verification failed.");
        setStatus("error");
      } catch (err) {
        /*
         * If the token was already verified but the user has a session token,
         * treat it as success instead of showing a false error.
         */
        if (sessionStorage.getItem("token")) {
          setMessage("Email verified successfully. Redirecting you to your journal...");
          setStatus("success");

          setTimeout(() => {
            window.location.href = "/journal";
          }, 1500);

          return;
        }

        setMessage("Email verification failed. The link may be invalid or expired.");
        setStatus("error");
      }
    };

    confirmEmail();
  }, [searchParams]);

  const statusStyles = {
    loading: {
      icon: "⏳",
      label: "Verifying",
      badge: "bg-indigo-50 text-indigo-700",
      ring: "border-indigo-100 bg-indigo-50",
    },
    success: {
      icon: "✅",
      label: "Verified",
      badge: "bg-emerald-50 text-emerald-700",
      ring: "border-emerald-100 bg-emerald-50",
    },
    error: {
      icon: "⚠️",
      label: "Action needed",
      badge: "bg-red-50 text-red-600",
      ring: "border-red-100 bg-red-50",
    },
  };

  const currentStatus = statusStyles[status];

  return (
    <section className="flex min-h-[72vh] items-center justify-center px-4 py-10 animate-fade-in">
      <div className="glass-card w-full max-w-2xl overflow-hidden rounded-[2rem]">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 px-8 py-10 text-center text-white">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-4xl backdrop-blur-xl animate-float">
            {currentStatus.icon}
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/75">
            Email Verification
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            {currentStatus.label}
          </h2>
        </div>

        <div className="bg-white/90 p-8 text-center backdrop-blur-xl sm:p-10">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${currentStatus.badge}`}
          >
            {status}
          </span>

          <p className="mx-auto mt-6 max-w-md text-base leading-8 text-slate-600">
            {message}
          </p>

          {status === "loading" && (
            <div
              className={`mx-auto mt-6 max-w-sm rounded-2xl border px-5 py-4 ${currentStatus.ring}`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                <p className="text-sm font-semibold text-indigo-700">
                  Please wait while we confirm your account.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div
              className={`mx-auto mt-6 max-w-sm rounded-2xl border px-5 py-4 ${currentStatus.ring}`}
            >
              <p className="text-sm font-semibold text-emerald-700">
                You are being signed in automatically.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                to="/login"
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Go to Login
              </Link>

              <p className="text-xs leading-6 text-slate-500">
                You can request a new verification email from the login page.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VerifyEmailPage;