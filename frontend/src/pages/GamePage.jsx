import { useState } from "react";
import {
    saveGameResult,
    generateGameReflection
} from "../services/api";

/*
 * GamePage
 * --------
 * Cognitive wellness games for CogniHaven.
 *
 * Game: Pattern Recall
 *
 * User views a number pattern, then repeats it from memory.
 * Difficulty changes the pattern length.
 *
 * Results are saved for:
 * - analytics dashboard
 * - AI wellness reflections
 * - future progress tracking
 */
function GamePage() {
    const [pattern, setPattern] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [difficulty, setDifficulty] = useState("EASY");
    const [isShowingPattern, setIsShowingPattern] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [aiReflection, setAiReflection] = useState("");
    const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);

    // Stores when the user begins answering so we can calculate real completion time.
    const [answerStartTime, setAnswerStartTime] = useState(null);

    const totalQuestions = 1;

    /*
     * Returns pattern length based on selected difficulty.
     */
    const getPatternLength = () => {
        if (difficulty === "MEDIUM") return 5;
        if (difficulty === "HARD") return 6;
        return 4;
    };

    /*
     * Returns how long the pattern should stay visible.
     */
    const getDisplayTime = () => {
        if (difficulty === "MEDIUM") return 4000;
        if (difficulty === "HARD") return 5000;
        return 3000;
    };

    /*
     * Generates a random number pattern.
     */
    const generatePattern = () => {
        const newPattern = [];
        const patternLength = getPatternLength();

        for (let i = 0; i < patternLength; i++) {
            newPattern.push(Math.floor(Math.random() * 9) + 1);
        }

        return newPattern;
    };

    /*
     * Starts or restarts the game.
     */
    const startGame = () => {
        const newPattern = generatePattern();

        setPattern(newPattern);
        setUserInput("");
        setResultMessage("");
        setAiReflection("");
        setGameStarted(true);
        setIsShowingPattern(true);
        setAnswerStartTime(null);

        setTimeout(() => {
            setIsShowingPattern(false);

            // Start timer when user is allowed to answer.
            setAnswerStartTime(Date.now());
        }, getDisplayTime());
    };

    /*
     * Calculates score based on correctness and difficulty.
     */
    /*
     * Score represents correctness only.
     * Difficulty is stored separately for analytics.
     */
    const calculateScore = (isCorrect) => {
        return isCorrect ? 100 : 0;
    };

    /*
     * Checks answer, saves game result, then generates AI reflection.
     */
    const submitAnswer = async () => {
        const correctAnswer = pattern.join("");
        const cleanedInput = userInput.replace(/\s/g, "");

        const isCorrect = cleanedInput === correctAnswer;
        const score = calculateScore(isCorrect);
        const correctAnswers = isCorrect ? 1 : 0;

        const timeTakenSeconds = answerStartTime
            ? Math.max(1, Math.round((Date.now() - answerStartTime) / 1000))
            : 0;

        const gameResult = {
            gameType: "PATTERN_RECALL",
            score,
            totalQuestions,
            correctAnswers,
            timeTakenSeconds,
            difficulty
        };

        try {
            setResultMessage("");
            setAiReflection("");

            const savedResult = await saveGameResult(gameResult);

            setResultMessage(
                isCorrect
                    ? `Correct! Score: ${score}. Time: ${timeTakenSeconds} seconds.`
                    : `Not quite. The correct pattern was ${correctAnswer}. Time: ${timeTakenSeconds} seconds.`
            );

            setIsGeneratingReflection(true);

            const aiResult = await generateGameReflection(savedResult.id);

            setAiReflection(
                aiResult.supportiveResponse ||
                "CogniHaven generated a reflection, but no response text was returned."
            );
        } catch (err) {
            console.error("Failed during game result/reflection flow:", err);
            setResultMessage(
                "Game completed, but the result or reflection could not be saved."
            );
        } finally {
            setIsGeneratingReflection(false);
        }
    };

    return (
        <section>
            <h2>Cognitive Games</h2>

            <p>
                Practice memory and attention with short cognitive wellness
                games. Results are saved for progress tracking and supportive
                AI insights.
            </p>

            <div>
                <h3>Pattern Recall</h3>

                {!gameStarted && (
                    <div>
                        <label>
                            Difficulty:
                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(e.target.value)
                                }
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </label>

                        <button onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                )}

                {gameStarted && isShowingPattern && (
                    <div>
                        <p>Memorize this pattern:</p>
                        <h2>{pattern.join(" ")}</h2>
                    </div>
                )}

                {gameStarted && !isShowingPattern && (
                    <div>
                        <p>Enter the pattern you remember:</p>

                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Example: 1234"
                            disabled={isGeneratingReflection}
                        />

                        <button
                            onClick={submitAnswer}
                            disabled={isGeneratingReflection}
                        >
                            {isGeneratingReflection
                                ? "Saving..."
                                : "Submit Answer"}
                        </button>

                        <button
                            onClick={startGame}
                            disabled={isGeneratingReflection}
                        >
                            Play Again
                        </button>

                        <button
                            onClick={() => {
                                setGameStarted(false);
                                setUserInput("");
                                setPattern([]);
                                setResultMessage("");
                                setAiReflection("");
                            }}
                            disabled={isGeneratingReflection}
                        >
                            Change Difficulty
                        </button>
                    </div>
                )}

                {resultMessage && <p>{resultMessage}</p>}

                {isGeneratingReflection && (
                    <p>CogniHaven is reflecting on your game...</p>
                )}

                {aiReflection && (
                    <div className="ai-bubble">
                        <strong>CogniHaven Reflection</strong>
                        <p>{aiReflection}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default GamePage;