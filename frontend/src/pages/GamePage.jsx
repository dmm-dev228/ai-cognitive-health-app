import { useState } from "react";
import { saveGameResult } from "../services/api";

/*
 * GamePage
 * --------
 * First cognitive game for CogniHaven.
 *
 * Game: Pattern Recall
 * User views a short pattern, then tries to repeat it.
 * Result is saved to backend for future analytics and AI context.
 */
function GamePage() {
    const [pattern, setPattern] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isShowingPattern, setIsShowingPattern] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    const difficulty = "EASY";
    const totalQuestions = 1;

    /*
     * Generates a simple number pattern.
     */
    const generatePattern = () => {
        const newPattern = [];

        for (let i = 0; i < 4; i++) {
            newPattern.push(Math.floor(Math.random() * 9) + 1);
        }

        return newPattern;
    };

    /*
     * Starts the game by showing the pattern briefly.
     */
    const startGame = () => {
        const newPattern = generatePattern();

        setPattern(newPattern);
        setUserInput("");
        setResultMessage("");
        setGameStarted(true);
        setIsShowingPattern(true);

        setTimeout(() => {
            setIsShowingPattern(false);
        }, 3000);
    };

    /*
     * Checks user answer and saves result to backend.
     */
    const submitAnswer = async () => {
        const correctAnswer = pattern.join("");
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
            await saveGameResult(gameResult);

            setResultMessage(
                isCorrect
                    ? "Correct! Your result was saved."
                    : `Not quite. The correct pattern was ${correctAnswer}. Result saved.`
            );
        } catch (err) {
            console.error("Failed to save game result:", err);
            setResultMessage("Game completed, but result could not be saved.");
        }
    };

    return (
        <section>
            <h2>Cognitive Games</h2>

            <p>
                Practice memory and attention with short cognitive games.
                Results are saved for future progress tracking.
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
                        />

                        <button onClick={submitAnswer}>
                            Submit Answer
                        </button>

                        <button onClick={startGame}>
                            Play Again
                        </button>
                    </div>
                )}

                {resultMessage && <p>{resultMessage}</p>}
            </div>
        </section>
    );
}

export default GamePage;