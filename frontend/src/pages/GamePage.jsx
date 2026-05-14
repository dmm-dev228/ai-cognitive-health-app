import { useState } from "react";
import {
    saveGameResult,
    generateGameReflection
} from "../services/api";

/*
 * GamePage
 * --------
 * First cognitive wellness game for CogniHaven.
 *
 * Game: Pattern Recall
 * User views a short pattern, then tries to repeat it.
 *
 * Flow:
 * 1. Show pattern
 * 2. User enters remembered pattern
 * 3. Save game result to backend
 * 4. Generate AI wellness reflection
 * 5. Display supportive reflection to user
 */
function GamePage() {
    const [pattern, setPattern] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isShowingPattern, setIsShowingPattern] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    // Stores AI reflection after the user completes a game.
    const [aiReflection, setAiReflection] = useState("");

    // Tracks when CogniHaven is generating the game reflection.
    const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);

    const difficulty = "EASY";
    const totalQuestions = 1;

    /*
     * Generates a simple 4-number pattern.
     *
     * Example:
     * [3, 8, 1, 6]
     */
    const generatePattern = () => {
        const newPattern = [];

        for (let i = 0; i < 4; i++) {
            newPattern.push(Math.floor(Math.random() * 9) + 1);
        }

        return newPattern;
    };

    /*
     * Starts or restarts the game.
     *
     * The pattern is shown briefly, then hidden so the user
     * can try to recall it from memory.
     */
    const startGame = () => {
        const newPattern = generatePattern();

        setPattern(newPattern);
        setUserInput("");
        setResultMessage("");
        setAiReflection("");
        setGameStarted(true);
        setIsShowingPattern(true);

        // Hide the pattern after 3 seconds.
        setTimeout(() => {
            setIsShowingPattern(false);
        }, 3000);
    };

    /*
     * Checks the user's answer, saves the result,
     * then asks CogniHaven to generate a supportive AI reflection.
     */
    const submitAnswer = async () => {
        const correctAnswer = pattern.join("");

        // Remove spaces so "1 2 3 4" and "1234" are both accepted.
        const cleanedInput = userInput.replace(/\s/g, "");

        const isCorrect = cleanedInput === correctAnswer;

        const score = isCorrect ? 100 : 0;
        const correctAnswers = isCorrect ? 1 : 0;

        const gameResult = {
            gameType: "PATTERN_RECALL",
            score,
            totalQuestions,
            correctAnswers,
            timeTakenSeconds: 3,
            difficulty
        };

        try {
            setResultMessage("");
            setAiReflection("");

            /*
             * Step 1:
             * Save the game result first.
             * The backend returns the saved result including its ID.
             */
            const savedResult = await saveGameResult(gameResult);

            setResultMessage(
                isCorrect
                    ? "Correct! Your result was saved."
                    : `Not quite. The correct pattern was ${correctAnswer}. Result saved.`
            );

            /*
             * Step 2:
             * Use the saved game result ID to generate an AI reflection.
             */
            setIsGeneratingReflection(true);

            const aiResult = await generateGameReflection(savedResult.id);

            /*
             * Step 3:
             * Store the AI reflection so it can display on the page.
             */
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
                games. Results are saved for future progress tracking and
                supportive AI insights.
            </p>

            <div>
                <h3>Pattern Recall</h3>

                {!gameStarted && (
                    <button onClick={startGame}>
                        Start Game
                    </button>
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