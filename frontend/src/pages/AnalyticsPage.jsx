import { useEffect, useState } from "react";
import { getGameResults } from "../services/api";

/*
 * AnalyticsPage
 * -------------
 * Displays simple game performance analytics.
 *
 * Current MVP:
 * - Total games played
 * - Average score
 * - Best score
 * - Average time
 * - Recent game history
 *
 * Future:
 * - Charts
 * - Mood/game correlation
 * - AI-generated performance summaries
 */
function AnalyticsPage() {
    const [gameResults, setGameResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchGameResults();
    }, []);

    /*
     * Fetch game results for the authenticated user.
     */
    const fetchGameResults = async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getGameResults();

            setGameResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch game results:", err);
            setError("Could not load analytics.");
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * Calculates average score across all saved games.
     */
    const getAverageScore = () => {
        if (gameResults.length === 0) return 0;

        const total = gameResults.reduce(
            (sum, result) => sum + (result.score || 0),
            0
        );

        return Math.round(total / gameResults.length);
    };

    /*
     * Finds highest score.
     */
    const getBestScore = () => {
        if (gameResults.length === 0) return 0;

        return Math.max(...gameResults.map((result) => result.score || 0));
    };

    /*
     * Calculates average completion time.
     */
    const getAverageTime = () => {
        if (gameResults.length === 0) return 0;

        const total = gameResults.reduce(
            (sum, result) => sum + (result.timeTakenSeconds || 0),
            0
        );

        return Math.round(total / gameResults.length);
    };

    return (
        <section>
            <h2>Analytics Dashboard</h2>

            <p>
                View your cognitive game activity and progress over time.
                These insights are supportive only and are not medical evaluations.
            </p>

            {error && <p className="error-message">{error}</p>}

            {isLoading ? (
                <p>Loading analytics...</p>
            ) : gameResults.length === 0 ? (
                <p>No game results yet. Play a game to see analytics.</p>
            ) : (
                <>
                    <div>
                        <h3>Performance Summary</h3>

                        <p>Total Games Played: {gameResults.length}</p>
                        <p>Average Score: {getAverageScore()}%</p>
                        <p>Best Score: {getBestScore()}%</p>
                        <p>Average Time: {getAverageTime()} seconds</p>
                    </div>

                    <div>
                        <h3>Recent Game Results</h3>

                        {gameResults.map((result) => (
                            <div key={result.id}>
                                <p>
                                    <strong>{result.gameType}</strong>
                                </p>

                                <p>Score: {result.score}%</p>
                                <p>
                                    Correct: {result.correctAnswers} /{" "}
                                    {result.totalQuestions}
                                </p>
                                <p>
                                    Time: {result.timeTakenSeconds} seconds
                                </p>
                                <p>
                                    Difficulty:{" "}
                                    {result.difficulty || "Not set"}
                                </p>
                                <p>
                                    Played At:{" "}
                                    {result.playedAt
                                        ? new Date(
                                              result.playedAt
                                          ).toLocaleString()
                                        : "Unknown"}
                                </p>

                                <hr />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default AnalyticsPage;