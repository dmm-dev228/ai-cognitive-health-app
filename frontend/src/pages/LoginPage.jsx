import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser, resendVerificationEmail } from "../services/api";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCapsLock = (event) => {
    setCapsLockOn(event.getModifierState("CapsLock"));
  };

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      console.log("LOGIN DATA:", data);

      if (data.token) {
        sessionStorage.setItem("token", data.token);

        if (data.userId) {
          sessionStorage.setItem("userId", data.userId);
        }

        setMessage("Login successful.");
        setShowResend(false);
        window.location.href = "/journal";
      } else {
        const errorMessage = data.message || "Invalid email or password.";

        setMessage(errorMessage);

        if (errorMessage.toLowerCase().includes("verify")) {
          setShowResend(true);
        } else {
          setShowResend(false);
        }
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      setShowResend(false);
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email first.");
      return;
    }

    try {
      setIsResending(true);

      const result = await resendVerificationEmail(email);

      setMessage(result || "Verification email sent. Please check your inbox.");
    } catch (err) {
      setMessage("Could not resend verification email. Please try again.");
      console.error("Resend verification failed:", err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10 animate-fade-in">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] glass-card md:grid-cols-[0.95fr_1.05fr]">
        {/* Login form */}
        <div className="relative bg-white/90 p-8 backdrop-blur-xl sm:p-10">
          <div className="absolute right-8 top-8 hidden rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 sm:block">
            Welcome back
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
              Login
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Return to your wellness space
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Continue your reflections, reminders, cognitive engagement, and
              AI-guided wellness insights.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </span>

              <div className="relative">
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-24 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyUp={handleCapsLock}
                  onKeyDown={handleCapsLock}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {capsLockOn && (
                <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  Caps Lock is ON
                </p>
              )}
            </label>


            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
            <Link
              to="/forgot-password"
              className="block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </Link>

          </div>

          {message && (
            <p
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${message.toLowerCase().includes("successful") ||
                  message.toLowerCase().includes("sent")
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-amber-100 bg-amber-50 text-amber-700"
                }`}
            >
              {message}
            </p>
          )}

          {showResend && (
            <div className="mt-5 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-5">
              <p className="text-sm font-semibold text-slate-800">
                Need a new verification email?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                We can send another verification link to the email address above.
              </p>

              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            New to CogniHaven?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Visual panel */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-600 p-10 text-white md:block">
          <div className="absolute -right-16 top-10 h-52 w-52 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-8 h-56 w-56 rounded-full bg-yellow-200/25 blur-3xl animate-float" />
          <div className="absolute left-24 top-32 h-28 w-28 rounded-full bg-violet-200/20 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Your calm daily dashboard
              </div>

              <h2 className="mt-8 max-w-md text-5xl font-bold leading-tight tracking-tight">
                Pick up where your wellness journey left off.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-white/85">
                Access your journal reflections, medication reminders, wellness
                analytics, game insights, and supportive AI summaries.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold">AI-guided reflection</p>
                <p className="mt-1 text-sm text-white/80">
                  Review supportive insights from your journal and activities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                  <p className="text-sm font-semibold">Reminders</p>
                  <p className="mt-1 text-xs text-white/80">
                    Stay consistent with daily routines.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                  <p className="text-sm font-semibold">Progress</p>
                  <p className="mt-1 text-xs text-white/80">
                    Track wellness patterns over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;