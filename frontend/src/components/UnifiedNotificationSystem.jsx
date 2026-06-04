import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAchievements } from "../services/api";

/*
 * UnifiedNotificationSystem
 * -------------------------
 * One shared popup system for:
 * - in-app reminders
 * - journal prompts
 * - medication reminders
 * - goal reminders
 * - achievements
 */
function UnifiedNotificationSystem({
    visibleNotifications,
    setVisibleNotifications
}) {
    const [achievement, setAchievement] = useState(null);

    useEffect(() => {
        checkForNewAchievements();

        const intervalId = setInterval(() => {
            checkForNewAchievements();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const checkForNewAchievements = async () => {
        try {
            const achievements = await getAchievements();

            if (!Array.isArray(achievements) || achievements.length === 0) {
                return;
            }

            const seenKeys = JSON.parse(
                localStorage.getItem("seenAchievements") || "[]"
            );

            const unseenAchievement = achievements.find(
                (item) => !seenKeys.includes(item.achievementKey)
            );

            if (!unseenAchievement) {
                return;
            }

            setAchievement(unseenAchievement);

            localStorage.setItem(
                "seenAchievements",
                JSON.stringify([
                    ...seenKeys,
                    unseenAchievement.achievementKey
                ])
            );
        } catch (err) {
            console.error("Failed to check achievements:", err);
        }
    };

    const getReminderIcon = (type) => {
        if (type === "MEDICATION") return "💊";
        if (type === "GOAL") return "🎯";
        if (type === "JOURNAL") return "✍️";
        if (type === "GAME") return "🧠";
        if (type === "COMMUNITY") return "💜";
        return "🔔";
    };

    const getAchievementIcon = (key) => {
        if (key.includes("GOAL")) return "🎯";
        if (key.includes("JOURNAL")) return "✍️";
        if (key.includes("GAME")) return "🎮";
        if (key.includes("PATTERN")) return "🧠";
        if (key.includes("STORY")) return "📖";
        if (key.includes("PERFECT")) return "✨";
        return "🏅";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-xs space-y-3">
            {achievement && (
                <PopupCard
                    type="ACHIEVEMENT"
                    label="Achievement Unlocked"
                    title={achievement.badgeLabel}
                    message={achievement.description}
                    icon={getAchievementIcon(achievement.achievementKey)}
                    actionText="View Badges"
                    actionUrl="/achievements"
                    onDismiss={() => setAchievement(null)}
                />
            )}

            {visibleNotifications.map((notification, index) => (
                <PopupCard
                    key={index}
                    type={notification.type}
                    label={notification.type || "Notification"}
                    title={formatNotificationTitle(notification.type)}
                    message={notification.message}
                    icon={getReminderIcon(notification.type)}
                    actionText="Go"
                    actionUrl={notification.actionUrl}
                    onDismiss={() =>
                        setVisibleNotifications((prev) =>
                            prev.filter((_, i) => i !== index)
                        )
                    }
                />
            ))}
        </div>
    );
}

function PopupCard({
    type,
    label,
    title,
    message,
    icon,
    actionText,
    actionUrl,
    onDismiss
}) {
    const theme = getNotificationTheme(type);

    return (
        <div className="animate-fade-in overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-xl shadow-slate-300/50">
            <div className={`bg-gradient-to-r ${theme.gradient} px-4 py-3 text-white`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                    {label}
                </p>

                <h3 className="mt-1 text-lg font-black">{title}</h3>
            </div>

            <div className="p-4">
                <div
                    className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${theme.iconBg} text-2xl`}
                >
                    {icon}
                </div>

                <p className="text-sm leading-5 text-slate-600">{message}</p>

                <div className="mt-4 flex gap-2">
                    {actionUrl && (
                        <Link
                            to={actionUrl}
                            onClick={onDismiss}
                            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600"
                        >
                            {actionText}
                        </Link>
                    )}

                    <button
                        onClick={onDismiss}
                        className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatNotificationTitle(type) {
    if (type === "MEDICATION") return "Medication Reminder";
    if (type === "GOAL") return "Goal Reminder";
    if (type === "JOURNAL") return "Reflection Reminder";
    if (type === "GAME") return "Game Reminder";
    if (type === "COMMUNITY") return "Community Update";
    return "CogniHaven Reminder";
}

function getNotificationTheme(type) {
    switch (type) {
        case "ACHIEVEMENT":
            return {
                gradient: "from-amber-400 to-orange-400",
                iconBg: "bg-amber-50"
            };

        case "MEDICATION":
            return {
                gradient: "from-emerald-500 to-teal-500",
                iconBg: "bg-emerald-50"
            };

        case "GOAL":
            return {
                gradient: "from-indigo-500 to-violet-500",
                iconBg: "bg-indigo-50"
            };

        case "JOURNAL":
            return {
                gradient: "from-pink-500 to-rose-500",
                iconBg: "bg-pink-50"
            };

        case "GAME":
            return {
                gradient: "from-violet-500 to-purple-500",
                iconBg: "bg-violet-50"
            };

        case "COMMUNITY":
            return {
                gradient: "from-fuchsia-500 to-pink-500",
                iconBg: "bg-pink-50"
            };

        case "SECURITY":
            return {
                gradient: "from-red-500 to-rose-600",
                iconBg: "bg-red-50"
            };

        default:
            return {
                gradient: "from-slate-500 to-slate-700",
                iconBg: "bg-slate-100"
            };
    }
}

export default UnifiedNotificationSystem;