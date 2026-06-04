import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      const response = await forgotPassword(email);

      setMessage(response);
      setEmail("");
    } catch (err) {
      console.error("Password reset request failed:", err);
      setError("Could not request password reset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl animate-fade-in">
      <div className="glass-card rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
          Password Reset
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          Forgot your password?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter your email and CogniHaven will send a password reset link if an
          account exists.
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;