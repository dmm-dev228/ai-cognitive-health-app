import { useEffect, useMemo, useState } from "react";
import {
  getGameResults,
  generateAnalyticsSummary
} from "../services/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";

/*
 * AnalyticsPage
 * -------------
 * Displays cognitive wellness game analytics.
 *
 * Current:
 * - Total games played
 * - Average score
 * - Best score
 * - Average time
 * - Performance by selected category
 * - Bar chart for average score and average time
 * - Line chart for score trend over time
 * - AI-generated analytics insight
 * - Recent game history
 *
 * Future:
 * - Mood/game correlation
 * - Weekly progress reports
 * - More advanced wellness trend summaries
 */
function AnalyticsPage() {
  const [gameResults, setGameResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores AI-generated analytics insight.
  const [aiSummary, setAiSummary] = useState("");

  // Tracks AI summary loading state.
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Controls which analytics category the dashboard is currently showing.
  const [selectedCategory, setSelectedCategory] = useState("OVERALL");

  useEffect(() => {
    fetchGameResults();
  }, []);

  /*
   * Fetch game results for the authenticated user.
   * After results load, request an AI-generated summary
   * so the dashboard includes both visuals and plain-language insight.
   */
  const fetchGameResults = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getGameResults();

      const results = Array.isArray(data) ? data : [];

      setGameResults(results);

      if (results.length > 0) {
        setIsGeneratingSummary(true);

        try {
          const summary = await generateAnalyticsSummary();

          setAiSummary(
            summary.supportiveResponse ||
              "CogniHaven could not generate an analytics summary."
          );
        } catch (summaryError) {
          console.error("Failed to generate analytics summary:", summaryError);
          setAiSummary("");
        } finally {
          setIsGeneratingSummary(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch game results:", err);
      setError("Could not load analytics.");
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Filters results based on the dropdown.
   * OVERALL shows every result.
   * EASY, MEDIUM, and HARD only show that difficulty.
   */
  const filteredResults = useMemo(() => {
    if (selectedCategory === "OVERALL") return gameResults;

    return gameResults.filter(
      (result) =>
        (result.difficulty || "UNKNOWN").toUpperCase() === selectedCategory
    );
  }, [gameResults, selectedCategory]);

  /*
   * Calculates average score across the selected category.
   */
  const getAverageScore = () => {
    if (filteredResults.length === 0) return 0;

    const total = filteredResults.reduce(
      (sum, result) => sum + (result.score || 0),
      0
    );

    return Math.round(total / filteredResults.length);
  };

  /*
   * Finds highest score inside the selected category.
   */
  const getBestScore = () => {
    if (filteredResults.length === 0) return 0;

    return Math.max(...filteredResults.map((result) => result.score || 0));
  };

  /*
   * Calculates average completion time inside the selected category.
   */
  const getAverageTime = () => {
    if (filteredResults.length === 0) return 0;

    const total = filteredResults.reduce(
      (sum, result) => sum + (result.timeTakenSeconds || 0),
      0
    );

    return Math.round(total / filteredResults.length);
  };

  /*
   * Groups game results by difficulty.
   * Overall view compares Easy, Medium, and Hard.
   * Difficulty-specific views show one category clearly.
   */
  const getStatsByDifficulty = () => {
    const groups = {};

    filteredResults.forEach((result) => {
      const difficulty = result.difficulty || "UNKNOWN";

      if (!groups[difficulty]) {
        groups[difficulty] = {
          totalGames: 0,
          totalScore: 0,
          totalTime: 0
        };
      }

      groups[difficulty].totalGames += 1;
      groups[difficulty].totalScore += result.score || 0;
      groups[difficulty].totalTime += result.timeTakenSeconds || 0;
    });

    return Object.entries(groups).map(([difficulty, stats]) => ({
      difficulty,
      totalGames: stats.totalGames,
      averageScore: Math.round(stats.totalScore / stats.totalGames),
      averageTime: Math.round(stats.totalTime / stats.totalGames)
    }));
  };

  /*
   * Formats game results for the line chart.
   * Each point represents one game attempt over time.
   */
  const getScoreTrendData = () => {
    return [...filteredResults].reverse().map((result, index) => ({
      game: index + 1,
      score: result.score || 0,
      time: result.timeTakenSeconds || 0,
      difficulty: result.difficulty || "UNKNOWN"
    }));
  };

  const categoryLabel =
    selectedCategory === "OVERALL"
      ? "Overall"
      : selectedCategory.charAt(0) + selectedCategory.slice(1).toLowerCase();

  return (
    <section className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
            Analytics Dashboard
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Track your wellness game progress.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            View supportive progress trends by overall activity or by difficulty
            level. These insights are not medical evaluations.
          </p>
        </div>

        {/* Category dropdown keeps the dashboard clean instead of showing every chart at once. */}
        <div className="glass-card rounded-2xl p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            View Category
          </label>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 lg:w-56"
          >
            <option value="OVERALL">Overall</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
          <p className="font-semibold text-slate-700">Loading analytics...</p>
        </div>
      ) : gameResults.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-3xl">
            📊
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            No game results yet.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Play a cognitive wellness game to start building your analytics
            dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* AI-generated dashboard insight */}
          <div className="glass-card rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  CogniHaven Insight
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  Supportive analytics summary
                </h3>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                AI Summary
              </span>
            </div>

            {isGeneratingSummary ? (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
                CogniHaven is reviewing your wellness activity...
              </div>
            ) : aiSummary ? (
              <div className="rounded-3xl border border-emerald-100 bg-white px-5 py-4 text-sm leading-7 text-slate-700 shadow-sm">
                {aiSummary}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No AI summary available yet.
              </p>
            )}
          </div>

          {/* Summary cards change based on the selected dropdown category. */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="glass-card rounded-3xl p-5 hover-lift">
              <p className="text-sm font-semibold text-slate-500">
                Category
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {categoryLabel}
              </p>
            </div>

            <div className="glass-card rounded-3xl p-5 hover-lift">
              <p className="text-sm font-semibold text-slate-500">
                Games Played
              </p>
              <p className="mt-2 text-3xl font-black text-indigo-600">
                {filteredResults.length}
              </p>
            </div>

            <div className="glass-card rounded-3xl p-5 hover-lift">
              <p className="text-sm font-semibold text-slate-500">
                Average Score
              </p>
              <p className="mt-2 text-3xl font-black text-emerald-600">
                {getAverageScore()}%
              </p>
            </div>

            <div className="glass-card rounded-3xl p-5 hover-lift">
              <p className="text-sm font-semibold text-slate-500">
                Best / Avg Time
              </p>
              <p className="mt-2 text-3xl font-black text-violet-600">
                {getBestScore()}%
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Avg Time: {getAverageTime()} sec
              </p>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <h3 className="text-2xl font-bold text-slate-900">
                No {categoryLabel} results yet.
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Try playing a {categoryLabel.toLowerCase()} game to see this
                category’s analytics.
              </p>
            </div>
          ) : (
            <>
              {/* Charts are grouped together so the page feels organized instead of cluttered. */}
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="glass-card rounded-3xl p-6">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900">
                      Bar Graph: Score and Time
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Compare average score and average completion time for{" "}
                      {categoryLabel}.
                    </p>
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={getStatsByDifficulty()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="difficulty">
                        <Label
                          value="Difficulty"
                          position="insideBottom"
                          offset={-5}
                        />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Score / Seconds"
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip />
                      <Bar dataKey="averageScore" name="Average Score (%)" />
                      <Bar dataKey="averageTime" name="Average Time (sec)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900">
                      Line Graph: Progress Over Time
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Follow your score trend across game attempts for{" "}
                      {categoryLabel}.
                    </p>
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={getScoreTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="game">
                        <Label
                          value="Game Attempt"
                          position="insideBottom"
                          offset={-5}
                        />
                      </XAxis>
                      <YAxis domain={[0, 100]}>
                        <Label
                          value="Score (%)"
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Score (%)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed category information is shown after the visuals. */}
              <div className="glass-card rounded-3xl p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {categoryLabel} Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      Recent results and supporting information for this view.
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
                    {filteredResults.length} results
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredResults.map((result) => (
                    <div
                      key={result.id}
                      className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {result.gameType}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {result.difficulty || "Not set"}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {result.score}%
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        <p>
                          Correct:{" "}
                          <span className="font-semibold text-slate-800">
                            {result.correctAnswers} / {result.totalQuestions}
                          </span>
                        </p>
                        <p>
                          Time:{" "}
                          <span className="font-semibold text-slate-800">
                            {result.timeTakenSeconds} seconds
                          </span>
                        </p>
                        <p>
                          Played:{" "}
                          <span className="font-semibold text-slate-800">
                            {result.playedAt
                              ? new Date(result.playedAt).toLocaleString()
                              : "Unknown"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default AnalyticsPage;