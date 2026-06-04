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
 * Supports multiple games:
 * - Pattern Recall
 * - Story Recall
 *
 * Users can filter by:
 * - Game type
 * - Difficulty
 */
function AnalyticsPage() {
  const [gameResults, setGameResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiSummary, setAiSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Filter 1: game type
  const [selectedGameType, setSelectedGameType] = useState("ALL_GAMES");

  // Filter 2: difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState("OVERALL");

  useEffect(() => {
    fetchGameResults();
  }, []);

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
   * Filters results by game type and difficulty.
   * This keeps analytics scalable as more games are added.
   */
  const filteredResults = useMemo(() => {
    let filtered = [...gameResults];

    if (selectedGameType !== "ALL_GAMES") {
      filtered = filtered.filter(
        (result) => result.gameType === selectedGameType
      );
    }

    if (selectedDifficulty !== "OVERALL") {
      filtered = filtered.filter(
        (result) =>
          (result.difficulty || "UNKNOWN").toUpperCase() ===
          selectedDifficulty
      );
    }

    return filtered;
  }, [gameResults, selectedGameType, selectedDifficulty]);

  const getAverageScore = () => {
    if (filteredResults.length === 0) return 0;

    const total = filteredResults.reduce(
      (sum, result) => sum + (result.score || 0),
      0
    );

    return Math.round(total / filteredResults.length);
  };

  const getBestScore = () => {
    if (filteredResults.length === 0) return 0;

    return Math.max(...filteredResults.map((result) => result.score || 0));
  };

  const getAverageTime = () => {
    if (filteredResults.length === 0) return 0;

    const total = filteredResults.reduce(
      (sum, result) => sum + (result.timeTakenSeconds || 0),
      0
    );

    return Math.round(total / filteredResults.length);
  };

  /*
   * Groups selected results by difficulty.
   * Used by the bar graph.
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
   * Formats selected results for the line chart.
   * Each point represents one filtered game attempt.
   */
  const getScoreTrendData = () => {
    return [...filteredResults].reverse().map((result, index) => ({
      game: index + 1,
      score: result.score || 0,
      time: result.timeTakenSeconds || 0,
      difficulty: result.difficulty || "UNKNOWN",
      gameType: result.gameType || "UNKNOWN"
    }));
  };

  const formatGameType = (gameType) => {
    if (gameType === "ALL_GAMES") return "All Games";

    return gameType
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const difficultyLabel =
    selectedDifficulty === "OVERALL"
      ? "Overall"
      : selectedDifficulty.charAt(0) +
      selectedDifficulty.slice(1).toLowerCase();

  const gameTypeLabel = formatGameType(selectedGameType);

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
            View supportive progress trends by game type and difficulty level.
            These insights are not medical evaluations.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
          <div className="glass-card rounded-2xl p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Game Type
            </label>

            <select
              value={selectedGameType}
              onChange={(event) => setSelectedGameType(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 lg:w-56"
            >
              <option value="ALL_GAMES">All Games</option>
              <option value="PATTERN_RECALL">Pattern Recall</option>
              <option value="STORY_RECALL">Story Recall</option>
              <option value="MEMORY_MATCH">Memory Match</option>
              <option value="WORD_BLOOM">Word Bloom</option>
            </select>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Difficulty
            </label>

            <select
              value={selectedDifficulty}
              onChange={(event) => setSelectedDifficulty(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 lg:w-56"
            >
              <option value="OVERALL">Overall</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
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

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="glass-card rounded-3xl p-5 hover-lift">
              <p className="text-sm font-semibold text-slate-500">
                Current View
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {gameTypeLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {difficultyLabel}
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
                No results for this view yet.
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Try playing {gameTypeLabel.toLowerCase()} on{" "}
                {difficultyLabel.toLowerCase()} difficulty.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="glass-card rounded-3xl p-6">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900">
                      Bar Graph: Score and Time
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Compare average score and completion time for{" "}
                      {gameTypeLabel} — {difficultyLabel}.
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
                      Follow your score trend across selected game attempts.
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

              <div className="glass-card rounded-3xl p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {gameTypeLabel} Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      Recent results for {difficultyLabel.toLowerCase()} view.
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
                            {formatGameType(result.gameType)}
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