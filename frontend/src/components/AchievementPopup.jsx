import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAchievements } from "../services/api";

/*
 * AchievementPopup
 * ----------------
 * Shows a popup when the user unlocks a new achievement.
 *
 * MVP approach:
 * - Fetch achievements periodically
 * - Compare against achievements already seen in localStorage
 * - Show newest unseen achievement
 */
function AchievementPopup() {
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

    const getBadgeEmoji = (key) => {
        if (key.includes("GOAL")) return "🎯";
        if (key.includes("JOURNAL")) return "✍️";
        if (key.includes("GAME")) return "🎮";
        if (key.includes("PATTERN")) return "🧠";
        if (key.includes("STORY")) return "📖";
        if (key.includes("PERFECT")) return "✨";
        return "🏅";
    };

    if (!achievement) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in">
            <div className="overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-2xl shadow-amber-200/60">
                <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                        Achievement Unlocked
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                        {achievement.badgeLabel}
                    </h3>
                </div>

                <div className="p-5">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-3xl">
                        {getBadgeEmoji(achievement.achievementKey)}
                    </div>

                    <h4 className="text-lg font-bold text-slate-900">
                        {achievement.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {achievement.description}
                    </p>

                    <div className="mt-5 flex gap-3">
                        <Link
                            to="/achievements"
                            onClick={() => setAchievement(null)}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
                        >
                            View Badges
                        </Link>

                        <button
                            onClick={() => setAchievement(null)}
                            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AchievementPopup;