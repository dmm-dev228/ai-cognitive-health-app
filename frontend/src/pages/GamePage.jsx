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

  const correctAnswer = pattern.join("");
  const totalQuestions = correctAnswer.length;

  // Returns pattern length based on selected difficulty.
  const getPatternLength = () => {
    if (difficulty === "MEDIUM") return 5;
    if (difficulty === "HARD") return 6;
    return 4;
  };

  // Returns how long the pattern should stay visible.
  const getDisplayTime = () => {
    if (difficulty === "MEDIUM") return 4000;
    if (difficulty === "HARD") return 5000;
    return 3000;
  };

  // Generates a random number pattern.
  const generatePattern = () => {
    const newPattern = [];
    const patternLength = getPatternLength();

    for (let i = 0; i < patternLength; i++) {
      newPattern.push(Math.floor(Math.random() * 9) + 1);
    }

    return newPattern;
  };

  // Starts or restarts the game.
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

  //Checks answer, saves game result, then generates AI reflection.
  const submitAnswer = async () => {
    const correctAnswer = pattern.join("");
    const cleanedInput = userInput.replace(/\s/g, "");

    /*
     * Count how many positions match correctly.
     *
     * Example:
     * Pattern: 1234
     * Input:   1235
     * Result:  3 correct
     */
    let correctCount = 0;

    for (let i = 0; i < correctAnswer.length; i++) {
      if (cleanedInput[i] === correctAnswer[i]) {
        correctCount++;
      }
    }

    const correctAnswers = correctCount;

    // Score is now percentage-based instead of all-or-nothing.
    const score = Math.round(
      (correctCount / correctAnswer.length) * 100
    );

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
        score === 100
          ? `Perfect! Score: ${score}%. Time: ${timeTakenSeconds} seconds.`
          : `You remembered ${correctAnswers}/${correctAnswer.length} correctly. Score: ${score}%. The correct pattern was ${correctAnswer}.`
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
    <section className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
          Cognitive Wellness Games
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Train focus, memory, and attention.
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Practice short memory exercises designed for cognitive engagement and
          supportive wellness tracking.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="glass-card overflow-hidden rounded-[2rem]">
          {/* Top section */}
          <div className="border-b border-white/60 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-8 py-10 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                  Pattern Recall
                </p>

                <h3 className="mt-3 text-4xl font-black tracking-tight">
                  Memory Challenge
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                  Memorize the number sequence, then enter it from memory after
                  it disappears.
                </p>
              </div>

              {/* Difficulty selector */}
              {!gameStarted && (
                <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">
                  <label className="mb-3 block text-sm font-semibold text-white">
                    Difficulty
                  </label>

                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-sm font-semibold text-white backdrop-blur focus:outline-none focus:ring-4 focus:ring-white/20"
                  >
                    <option className="text-slate-900" value="EASY">
                      Easy
                    </option>

                    <option className="text-slate-900" value="MEDIUM">
                      Medium
                    </option>

                    <option className="text-slate-900" value="HARD">
                      Hard
                    </option>
                  </select>

                  <button
                    onClick={startGame}
                    className="mt-4 w-full rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Start Game
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Game area */}
          <div className="p-6 sm:p-8">
            {/* Pattern display mode */}
            {gameStarted && isShowingPattern && (
              <div className="animate-fade-in text-center">
                <div className="mx-auto max-w-2xl rounded-[2rem] bg-gradient-to-br from-indigo-50 to-violet-50 p-10 shadow-inner">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    Memorize This Pattern
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    {pattern.map((number, index) => (
                      <div
                        key={index}
                        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-black text-indigo-700 shadow-lg shadow-indigo-100 animate-pulse"
                      >
                        {number}
                      </div>
                    ))}
                  </div>

                  <p className="mt-8 text-sm font-medium text-slate-500">
                    Focus and remember the sequence before it disappears.
                  </p>
                </div>
              </div>
            )}

            {/* Answer mode */}
            {gameStarted && !isShowingPattern && (
              <div className="animate-fade-in">
                <div className="mx-auto max-w-2xl text-center">
                  <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
                      Recall Phase
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-slate-900">
                      Enter the pattern you remember
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Type the sequence without spaces.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Example: 1234"
                    disabled={isGeneratingReflection}
                    className="w-full rounded-[2rem] border border-slate-200 bg-white px-6 py-5 text-center text-3xl font-bold tracking-[0.5em] text-slate-700 shadow-lg shadow-slate-100 transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={submitAnswer}
                      disabled={isGeneratingReflection}
                      className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGeneratingReflection
                        ? "Saving..."
                        : "Submit Answer"}
                    </button>

                    <button
                      onClick={startGame}
                      disabled={isGeneratingReflection}
                      className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                      className="rounded-2xl bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Change Difficulty
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Result panel */}
            {resultMessage && (
              <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-5 text-center">
                <p className="text-sm font-semibold leading-7 text-indigo-700">
                  {resultMessage}
                </p>
              </div>
            )}

            {/* AI loading state */}
            {isGeneratingReflection && (
              <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />

                  <p className="text-sm font-semibold text-emerald-700">
                    CogniHaven is reflecting on your progress...
                  </p>
                </div>
              </div>
            )}

            {/* AI reflection card */}
            {aiReflection && (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-lg shadow-emerald-100">
                <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                    AI Reflection
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    CogniHaven Insight
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-8 text-slate-700">
                    {aiReflection}
                  </p>
                </div>
              </div>
            )}

            {/* Empty state before game starts */}
            {!gameStarted && (
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-sky-50 p-5">
                  <div className="mb-3 text-3xl">🧠</div>

                  <h4 className="text-lg font-bold text-slate-900">
                    Memory Focus
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Practice short-term recall and concentration skills.
                  </p>
                </div>

                <div className="rounded-3xl bg-violet-50 p-5">
                  <div className="mb-3 text-3xl">📈</div>

                  <h4 className="text-lg font-bold text-slate-900">
                    Track Progress
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Results are saved to your wellness analytics dashboard.
                  </p>
                </div>

                <div className="rounded-3xl bg-emerald-50 p-5">
                  <div className="mb-3 text-3xl">✨</div>

                  <h4 className="text-lg font-bold text-slate-900">
                    AI Insights
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Receive supportive reflections after each session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GamePage;