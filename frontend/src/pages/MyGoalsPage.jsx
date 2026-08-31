import { useEffect, useState } from "react";
import { createGoal, getGoals, logGoalProgress } from "../services/api";
import CogniHavenLogo from "../components/CogniHavenLogo";
import { useToast } from "../components/notifications/useToast";

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

    const { showToast } = useToast();

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

            showToast({
                type: "error",
                title: "Goals Not Loaded",
                message: "Could not load your goals. Please try again.",
            });
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

            showToast({
                type: "warning",
                title: "Check Goal Details",
                message: validationMessage,
            });

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

            showToast({
                type: "success",
                title: "Goal Created",
                message: "Your AI plan is ready to help you build momentum.",
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

            showToast({
                type: "error",
                title: "Goal Not Created",
                message: "Could not create goal. Please check your fields.",
            });
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

            showToast({
                type: "warning",
                title: "Check Progress Amount",
                message: "Progress amount must be at least 1.",
            });

            return;
        }

        try {
            setError("");

            await logGoalProgress(goalId, {
                progressAmount: Number(logData.progressAmount),
                note: logData.note || "",
            });

            showToast({
                type: "success",
                title: "Progress Logged",
                message: "Every small step counts.",
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

            showToast({
                type: "error",
                title: "Progress Not Logged",
                message: "Could not log progress. Please try again.",
            });
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

    const activeGoals = goals.filter((goal) => goal.status === "ACTIVE");
    const pausedGoals = goals.filter((goal) => goal.status === "PAUSED");
    const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");

    const averageProgress =
        goals.length === 0
            ? 0
            : Math.round(
                goals.reduce(
                    (sum, goal) => sum + getProgressPercent(goal),
                    0
                ) / goals.length
            );

    const nextMilestoneGoal = activeGoals.find(
        (goal) => getProgressPercent(goal) > 0 && getProgressPercent(goal) < 100
    );

    return (
        <section className="min-w-0 animate-fade-in">
            {/* Motivational page hero */}
            <div className="relative mb-5 min-w-0 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 p-4 text-white shadow-xl shadow-indigo-200 sm:mb-6 sm:rounded-[2rem] sm:p-6 lg:mb-8 lg:rounded-[2.5rem] lg:p-8 lg:shadow-2xl">
                <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl animate-float" />

                <div className="relative z-10 grid min-w-0 gap-6 sm:gap-7 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end xl:gap-8">
                    <div>
                        <p className="inline-flex rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur sm:px-4 sm:text-sm">
                            Goal Mission Control
                        </p>

                        <h2 className="mt-4 max-w-4xl break-words text-2xl font-black leading-[1.08] tracking-tight min-[390px]:text-3xl sm:mt-5 sm:text-4xl lg:text-5xl">
                            Build momentum one small win at a time.
                        </h2>

                        <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-white/85 sm:mt-4 sm:leading-7">
                            Create meaningful goals, follow AI-generated plans, log progress,
                            and celebrate milestones as you build healthier routines.
                        </p>
                    </div>

                    <div className="flex min-w-0 flex-col items-center xl:items-end">
                        <CogniHavenLogo className="mb-3 h-20 w-20 object-contain drop-shadow-2xl animate-float sm:h-24 sm:w-24 lg:h-28 lg:w-28 xl:mb-4 xl:h-36 xl:w-36" />

                        <p className="text-sm font-semibold text-white/80">
                            Overall Progress
                        </p>

                        <div className="mt-3 flex flex-wrap items-end justify-center gap-2 sm:gap-3 xl:justify-end">
                            <p className="text-4xl font-black sm:text-5xl">
                                {averageProgress}%
                            </p>

                            <p className="pb-2 text-sm font-semibold text-white/75">
                                across all goals
                            </p>
                        </div>

                        <div className="mt-4 h-3 w-full max-w-sm overflow-hidden rounded-full bg-white/20 xl:ml-auto">
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
            <div className="mb-6 grid min-w-0 grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
                <SummaryCard label="Active Goals" value={activeGoals.length} icon="🔥" />

                <SummaryCard
                    label="Completed"
                    value={completedGoals.length}
                    icon="🏆"
                />

                <SummaryCard
                    label="Average Progress"
                    value={`${averageProgress}%`}
                    icon="📈"
                />

                <SummaryCard
                    label="Next Milestone"
                    value={
                        nextMilestoneGoal
                            ? getMilestoneBadge(nextMilestoneGoal)
                            : "Start Today"
                    }
                    icon="✨"
                />
            </div>

            <div className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] xl:items-start xl:gap-6 2xl:gap-8">
                {/* AI goal coach / create goal panel */}
                <div className="glass-card min-w-0 h-fit rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5 lg:p-6 xl:sticky xl:top-28">
                    <p className="text-sm font-semibold text-indigo-600">
                        AI Goal Coach
                    </p>

                    <h3 className="mt-2 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                        Create a goal that feels achievable.
                    </h3>

                    <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                        Set a clear target and CogniHaven will generate a supportive plan to
                        help you take the first step.
                    </p>

                    <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Goal Title <span className="text-red-500">*</span>
                            </span>

                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Journal 5 times this week"
                                className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                                className="min-w-0 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                                    className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                                    className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                                    className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                                    className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                            </label>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 sm:rounded-3xl sm:p-5">
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
                <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
                    {isLoading ? (
                        <div className="glass-card rounded-2xl p-7 text-center sm:rounded-3xl sm:p-10">
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
                                emptyTitle="No active goals yet."
                                emptyDescription="Start with one small goal. CogniHaven will help you build a plan that feels realistic."
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
                                title="Paused Goals"
                                description="Goals saved for later when the timing feels right."
                                emptyTitle="No paused goals."
                                emptyDescription="Paused goals will appear here when you decide to take a break from a goal."
                                goals={pausedGoals}
                                getProgressPercent={getProgressPercent}
                                getMilestoneBadge={getMilestoneBadge}
                                getCategoryMeta={getCategoryMeta}
                                logMap={logMap}
                                handleLogChange={handleLogChange}
                                handleLogProgress={handleLogProgress}
                            />

                            <GoalSection
                                title="Completed Goals"
                                description="Completed goals and wins worth celebrating."
                                emptyTitle="Completed goals will appear here."
                                emptyDescription="Each completed goal becomes proof that small steps can turn into meaningful progress."
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
        <div className="glass-card min-w-0 rounded-2xl p-3.5 hover-lift sm:rounded-3xl sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
                {icon}
            </div>

            <p className="break-words text-xs font-semibold leading-5 text-slate-500 sm:text-sm">{label}</p>
            <p className="mt-1 break-words text-xl font-black leading-tight text-slate-900 sm:mt-2 sm:text-2xl lg:text-3xl">{value}</p>
        </div>
    );
}

function ReminderToggle({ title, description, name, checked, onChange }) {
    return (
        <label className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm sm:gap-4 sm:px-4">
            <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>

            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-5 w-5 shrink-0 accent-indigo-500"
            />
        </label>
    );
}

function GoalSection({
    title,
    description,
    emptyTitle,
    emptyDescription,
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
            <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-4 shadow-sm backdrop-blur sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-3xl sm:px-5">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>

                <span className="w-fit shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:px-4 sm:py-2 sm:text-sm">
                    {goals.length}
                </span>
            </div>

            {goals.length === 0 ? (
                <div className="glass-card rounded-2xl p-7 text-center sm:rounded-3xl sm:p-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-3xl">
                        🎯
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                        {emptyTitle}
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                        {emptyDescription}
                    </p>
                </div>
            ) : (
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5">
                    {goals.map((goal) => {
                        const progressPercent = getProgressPercent(goal);
                        const milestone = getMilestoneBadge(goal);
                        const meta = getCategoryMeta(goal.category);
                        const isCompleted = goal.status === "COMPLETED";
                        const logData = logMap[goal.id] || {
                            progressAmount: 1,
                            note: "",
                        };

                        return (
                            <article
                                key={goal.id}
                                className={`group min-w-0 overflow-hidden rounded-[1.5rem] border shadow-xl sm:rounded-[2rem] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl ${isCompleted
                                        ? "border-emerald-100 bg-emerald-50/80 shadow-emerald-100/60"
                                        : "border-white/70 bg-white/80 shadow-slate-200/60"
                                    }`}
                            >
                                <div className={`h-2 bg-gradient-to-r ${meta.color}`} />

                                <div className="p-4 sm:p-6">
                                    <div className="mb-4 flex min-w-0 flex-col gap-3 sm:mb-5 md:flex-row md:items-start md:justify-between md:gap-4">
                                        <div className="min-w-0 flex items-start gap-3 sm:gap-4">
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 sm:rounded-3xl bg-gradient-to-br ${meta.color} text-2xl shadow-lg`}
                                            >
                                                {isCompleted ? "🏆" : meta.icon}
                                            </div>

                                            <div className="min-w-0">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${meta.soft}`}
                                                >
                                                    {goal.category}
                                                </span>

                                                <h3 className="mt-3 break-words text-xl font-black text-slate-900 sm:text-2xl">
                                                    {goal.title}
                                                </h3>

                                                <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                                                    {goal.description || "No description added."}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 ${isCompleted
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : goal.status === "PAUSED"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {goal.status}
                                        </span>
                                    </div>

                                    <div className="mb-4 rounded-2xl bg-slate-50 p-4 sm:mb-5 sm:rounded-3xl sm:p-5">
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-600">
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
                                            <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 sm:px-4">
                                                ✨ {milestone}
                                            </span>

                                            {goal.targetDate && (
                                                <span className="rounded-full bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 sm:px-4">
                                                    Target:{" "}
                                                    {new Date(goal.targetDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 sm:mb-5 sm:rounded-3xl sm:p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                                            AI Coach Plan
                                        </p>

                                        <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700 sm:leading-7">
                                            {goal.aiPlan ||
                                                "CogniHaven has not generated a plan yet."}
                                        </p>
                                    </div>

                                    {showLogging && (
                                        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 sm:rounded-3xl">
                                            <p className="mb-3 text-sm font-bold text-slate-800">
                                                Log a small win toward this goal
                                            </p>

                                            <div className="grid min-w-0 gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
                                                <div className="flex items-center rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
                                                    <span className="pl-4 text-sm font-bold text-slate-400">
                                                        +
                                                    </span>

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
                                                        className="w-full rounded-2xl border-0 bg-transparent px-2 py-3 text-sm text-slate-700 focus:ring-0"
                                                    />
                                                </div>

                                                <input
                                                    value={logData.note}
                                                    onChange={(e) =>
                                                        handleLogChange(
                                                            goal.id,
                                                            "note",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Optional note about this win..."
                                                    className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleLogProgress(goal.id)}
                                                className={`mt-3 w-full rounded-2xl bg-gradient-to-r ${meta.color} px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl`}
                                            >
                                                Log {goal.unitLabel || "Progress"}
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