import { useState } from "react";
import {
  saveGameResult,
  generateGameReflection
} from "../services/api";

const storySets = [
  {
    items: ["car", "house", "shoe"],
    story:
      "A small car drove past a quiet house, and someone left a shoe by the front door."
  },
  {
    items: ["apple", "book", "chair"],
    story:
      "An apple sat on top of a book while a chair waited beside the sunny window."
  },
  {
    items: ["dog", "key", "cup"],
    story:
      "A friendly dog found a shiny key next to a blue cup on the kitchen table."
  },
  {
    items: ["tree", "phone", "hat"],
    story:
      "Under a tall tree, someone heard a phone ring and picked up a forgotten hat."
  }
];

function GamePage() {
  const [selectedGame, setSelectedGame] = useState("PATTERN_RECALL");
  const [difficulty, setDifficulty] = useState("EASY");

  const [pattern, setPattern] = useState([]);
  const [storyData, setStoryData] = useState(null);

  const [userInput, setUserInput] = useState("");
  const [isShowingPrompt, setIsShowingPrompt] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState(null);
  const [showClue, setShowClue] = useState(false);

  const getPatternLength = () => {
    if (difficulty === "MEDIUM") return 5;
    if (difficulty === "HARD") return 6;
    return 4;
  };

  const getPromptDisplayTime = () => {
    if (selectedGame === "STORY_RECALL") {
      if (difficulty === "MEDIUM") return 15000;
      if (difficulty === "HARD") return 20000;
      return 10000;
    }

    if (difficulty === "MEDIUM") return 4000;
    if (difficulty === "HARD") return 5000;
    return 3000;
  };

  const generatePattern = () => {
    const newPattern = [];

    for (let i = 0; i < getPatternLength(); i++) {
      newPattern.push(Math.floor(Math.random() * 9) + 1);
    }

    return newPattern;
  };

  const pickStorySet = () => {
    return storySets[Math.floor(Math.random() * storySets.length)];
  };

  const resetGameState = () => {
    setPattern([]);
    setStoryData(null);
    setUserInput("");
    setResultMessage("");
    setAiReflection("");
    setShowClue(false);
    setAnswerStartTime(null);
  };

  const startGame = () => {
    resetGameState();
    setGameStarted(true);
    setIsShowingPrompt(true);

    if (selectedGame === "PATTERN_RECALL") {
      setPattern(generatePattern());
    }

    if (selectedGame === "STORY_RECALL") {
      setStoryData(pickStorySet());
    }

    setTimeout(() => {
      setIsShowingPrompt(false);
      setAnswerStartTime(Date.now());
    }, getPromptDisplayTime());
  };

  const saveResultAndReflect = async (gameResult, message) => {
    try {
      setResultMessage("");
      setAiReflection("");

      const savedResult = await saveGameResult(gameResult);

      setResultMessage(message);
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

  const submitPatternAnswer = async () => {
    const correctAnswer = pattern.join("");
    const cleanedInput = userInput.replace(/\s/g, "");

    let correctCount = 0;

    for (let i = 0; i < correctAnswer.length; i++) {
      if (cleanedInput[i] === correctAnswer[i]) {
        correctCount++;
      }
    }

    const totalQuestions = correctAnswer.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const timeTakenSeconds = answerStartTime
      ? Math.max(1, Math.round((Date.now() - answerStartTime) / 1000))
      : 1;

    const gameResult = {
      gameType: "PATTERN_RECALL",
      score,
      totalQuestions,
      correctAnswers: correctCount,
      timeTakenSeconds,
      difficulty
    };

    const message =
      score === 100
        ? `Perfect! Score: ${score}%. Time: ${timeTakenSeconds} seconds.`
        : `You remembered ${correctCount}/${totalQuestions} correctly. Score: ${score}%. The correct pattern was ${correctAnswer}.`;

    await saveResultAndReflect(gameResult, message);
  };

  const submitStoryAnswer = async () => {
    if (!storyData) return;

    const cleanedInput = userInput.toLowerCase();

    const correctItems = storyData.items.filter((item) =>
      cleanedInput.includes(item.toLowerCase())
    );

    const totalQuestions = storyData.items.length;
    const correctAnswers = correctItems.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const timeTakenSeconds = answerStartTime
      ? Math.max(1, Math.round((Date.now() - answerStartTime) / 1000))
      : 1;

    const gameResult = {
      gameType: "STORY_RECALL",
      score,
      totalQuestions,
      correctAnswers,
      timeTakenSeconds,
      difficulty
    };

    const message =
      score === 100
        ? `Excellent recall! You remembered all ${totalQuestions} items. Score: ${score}%.`
        : `You remembered ${correctAnswers}/${totalQuestions} items. Score: ${score}%. The original items were: ${storyData.items.join(
          ", "
        )}.`;

    await saveResultAndReflect(gameResult, message);
  };

  const submitAnswer = () => {
    if (selectedGame === "STORY_RECALL") {
      submitStoryAnswer();
    } else {
      submitPatternAnswer();
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
          Cognitive Wellness Games
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Train focus, memory, and attention.
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Practice short memory exercises designed for cognitive engagement,
          supportive wellness tracking, and AI-guided reflection.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="border-b border-white/60 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-8 py-10 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                  {selectedGame === "STORY_RECALL"
                    ? "Story Recall"
                    : "Pattern Recall"}
                </p>

                <h3 className="mt-3 text-4xl font-black tracking-tight">
                  {selectedGame === "STORY_RECALL"
                    ? "Story Memory Challenge"
                    : "Memory Challenge"}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                  {selectedGame === "STORY_RECALL"
                    ? "Read a short story, remember the three original items, then recall them after the story disappears."
                    : "Memorize the number sequence, then enter it from memory after it disappears."}
                </p>
              </div>

              {!gameStarted && (
                <div className="grid gap-4 rounded-3xl bg-white/15 p-5 backdrop-blur-xl sm:grid-cols-2 lg:w-[420px]">
                  <label className="block">
                    <span className="mb-3 block text-sm font-semibold text-white">
                      Game
                    </span>

                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-sm font-semibold text-white backdrop-blur focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <option className="text-slate-900" value="PATTERN_RECALL">
                        Pattern Recall
                      </option>

                      <option className="text-slate-900" value="STORY_RECALL">
                        Story Recall
                      </option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-sm font-semibold text-white">
                      Difficulty
                    </span>

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
                  </label>

                  <button
                    onClick={startGame}
                    className="sm:col-span-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Start Game
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {gameStarted && isShowingPrompt && selectedGame === "PATTERN_RECALL" && (
              <div className="animate-fade-in text-center">
                <div className="mx-auto max-w-2xl rounded-[2rem] bg-gradient-to-br from-indigo-50 to-violet-50 p-10 shadow-inner">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    Memorize This Pattern
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    {pattern.map((number, index) => (
                      <div
                        key={index}
                        className="flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-white text-3xl font-black text-indigo-700 shadow-lg shadow-indigo-100"
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

            {gameStarted && isShowingPrompt && selectedGame === "STORY_RECALL" && storyData && (
              <div className="animate-fade-in text-center">
                <div className="mx-auto max-w-3xl rounded-[2rem] bg-gradient-to-br from-emerald-50 to-sky-50 p-10 shadow-inner">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                    Read and Remember
                  </p>

                  <p className="mt-6 text-xl font-bold leading-9 text-slate-800">
                    {storyData.story}
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {storyData.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="mt-8 text-sm font-medium text-slate-500">
                    Remember the three items. You will be asked for them shortly.
                  </p>
                </div>
              </div>
            )}

            {gameStarted && !isShowingPrompt && (
              <div className="animate-fade-in">
                <div className="mx-auto max-w-2xl text-center">
                  <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
                      Recall Phase
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-slate-900">
                      {selectedGame === "STORY_RECALL"
                        ? "What were the three original items?"
                        : "Enter the pattern you remember"}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {selectedGame === "STORY_RECALL"
                        ? "Type the items you remember. Example: car, house, shoe"
                        : "Type the sequence without spaces."}
                    </p>
                  </div>

                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={
                      selectedGame === "STORY_RECALL"
                        ? "Example: car, house, shoe"
                        : "Example: 1234"
                    }
                    disabled={isGeneratingReflection}
                    className={`w-full rounded-[2rem] border border-slate-200 bg-white px-6 py-5 text-center font-bold text-slate-700 shadow-lg shadow-slate-100 transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60 ${selectedGame === "STORY_RECALL"
                        ? "text-lg"
                        : "text-3xl tracking-[0.5em]"
                      }`}
                  />

                  {selectedGame === "STORY_RECALL" && storyData && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowClue(true)}
                        disabled={isGeneratingReflection}
                        className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
                      >
                        Need a clue?
                      </button>

                      {showClue && (
                        <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                          Clue: The items were everyday objects mentioned in the story.
                          First letters:{" "}
                          {storyData.items
                            .map((item) => item.charAt(0).toUpperCase())
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={submitAnswer}
                      disabled={isGeneratingReflection}
                      className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGeneratingReflection ? "Saving..." : "Submit Answer"}
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
                        resetGameState();
                      }}
                      disabled={isGeneratingReflection}
                      className="rounded-2xl bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Change Game
                    </button>
                  </div>
                </div>
              </div>
            )}

            {resultMessage && (
              <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-5 text-center">
                <p className="text-sm font-semibold leading-7 text-indigo-700">
                  {resultMessage}
                </p>
              </div>
            )}

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