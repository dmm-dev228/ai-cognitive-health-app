import { useRef, useEffect, useState } from "react";
import VoiceControls from "../components/VoiceControls";
import MemoryMatchGame from "../components/games/MemoryMatchGame";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import {
  saveGameResult,
  generateGameReflection,
  generateStoryRecallGame,
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

  const { speak } = useTextToSpeech();

  const scrollToGameArea = () => {
    setTimeout(() => {
      gameAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };
  const scrollToMemoryMatch = () => {
    setTimeout(() => {
      memoryMatchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 250);
  };
  const scrollToRef = (ref, delay = 150) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, delay);
  };
  const getGameLabel = () => {
    if (selectedGame === "STORY_RECALL") return "Story Recall";
    if (selectedGame === "MEMORY_MATCH") return "Memory Match";
    return "Pattern Recall";
  };

  const getGameHeading = () => {
    if (selectedGame === "STORY_RECALL") return "Story Memory Challenge";
    if (selectedGame === "MEMORY_MATCH") return "Memory Match Challenge";
    return "Memory Challenge";
  };

  const getGameDescription = () => {
    if (selectedGame === "STORY_RECALL") {
      return "Memorize the target words, listen to the story, then recall the original words.";
    }

    if (selectedGame === "MEMORY_MATCH") {
      return "Flip cards, find matching pairs, and practice focus, recognition, and memory.";
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
          block: "start"
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
          Generate a fresh Story Recall round from the backend.
          Backend returns AI-generated target words and a fresh story.
        */
        const generatedStoryGame = await generateStoryRecallGame(difficulty);

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
              After the words disappear, show the story and automatically
              read it aloud as part of the game.
            */
            setStoryPhase("STORY");
            setSpokenStory(generatedStoryGame.story);
            scrollToRef(storyNarrationRef);

            /*
              Move to the recall phase only after the story narration finishes.
              This prevents the answer screen from appearing before the AI is done reading.
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
        setResultMessage("Could not generate a Story Recall game. Please try again.");
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

      <div ref={gameAreaRef} className="mx-auto max-w-5xl scroll-mt-28">
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="border-b border-white/60 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-8 py-10 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                  {getGameLabel()}
                </p>

                <h3 className="mt-3 text-4xl font-black tracking-tight">
                  {getGameHeading()}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                  {getGameDescription()}
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

                      <option className="text-slate-900" value="MEMORY_MATCH">
                        Memory Match
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
            {gameStarted && selectedGame === "MEMORY_MATCH" && (
              <div ref={memoryMatchRef} className="scroll-mt-28">
                <MemoryMatchGame
                  difficulty={difficulty}
                  onComplete={async (result) => {
                    console.log("Memory Match completed:", result);

                    const gameResult = {
                      gameType: result.gameType,
                      score: result.score,
                      totalQuestions: result.totalQuestions,
                      correctAnswers: result.correctAnswers,
                      timeTakenSeconds: result.timeTakenSeconds,
                      difficulty: result.difficulty
                    };

                    const message = `Great work! You matched ${result.correctAnswers}/${result.totalQuestions} pairs with ${result.score}% accuracy in ${result.timeTakenSeconds} seconds.`;

                    await saveResultAndReflect(gameResult, message);
                  }}
                />
              </div>
            )}

            {gameStarted &&
              isShowingPrompt &&
              selectedGame === "PATTERN_RECALL" && (
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

            {gameStarted &&
              isShowingPrompt &&
              selectedGame === "STORY_RECALL" &&
              storyData && (
                <div className="animate-fade-in text-center">
                  {storyPhase === "WORDS" && (
                    <div
                      ref={storyWordsRef}
                      className="mx-auto max-w-3xl scroll-mt-28 rounded-[2rem] bg-gradient-to-br from-emerald-50 to-sky-50 p-10 shadow-inner"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                        Memorize These Words
                      </p>

                      <h3 className="mt-4 text-3xl font-black text-slate-900">
                        Remember the original words
                      </h3>

                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Words disappear in {countdown} seconds
                      </p>

                      <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {storyData.targetWords.map((word) => (
                          <span
                            key={word}
                            className="rounded-3xl bg-white px-6 py-4 text-xl font-black text-emerald-700 shadow-lg shadow-emerald-100"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {storyPhase === "STORY" && (
                    <div
                      ref={storyNarrationRef}
                      className="mx-auto max-w-3xl scroll-mt-28 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-violet-50 p-10 shadow-inner"
                    >                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
                        Listen to the Story
                      </p>

                      <p className="mt-6 text-xl font-bold leading-9 text-slate-800">
                        {spokenStory}
                      </p>

                      {/*
                        Users do not need to click this during the first story reading.
                        This is only here in case they want to replay the story audio.
                      */}
                      <div className="mt-6">
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

            {gameStarted &&
              selectedGame !== "MEMORY_MATCH" &&
              !isShowingPrompt &&
              (selectedGame !== "STORY_RECALL" || storyPhase === "RECALL") && (
                <div className="animate-fade-in">
                  <div
                    ref={storyRecallRef}
                    className="mx-auto max-w-2xl scroll-mt-28 text-center"
                  >                    <div className="mb-8">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
                        Recall Phase
                      </p>

                      <h3 className="mt-3 text-3xl font-bold text-slate-900">
                        {selectedGame === "STORY_RECALL"
                          ? `What were the original ${storyData?.targetWords?.length || 3} items?`
                          : "Enter the pattern you remember"}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        {selectedGame === "STORY_RECALL"
                          ? "Type the items you remember. Example: car, house, shoe"
                          : "Type the sequence without spaces."}
                      </p>
                    </div>

                    <input
                      ref={answerInputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isGeneratingReflection) {
                          submitAnswer();
                        }
                      }}
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
                    {/*
                      Speech-to-text support for Story Recall.
                      Lets users speak their answer instead of typing.
                      Also lets users hear the story again if they need audio support.
                    */}
                    {selectedGame === "STORY_RECALL" && storyData && (
                      <div className="mt-4">
                        <VoiceControls
                          textToRead={storyData.story}
                          onTranscript={(spokenText) => setUserInput(spokenText)}
                          showTextToSpeech={true}
                          showSpeechToText={true}
                          readButtonLabel="Listen to Story"
                          listenButtonLabel="Speak Answer"
                        />
                      </div>
                    )}

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
                            Clue: The original words start with:{" "}
                            {storyData.targetWords
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

                  {/*
                    Voice controls for AI reflections.
                    Allows users to listen to supportive AI responses.
                  */}
                  <div className="mt-3">
                    <VoiceControls
                      textToRead={aiReflection}
                      showTextToSpeech={true}
                      showSpeechToText={false}
                      readButtonLabel="Listen to AI Reflection"
                    />
                  </div>

                  <h3 className="mt-4 text-2xl font-bold">
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