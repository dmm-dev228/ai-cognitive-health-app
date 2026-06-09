import { useState } from "react";
import { submitFeedback } from "../services/api";

function FeedbackCard({ isDarkMode }) {
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");

    // Frontend-only feedback for now. Later this can call a backend endpoint.
    const handleFeedbackSubmit = async () => {
        if (!feedbackText.trim()) {
            setFeedbackMessage("Please write your feedback first.");
            return;
        }

        try {
            const responseMessage = await submitFeedback(feedbackText);

            setFeedbackMessage(responseMessage || "Thank you for helping improve CogniHaven.");
            setFeedbackText("");

            setTimeout(() => {
                setFeedbackMessage("");
            }, 3000);
        } catch (error) {
            console.error("Feedback submission failed:", error);
            setFeedbackMessage("Feedback could not be sent right now. Please try again.");
        }
    };
    return (
        <div
            className={`mt-6 rounded-[2rem] p-8 ${isDarkMode
                    ? "border border-white/10 bg-white/10 backdrop-blur-xl"
                    : "glass-card"
                }`}
        >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
                Feedback
            </p>

            <h3
                className={`mt-3 text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"
                    }`}
            >
                Help shape CogniHaven.
            </h3>

            <p
                className={`mt-3 text-sm leading-7 ${isDarkMode ? "text-slate-300" : "text-slate-600"
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
                className="mt-5 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <button
                onClick={handleFeedbackSubmit}
                className="mt-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
                Send Feedback
            </button>

            {feedbackMessage && (
                <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {feedbackMessage}
                </p>
            )}
        </div>
    );
}

export default FeedbackCard;