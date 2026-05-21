import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const passwordsMatch =
    confirmPassword.length === 0 || newPassword === confirmPassword;

  const passwordStrength =
    newPassword.length >= 10
      ? "Strong"
      : newPassword.length >= 6
        ? "Medium"
        : "Weak";

  const handleCapsLock = (event) => {
    setCapsLockOn(event.getModifierState("CapsLock"));
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await resetPassword(token, newPassword);

      setMessage(`${response} You can now log in.`);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password reset failed:", err);
      setError("Password reset failed. The link may be invalid or expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl animate-fade-in">
      <div className="glass-card rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
          Secure Reset
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          Create a new password
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter and confirm your new CogniHaven password.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              New Password
            </span>

            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              onKeyUp={handleCapsLock}
              onKeyDown={handleCapsLock}
              placeholder="New password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            {capsLockOn && (
              <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                Caps Lock is ON
              </p>
            )}

            {newPassword && (
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
              Confirm New Password
            </span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onKeyUp={handleCapsLock}
              onKeyDown={handleCapsLock}
              placeholder="Confirm new password"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                passwordsMatch
                  ? "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                  : "border-red-300 focus:border-red-400 focus:ring-red-100"
              }`}
            />

            {!passwordsMatch && (
              <p className="mt-2 text-xs font-medium text-red-500">
                Passwords do not match.
              </p>
            )}
          </label>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Resetting password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordPage;