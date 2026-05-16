import { useEffect, useState } from "react";
import { createGoal, getGoals, logGoalProgress } from "../services/api";

/*
 * MyGoalsPage
 * -----------
 * AI-supported goal tracking page.
 *
 * Users can:
 * - create wellness goals
 * - receive an AI-generated plan
 * - log progress
 * - view progress percentage
 * - see completed goals
 */
function MyGoalsPage() {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "WELLNESS",
        targetCount: 1,
        unitLabel: "steps",
        targetDate: "",
        inAppReminderEnabled: true,
        emailReminderEnabled: false,
    });

    const [logMap, setLogMap] = useState({});

    useEffect(() => {
        fetchGoals();
    }, []);

    /*
     * Fetch goals for the logged-in user.
     */
    const fetchGoals = async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getGoals();

            setGoals(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch goals:", err);
            setError("Could not load your goals.");
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * Updates goal form fields.
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /*
     * Frontend validation gives instant feedback.
     * Backend validation still protects the API.
     */
    const validateGoalForm = () => {
        if (!formData.title.trim()) {
            return "Goal title is required.";
        }

        if (!formData.category.trim()) {
            return "Goal category is required.";
        }

        if (!formData.targetCount || Number(formData.targetCount) < 1) {
            return "Target count must be at least 1.";
        }

        return "";
    };

    /*
     * Create goal, generate AI plan on backend, then refresh list.
     */
    const handleCreateGoal = async () => {
        const validationMessage = validateGoalForm();

        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        try {
            setIsCreating(true);
            setError("");

            await createGoal({
                ...formData,
                targetCount: Number(formData.targetCount),
                targetDate: formData.targetDate || null,
            });

            setFormData({
                title: "",
                description: "",
                category: "WELLNESS",
                targetCount: 1,
                unitLabel: "steps",
                targetDate: "",
                inAppReminderEnabled: true,
                emailReminderEnabled: false,
            });

            await fetchGoals();
        } catch (err) {
            console.error("Failed to create goal:", err);
            setError("Could not create goal. Please check your fields.");
        } finally {
            setIsCreating(false);
        }
    };

    /*
     * Updates local progress log input for a goal.
     */
    const handleLogChange = (goalId, field, value) => {
        setLogMap((prev) => ({
            ...prev,
            [goalId]: {
                progressAmount: 1,
                note: "",
                ...(prev[goalId] || {}),
                [field]: value,
            },
        }));
    };

    /*
     * Log progress toward a goal.
     */
    const handleLogProgress = async (goalId) => {
        const logData = logMap[goalId] || {
            progressAmount: 1,
            note: "",
        };

        if (!logData.progressAmount || Number(logData.progressAmount) < 1) {
            setError("Progress amount must be at least 1.");
            return;
        }

        try {
            setError("");

            await logGoalProgress(goalId, {
                progressAmount: Number(logData.progressAmount),
                note: logData.note || "",
            });

            setLogMap((prev) => ({
                ...prev,
                [goalId]: {
                    progressAmount: 1,
                    note: "",
                },
            }));

            await fetchGoals();
        } catch (err) {
            console.error("Failed to log goal progress:", err);
            setError("Could not log progress.");
        }
    };

    /*
     * Calculates progress percentage safely.
     */
    const getProgressPercent = (goal) => {
        if (!goal.targetCount || goal.targetCount <= 0) {
            return 0;
        }

        return Math.min(
            100,
            Math.round((goal.currentProgress / goal.targetCount) * 100)
        );
    };

    /*
     * Returns a simple milestone badge based on progress.
     */
    const getMilestoneBadge = (goal) => {
        const progress = getProgressPercent(goal);

        if (progress >= 100) return "Goal Completed";
        if (progress >= 75) return "Almost There";
        if (progress >= 50) return "Halfway There";
        if (progress >= 25) return "25% Progress";
        if (progress > 0) return "First Step";
        return "Not Started Yet";
    };

    const getCategoryMeta = (category) => {
        const categories = {
            JOURNALING: {
                icon: "✍️",
                color: "from-indigo-500 to-violet-500",
                soft: "bg-indigo-50 text-indigo-700",
            },
            MEMORY: {
                icon: "🧠",
                color: "from-violet-500 to-fuchsia-500",
                soft: "bg-violet-50 text-violet-700",
            },
            WELLNESS: {
                icon: "🌿",
                color: "from-emerald-500 to-teal-500",
                soft: "bg-emerald-50 text-emerald-700",
            },
            FITNESS: {
                icon: "🏃",
                color: "from-orange-500 to-amber-500",
                soft: "bg-orange-50 text-orange-700",
            },
            NUTRITION: {
                icon: "🍎",
                color: "from-red-400 to-rose-500",
                soft: "bg-red-50 text-red-700",
            },
            MEDICATION: {
                icon: "💊",
                color: "from-sky-500 to-cyan-500",
                soft: "bg-sky-50 text-sky-700",
            },
            MINDFULNESS: {
                icon: "🧘",
                color: "from-purple-500 to-indigo-500",
                soft: "bg-purple-50 text-purple-700",
            },
            PERSONAL: {
                icon: "⭐",
                color: "from-amber-500 to-yellow-500",
                soft: "bg-amber-50 text-amber-700",
            },
        };

        return (
            categories[category] || {
                icon: "🎯",
                color: "from-indigo-500 to-violet-500",
                soft: "bg-indigo-50 text-indigo-700",
            }
        );
    };

    const activeGoals = goals.filter((goal) => goal.status !== "COMPLETED");
    const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");

    const averageProgress =
        goals.length === 0
            ? 0
            : Math.round(
                goals.reduce((sum, goal) => sum + getProgressPercent(goal), 0) /
                goals.length
            );

    const nextMilestoneGoal = activeGoals.find(
        (goal) => getProgressPercent(goal) > 0 && getProgressPercent(goal) < 100
    );

    return (
        <section className="animate-fade-in">
            {/* Motivational page hero */}
            <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 p-8 text-white shadow-2xl shadow-indigo-200">
                <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl animate-float" />

                <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
                    <div>
                        <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                            Goal Mission Control
                        </p>

                        <h2 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight">
                            Build momentum one small win at a time.
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                            Create meaningful goals, follow AI-generated plans, log progress,
                            and celebrate milestones as you build healthier routines.
                        </p>
                    </div>

                    <div className="rounded-[2rem] bg-white/15 p-5 backdrop-blur-xl">
                        <p className="text-sm font-semibold text-white/80">
                            Overall Progress
                        </p>

                        <div className="mt-4 flex items-end gap-3">
                            <p className="text-5xl font-black">{averageProgress}%</p>
                            <p className="pb-2 text-sm font-semibold text-white/75">
                                across all goals
                            </p>
                        </div>

                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-700"
                                style={{ width: `${averageProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            {/* Dashboard summary cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard label="Active Goals" value={activeGoals.length} icon="🔥" />
                <SummaryCard
                    label="Completed"
                    value={completedGoals.length}
                    icon="🏆"
                />
                <SummaryCard label="Average Progress" value={`${averageProgress}%`} icon="📈" />
                <SummaryCard
                    label="Next Milestone"
                    value={nextMilestoneGoal ? getMilestoneBadge(nextMilestoneGoal) : "Start Today"}
                    icon="✨"
                />
            </div>

            <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
                {/* AI goal coach / create goal panel */}
                <div className="glass-card h-fit rounded-[2rem] p-6 xl:sticky xl:top-28">
                    <p className="text-sm font-semibold text-indigo-600">AI Goal Coach</p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        Create a goal that feels achievable.
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Set a clear target and CogniHaven will generate a supportive plan to
                        help you take the first step.
                    </p>

                    <div className="mt-6 space-y-5">
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Goal Title <span className="text-red-500">*</span>
                            </span>

                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Journal 5 times this week"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Why this matters
                            </span>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Why does this goal matter to you?"
                                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category
                                </span>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                >
                                    <option value="JOURNALING">Journaling</option>
                                    <option value="MEMORY">Memory</option>
                                    <option value="WELLNESS">Wellness</option>
                                    <option value="FITNESS">Fitness</option>
                                    <option value="NUTRITION">Nutrition</option>
                                    <option value="MEDICATION">Medication</option>
                                    <option value="MINDFULNESS">Mindfulness</option>
                                    <option value="PERSONAL">Personal</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Target Date
                                </span>

                                <input
                                    type="date"
                                    name="targetDate"
                                    value={formData.targetDate}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                            </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Target Count
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    name="targetCount"
                                    value={formData.targetCount}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Unit
                                </span>

                                <input
                                    name="unitLabel"
                                    value={formData.unitLabel}
                                    onChange={handleChange}
                                    placeholder="entries"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                            </label>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white/70 p-5">
                            <p className="mb-4 text-sm font-bold text-slate-900">
                                Reminder Preferences
                            </p>

                            <div className="space-y-3">
                                <ReminderToggle
                                    title="In-app Reminder"
                                    description="Gentle reminders inside CogniHaven"
                                    name="inAppReminderEnabled"
                                    checked={formData.inAppReminderEnabled}
                                    onChange={handleChange}
                                />

                                <ReminderToggle
                                    title="Email Reminder"
                                    description="Receive goal reminder emails"
                                    name="emailReminderEnabled"
                                    checked={formData.emailReminderEnabled}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleCreateGoal}
                            disabled={isCreating}
                            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isCreating ? "Creating AI Plan..." : "Create Goal"}
                        </button>
                    </div>
                </div>

                {/* Goal achievement board */}
                <div className="space-y-8">
                    {isLoading ? (
                        <div className="glass-card rounded-3xl p-10 text-center">
                            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
                            <p className="font-semibold text-slate-700">
                                Loading your goals...
                            </p>
                        </div>
                    ) : (
                        <>
                            <GoalSection
                                title="Active Goals"
                                description="Goals you are currently building momentum toward."
                                goals={activeGoals}
                                getProgressPercent={getProgressPercent}
                                getMilestoneBadge={getMilestoneBadge}
                                getCategoryMeta={getCategoryMeta}
                                logMap={logMap}
                                handleLogChange={handleLogChange}
                                handleLogProgress={handleLogProgress}
                                showLogging
                            />

                            <GoalSection
                                title="Completed Goals"
                                description="Completed goals and wins worth celebrating."
                                goals={completedGoals}
                                getProgressPercent={getProgressPercent}
                                getMilestoneBadge={getMilestoneBadge}
                                getCategoryMeta={getCategoryMeta}
                                logMap={logMap}
                                handleLogChange={handleLogChange}
                                handleLogProgress={handleLogProgress}
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

function SummaryCard({ label, value, icon }) {
    return (
        <div className="glass-card rounded-3xl p-5 hover-lift">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                {icon}
            </div>

            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
        </div>
    );
}

function ReminderToggle({ title, description, name, checked, onChange }) {
    return (
        <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
            <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>

            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-5 w-5 accent-indigo-500"
            />
        </label>
    );
}

function GoalSection({
    title,
    description,
    goals,
    getProgressPercent,
    getMilestoneBadge,
    getCategoryMeta,
    logMap,
    handleLogChange,
    handleLogProgress,
    showLogging = false,
}) {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>

                <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                    {goals.length}
                </span>
            </div>

            {goals.length === 0 ? (
                <div className="glass-card rounded-3xl p-10 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-3xl">
                        🎯
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                        No goals here yet.
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                        Create a goal to start building momentum with small, consistent
                        progress.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 2xl:grid-cols-2">
                    {goals.map((goal) => {
                        const progressPercent = getProgressPercent(goal);
                        const milestone = getMilestoneBadge(goal);
                        const meta = getCategoryMeta(goal.category);
                        const logData = logMap[goal.id] || {
                            progressAmount: 1,
                            note: "",
                        };

                        return (
                            <article
                                key={goal.id}
                                className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className={`h-2 bg-gradient-to-r ${meta.color}`} />

                                <div className="p-6">
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${meta.color} text-2xl shadow-lg`}
                                            >
                                                {meta.icon}
                                            </div>

                                            <div>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${meta.soft}`}
                                                >
                                                    {goal.category}
                                                </span>

                                                <h3 className="mt-3 text-2xl font-black text-slate-900">
                                                    {goal.title}
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                    {goal.description || "No description added."}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${goal.status === "COMPLETED"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {goal.status}
                                        </span>
                                    </div>

                                    <div className="mb-5 rounded-3xl bg-slate-50 p-5">
                                        <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600">
                                            <span>
                                                {goal.currentProgress} / {goal.targetCount}{" "}
                                                {goal.unitLabel || "steps"}
                                            </span>
                                            <span>{progressPercent}%</span>
                                        </div>

                                        <div className="h-4 overflow-hidden rounded-full bg-white">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${meta.color} transition-all duration-700`}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
                                                ✨ {milestone}
                                            </span>

                                            {goal.targetDate && (
                                                <span className="rounded-full bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700">
                                                    Target:{" "}
                                                    {new Date(goal.targetDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-5 rounded-3xl border border-indigo-100 bg-indigo-50/80 p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                                            AI Coach Plan
                                        </p>

                                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                            {goal.aiPlan ||
                                                "CogniHaven has not generated a plan yet."}
                                        </p>
                                    </div>

                                    {showLogging && (
                                        <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                                            <p className="mb-3 text-sm font-bold text-slate-800">
                                                Log a small win
                                            </p>

                                            <div className="grid gap-3 sm:grid-cols-[100px_1fr]">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={logData.progressAmount}
                                                    onChange={(e) =>
                                                        handleLogChange(
                                                            goal.id,
                                                            "progressAmount",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                                />

                                                <input
                                                    value={logData.note}
                                                    onChange={(e) =>
                                                        handleLogChange(goal.id, "note", e.target.value)
                                                    }
                                                    placeholder="Optional note..."
                                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleLogProgress(goal.id)}
                                                className={`mt-3 w-full rounded-2xl bg-gradient-to-r ${meta.color} px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl`}
                                            >
                                                Log Progress
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyGoalsPage;