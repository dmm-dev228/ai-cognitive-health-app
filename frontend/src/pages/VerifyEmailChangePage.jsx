import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmEmailChange } from "../services/api";

function VerifyEmailChangePage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Confirming your new email...");
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Missing email change token.");
      return;
    }

    if (hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;

    const confirmChange = async () => {
      try {
        const updatedUser = await confirmEmailChange(token);

        if (updatedUser.email) {
          sessionStorage.setItem("email", updatedUser.email);
          window.dispatchEvent(new Event("userProfileUpdated"));
        }

        setStatus("success");
        setMessage("Your email was updated successfully.");
      } catch (err) {
        console.error("Email change verification failed:", err);
        setStatus("error");
        setMessage(err.message || "Email change verification failed.");
      }
    };

    confirmChange();
  }, [searchParams]);

  return (
    <section className="flex min-h-[72vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-xl">
        <div className="text-5xl">
          {status === "loading" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "⚠️"}
        </div>

        <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
          Email Change
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          {status === "loading" && "Confirming"}
          {status === "success" && "Email Updated"}
          {status === "error" && "Action Needed"}
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">{message}</p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}

export default VerifyEmailChangePage;