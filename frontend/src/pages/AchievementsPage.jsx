import { useEffect, useState } from "react";
import { getAchievements } from "../services/api";

/*
 * AchievementsPage
 * ----------------
 * Displays badges and milestones unlocked by the user.
 *
 * Achievements are system-generated from:
 * - goals
 * - games
 * - future journal streaks
 * - future consistency tracking
 */
function AchievementsPage() {
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAchievements();
    }, []);

    /*
     * Fetch unlocked achievements for the logged-in user.
     */
    const fetchAchievements = async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getAchievements();

            setAchievements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch achievements:", err);
            setError("Could not load achievements.");
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * Future locked achievements.
     * These help the page feel like a real badge system,
     * even before everything is unlocked.
     */
    const allPossibleAchievements = [
        "FIRST_GOAL_CREATED",
        "FIRST_GOAL_COMPLETED",

        "FIRST_GAME_PLAYED",
        "PERFECT_GAME_SCORE",
        "PATTERN_RECALL_MASTER",
        "STORY_RECALL_MASTER",

        "FIRST_JOURNAL_ENTRY",
        "FIVE_JOURNAL_ENTRIES"
    ];

    const unlockedKeys = achievements.map(
        (achievement) => achievement.achievementKey
    );

    const lockedAchievements = allPossibleAchievements.filter(
        (key) => !unlockedKeys.includes(key)
    );

    const getBadgeEmoji = (key) => {
        if (key.includes("GOAL")) return "🎯";
        if (key.includes("GAME")) return "🎮";
        if (key.includes("PATTERN")) return "🧠";
        if (key.includes("STORY")) return "📖";
        if (key.includes("PERFECT")) return "✨";
        return "🏅";
    };

    const formatLockedTitle = (key) => {
        return key
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
            )
            .join(" ");
    };

    return (
        <section className="animate-fade-in">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
                    Achievements
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    Celebrate your wellness progress.
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    Earn badges by building routines, playing cognitive
                    wellness games, completing goals, and staying consistent.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="glass-card rounded-3xl p-10 text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-100 border-t-amber-500" />

                    <p className="font-semibold text-slate-700">
                        Loading achievements...
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="glass-card rounded-3xl p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Unlocked
                            </p>

                            <p className="mt-2 text-4xl font-black text-amber-500">
                                {achievements.length}
                            </p>
                        </div>

                        <div className="glass-card rounded-3xl p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Available
                            </p>

                            <p className="mt-2 text-4xl font-black text-indigo-500">
                                {allPossibleAchievements.length}
                            </p>
                        </div>

                        <div className="glass-card rounded-3xl p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Progress
                            </p>

                            <p className="mt-2 text-4xl font-black text-emerald-500">
                                {Math.round(
                                    (achievements.length /
                                        allPossibleAchievements.length) *
                                    100
                                )}
                                %
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Unlocked Badges
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Milestones you have already earned.
                                </p>
                            </div>

                            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                                {achievements.length}
                            </span>
                        </div>

                        {achievements.length === 0 ? (
                            <div className="glass-card rounded-3xl p-10 text-center">
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-3xl">
                                    🏅
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900">
                                    No achievements unlocked yet.
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                                    Create goals, play games, and keep building
                                    routines to unlock your first badge.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {achievements.map((achievement) => (
                                    <article
                                        key={achievement.id}
                                        className="glass-card rounded-[2rem] p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
                                    >
                                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-3xl">
                                            {getBadgeEmoji(
                                                achievement.achievementKey
                                            )}
                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
                                            {achievement.badgeLabel}
                                        </span>

                                        <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                            {achievement.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-slate-600">
                                            {achievement.description}
                                        </p>

                                        <p className="mt-5 text-xs font-semibold text-slate-400">
                                            Unlocked:{" "}
                                            {achievement.unlockedAt
                                                ? new Date(
                                                    achievement.unlockedAt
                                                ).toLocaleString()
                                                : "Recently"}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Locked Badges
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Keep going to unlock more milestones.
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                                {lockedAchievements.length}
                            </span>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {lockedAchievements.map((key) => (
                                <article
                                    key={key}
                                    className="rounded-[2rem] border border-dashed border-slate-200 bg-white/50 p-6 opacity-75"
                                >
                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl grayscale">
                                        🔒
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                                        Locked
                                    </span>

                                    <h3 className="mt-4 text-xl font-bold text-slate-700">
                                        {formatLockedTitle(key)}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-slate-500">
                                        Continue using CogniHaven to unlock this
                                        wellness milestone.
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AchievementsPage;