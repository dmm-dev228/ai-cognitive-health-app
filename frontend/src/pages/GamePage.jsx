import { useRef, useEffect, useState } from "react";
import VoiceControls from "../components/VoiceControls";
import MemoryMatchGame from "../components/games/MemoryMatchGame";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import WordBloomGame from "../components/games/WordBloomGame";
import {
  saveGameResult,
  generateGameReflection,
  generateStoryRecallGame,
  generateWordBloomGame,
} from "../services/api";

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

  const [storyPhase, setStoryPhase] = useState("WORDS");
  const [countdown, setCountdown] = useState(0);
  const [spokenStory, setSpokenStory] = useState("");

  const gameAreaRef = useRef(null);
  const answerInputRef = useRef(null);
  const memoryMatchRef = useRef(null);
  const storyWordsRef = useRef(null);
  const storyNarrationRef = useRef(null);
  const storyRecallRef = useRef(null);

  const [wordBloomData, setWordBloomData] = useState(null);

  const { speak } = useTextToSpeech();

  const scrollToGameArea = () => {
    setTimeout(() => {
      gameAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const scrollToMemoryMatch = () => {
    setTimeout(() => {
      memoryMatchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  const scrollToRef = (ref, delay = 150) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, delay);
  };

  const getGameLabel = () => {
    if (selectedGame === "STORY_RECALL") return "Story Recall";
    if (selectedGame === "MEMORY_MATCH") return "Memory Match";
    if (selectedGame === "WORD_BLOOM") return "Word Bloom";
    return "Pattern Recall";
  };

  const getGameHeading = () => {
    if (selectedGame === "STORY_RECALL") return "Story Memory Challenge";
    if (selectedGame === "MEMORY_MATCH") return "Memory Match Challenge";
    if (selectedGame === "WORD_BLOOM") return "Word Bloom Challenge";
    return "Memory Challenge";
  };

  const getGameDescription = () => {
    if (selectedGame === "STORY_RECALL") {
      return "Memorize the target words, listen to the story, then recall the original words.";
    }

    if (selectedGame === "MEMORY_MATCH") {
      return "Flip cards, find matching pairs, and practice focus, recognition, and memory.";
    }

    if (selectedGame === "WORD_BLOOM") {
      return "Guess the hidden five-letter word using calm focus, pattern recognition, and feedback.";
    }

    return "Memorize the number sequence, then enter it from memory after it disappears.";
  };

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

  const resetGameState = () => {
    setPattern([]);
    setStoryData(null);
    setUserInput("");
    setResultMessage("");
    setAiReflection("");
    setShowClue(false);
    setAnswerStartTime(null);
    setStoryPhase("WORDS");
    setCountdown(0);
    setSpokenStory("");
    setWordBloomData(null);
  };

  useEffect(() => {
    if (
      gameStarted &&
      !isShowingPrompt &&
      selectedGame !== "MEMORY_MATCH" &&
      !isGeneratingReflection
    ) {
      answerInputRef.current?.focus();
    }
  }, [gameStarted, isShowingPrompt, selectedGame, isGeneratingReflection]);

  const startGame = async () => {
    const scrollToGameArea = () => {
      setTimeout(() => {
        gameAreaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    };

    resetGameState();
    setGameStarted(true);
    setIsShowingPrompt(true);
    scrollToGameArea();

    if (selectedGame === "MEMORY_MATCH") {
      setIsShowingPrompt(false);
      setAnswerStartTime(Date.now());
      scrollToMemoryMatch();
      return;
    }

    if (selectedGame === "WORD_BLOOM") {
      try {
        const generatedWordGame = await generateWordBloomGame(difficulty);

        setWordBloomData(generatedWordGame);
        setIsShowingPrompt(false);
        setAnswerStartTime(Date.now());
      } catch (err) {
        console.error("Failed to generate Word Bloom game:", err);
        setResultMessage("Could not generate Word Bloom. Please try again.");
        setGameStarted(false);
        setIsShowingPrompt(false);
      }

      return;
    }

    if (selectedGame === "PATTERN_RECALL") {
      setPattern(generatePattern());

      setTimeout(() => {
        setIsShowingPrompt(false);
        setAnswerStartTime(Date.now());
        scrollToGameArea();
      }, getPromptDisplayTime());

      return;
    }

    if (selectedGame === "STORY_RECALL") {
      try {
        /*
         * Generate a fresh Story Recall round from the backend.
         * Backend returns AI-generated target words and a fresh story.
         */
        const generatedStoryGame =
          await generateStoryRecallGame(difficulty);

        setStoryData(generatedStoryGame);
        setStoryPhase("WORDS");
        scrollToRef(storyWordsRef);

        const memorizeSeconds =
          difficulty === "HARD" ? 10 : difficulty === "MEDIUM" ? 8 : 6;

        setCountdown(memorizeSeconds);

        let timeLeft = memorizeSeconds;

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);

          if (timeLeft <= 0) {
            clearInterval(countdownInterval);

            /*
             * After the words disappear, show the story and automatically
             * read it aloud as part of the game.
             */
            setStoryPhase("STORY");
            setSpokenStory(generatedStoryGame.story);
            scrollToRef(storyNarrationRef);

            /*
             * Move to the recall phase only after the story narration finishes.
             * This prevents the answer screen from appearing before the AI is done reading.
             */
            speak(generatedStoryGame.story, () => {
              setStoryPhase("RECALL");
              setIsShowingPrompt(false);
              setAnswerStartTime(Date.now());
              scrollToRef(storyRecallRef);
            });
          }
        }, 1000);
      } catch (err) {
        console.error("Failed to generate Story Recall game:", err);
        setResultMessage(
          "Could not generate a Story Recall game. Please try again."
        );
        setGameStarted(false);
        setIsShowingPrompt(false);
      }
    }
  };

  const saveResultAndReflect = async (gameResult, message) => {
    try {
      setResultMessage("");
      setAiReflection("");

      const savedResult = await saveGameResult(gameResult);

      setResultMessage(message);

      try {
        setIsGeneratingReflection(true);

        const aiResult = await generateGameReflection(savedResult.id);

        setAiReflection(
          aiResult.supportiveResponse ||
            "CogniHaven generated a reflection, but no response text was returned."
        );
      } catch (reflectionError) {
        console.error("AI reflection failed:", reflectionError);

        setAiReflection(
          "Your game result was saved successfully. CogniHaven could not generate an AI reflection this time."
        );
      }
    } catch (saveError) {
      console.error("Failed to save game result:", saveError);

      setResultMessage(
        "Game completed, but the result could not be saved."
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
      difficulty,
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

    const correctItems = storyData.targetWords.filter((item) =>
      cleanedInput.includes(item.toLowerCase())
    );

    const totalQuestions = storyData.targetWords.length;
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
      difficulty,
    };

    const message =
      score === 100
        ? `Excellent recall! You remembered all ${totalQuestions} items. Score: ${score}%.`
        : `You remembered ${correctAnswers}/${totalQuestions} items. Score: ${score}%. The original items were: ${storyData.targetWords.join(
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
      {/* =========================================================
          PAGE HEADER
          ========================================================= */}
      <div className="mb-6 text-center sm:mb-8 lg:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 sm:text-sm sm:tracking-[0.25em]">
          Cognitive Wellness Games
        </p>

        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 min-[390px]:text-3xl sm:mt-3 sm:text-4xl">
          Train focus, memory, and attention.
        </h2>

        <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-4 sm:leading-7">
          Practice short memory exercises designed for cognitive engagement,
          supportive wellness tracking, and AI-guided reflection.
        </p>
      </div>

      {/* =========================================================
          GAME CONTAINER
          ========================================================= */}
      <div
        ref={gameAreaRef}
        className="mx-auto min-w-0 max-w-5xl scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="glass-card min-w-0 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
          {/* =====================================================
              GAME HEADER / CONTROLS
              ===================================================== */}
          <div className="border-b border-white/60 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-sm sm:tracking-[0.25em]">
                  {getGameLabel()}
                </p>

                <h3 className="mt-2 break-words text-2xl font-black leading-tight tracking-tight min-[390px]:text-3xl sm:mt-3 sm:text-4xl">
                  {getGameHeading()}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:leading-7">
                  {getGameDescription()}
                </p>
              </div>

              {!gameStarted && (
                <div className="grid w-full gap-4 rounded-2xl bg-white/15 p-4 backdrop-blur-xl sm:grid-cols-2 sm:rounded-3xl sm:p-5 lg:w-[420px] lg:shrink-0">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white sm:mb-3">
                      Game
                    </span>

                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-sm font-semibold text-white backdrop-blur focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <option
                        className="text-slate-900"
                        value="PATTERN_RECALL"
                      >
                        Pattern Recall
                      </option>

                      <option
                        className="text-slate-900"
                        value="STORY_RECALL"
                      >
                        Story Recall
                      </option>

                      <option
                        className="text-slate-900"
                        value="MEMORY_MATCH"
                      >
                        Memory Match
                      </option>

                      <option
                        className="text-slate-900"
                        value="WORD_BLOOM"
                      >
                        Word Bloom
                      </option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white sm:mb-3">
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
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:col-span-2"
                  >
                    Start Game
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              GAME BODY
              ===================================================== */}
          <div className="min-w-0 p-3 sm:p-6 md:p-8">
            {/* ===================================================
                MEMORY MATCH
                =================================================== */}
            {gameStarted && selectedGame === "MEMORY_MATCH" && (
              <div
                ref={memoryMatchRef}
                className="min-w-0 scroll-mt-24 sm:scroll-mt-28"
              >
                <MemoryMatchGame
                  difficulty={difficulty}
                  onChangeGame={() => {
                    setGameStarted(false);
                    resetGameState();
                  }}
                  onComplete={async (result) => {
                    console.log("Memory Match completed:", result);

                    const gameResult = {
                      gameType: result.gameType,
                      score: result.score,
                      totalQuestions: result.totalQuestions,
                      correctAnswers: result.correctAnswers,
                      timeTakenSeconds: result.timeTakenSeconds,
                      difficulty: result.difficulty,
                    };

                    const message = `Great work! You matched ${result.correctAnswers}/${result.totalQuestions} pairs with ${result.score}% accuracy in ${result.timeTakenSeconds} seconds.`;

                    await saveResultAndReflect(gameResult, message);
                  }}
                />
              </div>
            )}

            {/* ===================================================
                WORD BLOOM
                =================================================== */}
            {gameStarted &&
              selectedGame === "WORD_BLOOM" &&
              wordBloomData && (
                <>
                  <div className="min-w-0 overflow-x-auto">
                    <WordBloomGame
                      difficulty={difficulty}
                      wordData={wordBloomData}
                      onComplete={async (result) => {
                        const message = result.didWin
                          ? `Great work! You solved Word Bloom in ${result.attemptsUsed} guesses.`
                          : `Good effort! The Word Bloom answer was ${result.secretWord}.`;

                        const gameResult = {
                          gameType: "WORD_BLOOM",
                          score: result.score,
                          totalQuestions: result.totalQuestions,
                          correctAnswers: result.correctAnswers,
                          timeTakenSeconds: result.timeTakenSeconds,
                          difficulty,
                        };

                        await saveResultAndReflect(gameResult, message);
                      }}
                    />
                  </div>

                  <div className="mt-5 grid gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
                    <button
                      onClick={startGame}
                      disabled={isGeneratingReflection}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      Play Again
                    </button>

                    <button
                      onClick={() => {
                        setGameStarted(false);
                        resetGameState();
                      }}
                      disabled={isGeneratingReflection}
                      className="w-full rounded-2xl bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      Change Game
                    </button>
                  </div>
                </>
              )}

            {/* ===================================================
                PATTERN RECALL - MEMORIZE
                =================================================== */}
            {gameStarted &&
              isShowingPrompt &&
              selectedGame === "PATTERN_RECALL" && (
                <div className="animate-fade-in text-center">
                  <div className="mx-auto max-w-2xl rounded-[1.5rem] bg-gradient-to-br from-indigo-50 to-violet-50 p-4 shadow-inner sm:rounded-[2rem] sm:p-8 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 sm:text-sm sm:tracking-[0.25em]">
                      Memorize This Pattern
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 min-[390px]:gap-3 sm:mt-8 sm:gap-4">
                      {pattern.map((number, index) => (
                        <div
                          key={index}
                          className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-white text-xl font-black text-indigo-700 shadow-lg shadow-indigo-100 min-[390px]:h-14 min-[390px]:w-14 min-[390px]:text-2xl sm:h-20 sm:w-20 sm:rounded-3xl sm:text-3xl"
                        >
                          {number}
                        </div>
                      ))}
                    </div>

                    <p className="mt-5 text-sm font-medium leading-6 text-slate-500 sm:mt-8">
                      Focus and remember the sequence before it disappears.
                    </p>
                  </div>
                </div>
              )}

            {/* ===================================================
                STORY RECALL
                =================================================== */}
            {gameStarted &&
              isShowingPrompt &&
              selectedGame === "STORY_RECALL" &&
              storyData && (
                <div className="animate-fade-in text-center">
                  {/* Memorize Words */}
                  {storyPhase === "WORDS" && (
                    <div
                      ref={storyWordsRef}
                      className="mx-auto max-w-3xl scroll-mt-24 rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-sky-50 p-4 shadow-inner sm:scroll-mt-28 sm:rounded-[2rem] sm:p-8 lg:p-10"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm sm:tracking-[0.25em]">
                        Memorize These Words
                      </p>

                      <h3 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:mt-4 sm:text-3xl">
                        Remember the original words
                      </h3>

                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Words disappear in {countdown} seconds
                      </p>

                      <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-4">
                        {storyData.targetWords.map((word) => (
                          <span
                            key={word}
                            className="max-w-full break-words rounded-2xl bg-white px-4 py-3 text-base font-black text-emerald-700 shadow-lg shadow-emerald-100 sm:rounded-3xl sm:px-6 sm:py-4 sm:text-xl"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Story Narration */}
                  {storyPhase === "STORY" && (
                    <div
                      ref={storyNarrationRef}
                      className="mx-auto max-w-3xl scroll-mt-24 rounded-[1.5rem] bg-gradient-to-br from-indigo-50 to-violet-50 p-4 shadow-inner sm:scroll-mt-28 sm:rounded-[2rem] sm:p-8 lg:p-10"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 sm:text-sm sm:tracking-[0.25em]">
                        Listen to the Story
                      </p>

                      <p className="mt-4 break-words text-base font-bold leading-7 text-slate-800 sm:mt-6 sm:text-xl sm:leading-9">
                        {spokenStory}
                      </p>

                      {/*
                       * Users do not need to click this during the first story reading.
                       * This is only here in case they want to replay the story audio.
                       */}
                      <div className="mt-5 sm:mt-6">
                        <VoiceControls
                          textToRead={spokenStory}
                          showTextToSpeech={true}
                          showSpeechToText={false}
                          readButtonLabel="Listen Again"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* ===================================================
                RECALL / ANSWER PHASE
                =================================================== */}
            {gameStarted &&
              selectedGame !== "MEMORY_MATCH" &&
              selectedGame !== "WORD_BLOOM" &&
              !isShowingPrompt &&
              (selectedGame !== "STORY_RECALL" ||
                storyPhase === "RECALL") && (
                <div
                  ref={storyRecallRef}
                  className="mx-auto min-w-0 max-w-2xl scroll-mt-24 sm:scroll-mt-28"
                >
                  <div className="rounded-[1.5rem] border border-violet-100 bg-white p-4 shadow-lg shadow-violet-100 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900 dark:to-violet-950/50 dark:shadow-none sm:rounded-[2rem] sm:p-6">
                    <div className="text-center">
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 sm:text-sm sm:tracking-[0.25em]">
    Recall Phase
  </p>

  <h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:mt-3 sm:text-3xl">
    {selectedGame === "STORY_RECALL"
      ? `What were the original ${
          storyData?.targetWords?.length || 3
        } items?`
      : "Enter the pattern you remember"}
  </h3>

  <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-6 text-slate-600 dark:text-slate-300 sm:leading-7">
    {selectedGame === "STORY_RECALL"
      ? "Type or speak the words you remember. You can also replay the story if needed."
      : "Type the sequence without spaces."}
  </p>
</div>

                    <div className="mt-5 space-y-4 sm:mt-6">
                      <div className="relative min-w-0">
                        <input
                          ref={answerInputRef}
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              !isGeneratingReflection
                            ) {
                              submitAnswer();
                            }
                          }}
                          placeholder={
                            selectedGame === "STORY_RECALL"
                              ? "Example: car, house, shoe"
                              : "Example: 1234"
                          }
                          disabled={isGeneratingReflection}
                          className={`w-full min-w-0 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-center font-bold text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-[1.5rem] sm:px-5 ${
                            selectedGame === "STORY_RECALL"
                              ? "pr-14 text-base sm:pr-16 sm:text-lg"
                              : "text-2xl tracking-[0.25em] min-[390px]:text-3xl min-[390px]:tracking-[0.35em] sm:tracking-[0.5em]"
                          }`}
                        />

                        {selectedGame === "STORY_RECALL" && (
                          <VoiceControls
                            onTranscript={(spokenText) =>
                              setUserInput(spokenText)
                            }
                            showTextToSpeech={false}
                            showSpeechToText={true}
                            insideInput={true}
                          />
                        )}
                      </div>

                      {/* Story Recall Helpers */}
                      {selectedGame === "STORY_RECALL" && storyData && (
                        <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
                          <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-violet-50 to-white shadow-sm dark:border-indigo-400/20 dark:from-indigo-950/70 dark:via-violet-950/60 dark:to-slate-900">
  <div className="flex items-center gap-3 border-b border-indigo-100/80 px-4 py-3 dark:border-white/10">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-md shadow-indigo-200 dark:shadow-none">
      🔊
    </div>

    <div className="min-w-0 text-left">
      <p className="text-sm font-bold text-slate-900 dark:text-white">
        Replay Story
      </p>

      <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-300">
        Listen again before submitting your answer.
      </p>
    </div>
  </div>

  <div className="flex justify-center px-4 py-3">
    <VoiceControls
      textToRead={storyData.story}
      showTextToSpeech={true}
      showSpeechToText={false}
      readButtonLabel="Play Story Again"
    />
  </div>
</div>

                          <button
                            onClick={() => setShowClue(true)}
                            disabled={isGeneratingReflection}
                            className="w-full rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 shadow-sm transition hover:bg-amber-100 disabled:opacity-60 sm:w-auto"
                          >
                            Need a clue?
                          </button>
                        </div>
                      )}

                      {selectedGame === "STORY_RECALL" &&
                        showClue &&
                        storyData && (
                          <p className="break-words rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold leading-6 text-amber-700">
                            Clue: The original words start with{" "}
                            {storyData.targetWords
                              .map((item) =>
                                item.charAt(0).toUpperCase()
                              )
                              .join(", ")}
                          </p>
                        )}

                      {/* Game Actions */}
                      <div className="grid gap-2 pt-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
                        <button
                          onClick={submitAnswer}
                          disabled={isGeneratingReflection}
                          className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {isGeneratingReflection
                            ? "Saving..."
                            : "Submit Answer"}
                        </button>

                        <button
                          onClick={startGame}
                          disabled={isGeneratingReflection}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          Play Again
                        </button>

                        <button
                          onClick={() => {
                            setGameStarted(false);
                            resetGameState();
                          }}
                          disabled={isGeneratingReflection}
                          className="w-full rounded-2xl bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          Change Game
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* ===================================================
                RESULT MESSAGE
                =================================================== */}
            {resultMessage && (
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-center sm:mt-8 sm:rounded-3xl sm:p-5">
                <p className="break-words text-sm font-semibold leading-6 text-indigo-700 sm:leading-7">
                  {resultMessage}
                </p>
              </div>
            )}

            {/* ===================================================
                AI REFLECTION LOADING
                =================================================== */}
            {isGeneratingReflection && (
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:mt-8 sm:rounded-3xl sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />

                  <p className="text-sm font-semibold leading-6 text-emerald-700">
                    CogniHaven is reflecting on your progress...
                  </p>
                </div>
              </div>
            )}

            {/* ===================================================
                AI REFLECTION
                =================================================== */}
            {aiReflection && (
              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-lg shadow-emerald-100 sm:mt-8 sm:rounded-[2rem]">
                <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4 text-white sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-sm sm:tracking-[0.25em]">
                    AI Reflection
                  </p>

                  {/*
                   * Voice controls for AI reflections.
                   * Allows users to listen to supportive AI responses.
                   */}
                  <div className="mt-3">
                    <VoiceControls
                      textToRead={aiReflection}
                      showTextToSpeech={true}
                      showSpeechToText={false}
                      readButtonLabel="Listen to AI Reflection"
                    />
                  </div>

                  <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                    CogniHaven Insight
                  </h3>
                </div>

                <div className="p-4 sm:p-6">
                  <p className="break-words text-sm leading-7 text-slate-700 sm:leading-8">
                    {aiReflection}
                  </p>
                </div>
              </div>
            )}

            {/* ===================================================
                GAME BENEFIT CARDS
                =================================================== */}
            {!gameStarted && (
              <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-2xl bg-sky-50 p-4 sm:rounded-3xl sm:p-5">
                  <div className="mb-3 text-3xl">🧠</div>

                  <h4 className="text-lg font-bold text-slate-900">
                    Memory Focus
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Practice short-term recall and concentration skills.
                  </p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-4 sm:rounded-3xl sm:p-5">
                  <div className="mb-3 text-3xl">📈</div>

                  <h4 className="text-lg font-bold text-slate-900">
                    Track Progress
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Results are saved to your wellness analytics dashboard.
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 sm:rounded-3xl sm:p-5">
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