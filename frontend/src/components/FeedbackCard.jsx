import { useState } from "react";
import { submitFeedback } from "../services/api";

function FeedbackCard({ isDarkMode }) {
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState(false);

    // Sends feedback to the backend so it can be emailed to the CogniHaven owner.
    const handleFeedbackSubmit = async () => {
        if (!feedbackText.trim()) {
            setIsError(true);
            setFeedbackMessage("Please write your feedback first.");
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setIsError(true);
            setFeedbackMessage(
                "Please sign in to send feedback. This helps us keep feedback meaningful and secure."
            );
            return;
        }

        try {
            setIsSending(true);
            setIsError(false);

            const responseMessage = await submitFeedback({
                message: feedbackText
            });

            setFeedbackMessage(
                responseMessage || "Thank you for helping improve CogniHaven."
            );

            setFeedbackText("");

            setTimeout(() => {
                setFeedbackMessage("");
                setIsError(false);
            }, 3000);
        } catch (error) {
            console.error("Feedback submission failed:", error);
            setIsError(true);
            setFeedbackMessage(
                "Feedback could not be sent right now. Please try again."
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div
            className={`mt-6 rounded-[2rem] p-8 ${
                isDarkMode
                    ? "border border-white/10 bg-white/10 backdrop-blur-xl"
                    : "glass-card"
            }`}
        >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
                Feedback
            </p>

            <h3
                className={`mt-3 text-2xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                }`}
            >
                Help shape CogniHaven.
            </h3>

            <p
                className={`mt-3 text-sm leading-7 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
            >
                Share what feels helpful, confusing, or missing. Your feedback helps make
                CogniHaven calmer, clearer, and more supportive.
            </p>

            <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What could make CogniHaven better?"
                rows="4"
                className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <button
                onClick={handleFeedbackSubmit}
                disabled={isSending}
                className="mt-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSending ? "Sending..." : "Send Feedback"}
            </button>

            {feedbackMessage && (
                <p
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                        isError
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                    }`}
                >
                    {feedbackMessage}
                </p>
            )}
        </div>
    );
}

export default FeedbackCard;