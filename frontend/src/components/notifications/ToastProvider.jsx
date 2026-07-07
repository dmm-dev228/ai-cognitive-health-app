import { useCallback, useRef, useState } from "react";
import ToastContext from "./ToastContext";

/*
 * ToastProvider
 * -------------
 * Global lightweight toast system.
 *
 * Used for quick action feedback:
 * - saved
 * - updated
 * - deleted
 * - progress logged
 * - profile updated
 *
 * This is separate from reminder notifications.
 */
function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const timeoutRef = useRef(null);

    const hideToast = useCallback(() => {
        setToast(null);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const showToast = useCallback(
        ({ type = "success", title, message, duration = 3500 }) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setToast({
                type,
                title,
                message,
            });

            timeoutRef.current = setTimeout(() => {
                setToast(null);
                timeoutRef.current = null;
            }, duration);
        },
        []
    );

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {toast && (
                <ToastNotification
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
}

function ToastNotification({ type, title, message, onClose }) {
    const theme = getToastTheme(type);

    return (
        <div className="fixed right-6 top-6 z-[60] w-[calc(100%-3rem)] max-w-sm animate-fade-in overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl">
            <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

            <div className="relative p-5">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-100/60 blur-2xl" />

                <div className="relative flex items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${theme.gradient} text-xl font-black text-white shadow-lg`}
                    >
                        {theme.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                            CogniHaven
                        </p>

                        <p className="mt-1 text-base font-black text-slate-900">
                            {title}
                        </p>

                        {message && (
                            <p className="mt-1 text-sm leading-5 text-slate-600">
                                {message}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}

function getToastTheme(type) {
    switch (type) {
        case "error":
            return {
                icon: "!",
                gradient: "from-red-500 to-rose-500",
            };

        case "info":
            return {
                icon: "i",
                gradient: "from-sky-500 to-cyan-500",
            };

        case "warning":
            return {
                icon: "!",
                gradient: "from-amber-400 to-orange-400",
            };

        case "success":
        default:
            return {
                icon: "✓",
                gradient: "from-indigo-500 via-violet-500 to-emerald-500",
            };
    }
}

export default ToastProvider;