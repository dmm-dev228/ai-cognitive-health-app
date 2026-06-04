import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../services/api";

function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const passwordStrength =
    password.length >= 10 ? "Strong" : password.length >= 6 ? "Medium" : "Weak";

  const handleCapsLock = (event) => {
    setCapsLockOn(event.getModifierState("CapsLock"));
  };

  const handleSignUp = async () => {
    setMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await createUser({
        username,
        email,
        password,
      });

      if (data.id) {
        setMessage(
          "Account created. Please check your email to verify your account."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(data.message || "Sign up failed.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error("Signup failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10 animate-fade-in">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] glass-card md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-sky-500 via-indigo-600 to-emerald-500 p-10 text-white md:block">
          <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-16 right-8 h-56 w-56 rounded-full bg-yellow-200/25 blur-3xl animate-float" />
          <div className="absolute right-20 top-28 h-28 w-28 rounded-full bg-violet-200/20 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Calm technology for daily wellness
              </div>

              <h2 className="mt-8 max-w-md text-5xl font-bold leading-tight tracking-tight">
                Build routines that feel supportive, not overwhelming.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-white/85">
                CogniHaven brings reflection, reminders, cognitive engagement,
                and AI-guided insights into one calm daily support space.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold">Daily reflection</p>
                <p className="mt-1 text-sm text-white/80">
                  Capture thoughts, moods, and AI-supported insights.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                  <p className="text-sm font-semibold">Routine support</p>
                  <p className="mt-1 text-xs text-white/80">
                    Helpful reminders and habit consistency.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                  <p className="text-sm font-semibold">Wellness insights</p>
                  <p className="mt-1 text-xs text-white/80">
                    Progress tracking with supportive summaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white/90 p-8 backdrop-blur-xl sm:p-10">
          <div className="absolute right-8 top-8 hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 sm:block">
            Secure signup
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
              Create Account
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Join CogniHaven
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Start your wellness space for reflection, reminders, cognitive
              engagement, and routine consistency.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
              />
            </label>

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
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyUp={handleCapsLock}
                onKeyDown={handleCapsLock}
                placeholder="Create a password"
              />

              {capsLockOn && (
                <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  Caps Lock is ON
                </p>
              )}

              {password && (
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength === "Strong"
                          ? "w-full bg-emerald-500"
                          : passwordStrength === "Medium"
                          ? "w-2/3 bg-amber-400"
                          : "w-1/3 bg-red-400"
                      }`}
                    />
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Password strength:{" "}
                    <span
                      className={
                        passwordStrength === "Strong"
                          ? "text-emerald-600"
                          : passwordStrength === "Medium"
                          ? "text-amber-600"
                          : "text-red-500"
                      }
                    >
                      {passwordStrength}
                    </span>
                  </p>
                </div>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </span>
              <input
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  passwordsMatch
                    ? "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                    : "border-red-300 focus:border-red-400 focus:ring-red-100"
                }`}
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onKeyUp={handleCapsLock}
                onKeyDown={handleCapsLock}
                placeholder="Confirm your password"
              />

              {!passwordsMatch && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  Passwords do not match.
                </p>
              )}
            </label>

            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="group w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {message && (
            <p className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;