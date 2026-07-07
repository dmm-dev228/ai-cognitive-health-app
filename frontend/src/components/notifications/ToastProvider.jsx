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
        <div className={`fixed right-6 top-6 z-[60] w-[calc(100%-3rem)] max-w-sm animate-fade-in overflow-hidden rounded-[1.75rem] border ${theme.border} ${theme.bg} p-4 shadow-xl ${theme.shadow} backdrop-blur-xl`}>
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-lg font-black text-white shadow-lg`}
                >
                    {theme.icon}
                </div>

                <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold ${theme.titleColor}`}>
                        {title}
                    </p>

                    {message && (
                        <p className={`mt-1 text-sm leading-5 ${theme.messageColor}`}>
                            {message}
                        </p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="rounded-full px-2 text-sm font-bold text-slate-400 transition hover:bg-white/70 hover:text-slate-700"
                    aria-label="Close notification"
                >
                    ×
                </button>
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
                bg: "bg-red-50/95",
                border: "border-red-100",
                shadow: "shadow-red-200/50",
                titleColor: "text-red-800",
                messageColor: "text-red-700",
            };

        case "info":
            return {
                icon: "i",
                gradient: "from-sky-500 to-cyan-500",
                bg: "bg-sky-50/95",
                border: "border-sky-100",
                shadow: "shadow-sky-200/50",
                titleColor: "text-sky-800",
                messageColor: "text-sky-700",
            };

        case "warning":
            return {
                icon: "!",
                gradient: "from-amber-400 to-orange-400",
                bg: "bg-amber-50/95",
                border: "border-amber-100",
                shadow: "shadow-amber-200/50",
                titleColor: "text-amber-800",
                messageColor: "text-amber-700",
            };

        case "success":
        default:
            return {
                icon: "✓",
                gradient: "from-emerald-500 to-teal-500",
                bg: "bg-emerald-50/95",
                border: "border-emerald-100",
                shadow: "shadow-emerald-200/50",
                titleColor: "text-emerald-800",
                messageColor: "text-emerald-700",
            };
    }
}

export default ToastProvider;