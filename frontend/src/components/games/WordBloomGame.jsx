import { useEffect, useMemo, useRef, useState } from "react";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const hintUnlockGuess = {
  EASY: 0,
  MEDIUM: 3,
  HARD: 5,
};

function createEmptyBoard() {
  return Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({
      letter: "",
      status: "",
    }))
  );
}

function getScore(attemptsUsed, didWin) {
  if (!didWin) return 0;

  const scoreMap = {
    1: 100,
    2: 90,
    3: 80,
    4: 70,
    5: 60,
    6: 50,
  };

  return scoreMap[attemptsUsed] || 0;
}

function evaluateGuess(guess, secretWord) {
  const result = guess.split("").map((letter) => ({
    letter,
    status: "gray",
  }));

  const secretLetters = secretWord.split("");
  const usedSecretIndexes = new Set();

  // First pass marks exact matches.
  result.forEach((tile, index) => {
    if (tile.letter === secretLetters[index]) {
      tile.status = "green";
      usedSecretIndexes.add(index);
    }
  });

  // Second pass marks correct letters in the wrong position.
  result.forEach((tile, index) => {
    if (tile.status === "green") return;

    const matchingIndex = secretLetters.findIndex(
      (secretLetter, secretIndex) =>
        secretLetter === tile.letter && !usedSecretIndexes.has(secretIndex)
    );

    if (matchingIndex !== -1) {
      tile.status = "yellow";
      usedSecretIndexes.add(matchingIndex);
    }
  });

  return result;
}

function getTileColor(status) {
  if (status === "green") {
    return "border-emerald-400 bg-emerald-500 text-white";
  }

  if (status === "yellow") {
    return "border-amber-300 bg-amber-400 text-white";
  }

  if (status === "gray") {
    return "border-slate-300 bg-slate-400 text-white";
  }

  return "border-slate-200 bg-white text-slate-800";
}

function getHintStatusText(difficulty, currentAttempt) {
  if (difficulty === "EASY") {
    return "Hint is available whenever you want it.";
  }

  if (difficulty === "MEDIUM") {
    return currentAttempt >= 3
      ? "Hint is available now."
      : `Hint becomes available after 3 guesses. Guesses used: ${currentAttempt}/3.`;
  }

  return currentAttempt >= 5
    ? "Hint is available now. Use it only if you want one final clue."
    : `Hint becomes available after 5 guesses. Guesses used: ${currentAttempt}/5.`;
}

function WordBloomGame({ difficulty = "EASY", wordData, onComplete }) {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [didWin, setDidWin] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef(null);
  const gameContainerRef = useRef(null);

  const secretWord = wordData?.secretWord?.toUpperCase() || "";
  const hint = wordData?.hint || "";

  const guessesUntilHint = hintUnlockGuess[difficulty] ?? 0;
  const isHintAvailable = currentAttempt >= guessesUntilHint;

  const hintText = useMemo(() => {
    return getHintStatusText(difficulty, currentAttempt);
  }, [difficulty, currentAttempt]);

  useEffect(() => {
    // Auto-scroll to Word Bloom when the game loads.
    setTimeout(() => {
      gameContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Keyboard-first gameplay: the page listens for letters, Backspace, and Enter.
    const handleGlobalKeyDown = (event) => {
      if (isCompleted || isRevealing) return;

      const key = event.key;

      if (/^[a-zA-Z]$/.test(key)) {
        setCurrentGuess((prev) => {
          if (prev.length >= WORD_LENGTH) return prev;
          return `${prev}${key.toUpperCase()}`;
        });

        setMessage("");
        return;
      }

      if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "Enter") {
        submitGuess();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [currentGuess, currentAttempt, isCompleted, isRevealing, board]);

  const submitGuess = () => {
    if (isCompleted || isRevealing) return;

    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Enter a full 5-letter word before submitting.");
      return;
    }

    if (!secretWord || secretWord.length !== WORD_LENGTH) {
      setMessage("Word Bloom could not load the secret word. Please try again.");
      return;
    }

    const evaluatedGuess = evaluateGuess(currentGuess, secretWord);
    const nextBoard = board.map((row) => [...row]);

    nextBoard[currentAttempt] = evaluatedGuess;

    setBoard(nextBoard);
    setIsRevealing(true);
    setMessage("");

    const didGuessCorrectly = currentGuess === secretWord;
    const nextAttempt = currentAttempt + 1;

    setTimeout(() => {
      setIsRevealing(false);
      setCurrentGuess("");

      if (didGuessCorrectly || nextAttempt >= MAX_ATTEMPTS) {
        finishGame(didGuessCorrectly, nextAttempt);
        return;
      }

      setCurrentAttempt(nextAttempt);
    }, WORD_LENGTH * 275 + 400);
  };

  const finishGame = (won, attemptsUsed) => {
    clearInterval(timerRef.current);

    const finalScore = getScore(attemptsUsed, won);

    setDidWin(won);
    setIsCompleted(true);
    setCurrentAttempt(attemptsUsed);

    if (won) {
      setMessage(`Beautiful work — you solved Word Bloom in ${attemptsUsed} guesses.`);
    } else {
      setMessage(`Good effort. The word was ${secretWord}.`);
    }

    const result = {
      gameType: "WORD_BLOOM",
      difficulty,
      score: finalScore,
      totalQuestions: MAX_ATTEMPTS,
      correctAnswers: won ? attemptsUsed : 0,
      timeTakenSeconds: Math.max(1, elapsedSeconds),
      attemptsUsed,
      secretWord,
      didWin: won,
    };

    if (onComplete) {
      onComplete(result);
    }
  };

  const resetLocalGame = () => {
    setBoard(createEmptyBoard());
    setCurrentGuess("");
    setCurrentAttempt(0);
    setMessage("");
    setShowHint(false);
    setIsRevealing(false);
    setIsCompleted(false);
    setDidWin(false);
    setElapsedSeconds(0);

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const getDisplayLetter = (tile, rowIndex, tileIndex) => {
    if (rowIndex === currentAttempt && !tile.letter) {
      return currentGuess[tileIndex] || "";
    }

    return tile.letter;
  };

  return (
    <div ref={gameContainerRef} className="animate-fade-in scroll-mt-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-emerald-50 p-6 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
            Word Bloom
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-900">
            Guess the hidden five-letter word.
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Type letters directly into the board. Press Enter or click Submit
            Guess when your five-letter word is ready.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Guess
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {Math.min(currentAttempt + 1, MAX_ATTEMPTS)}/{MAX_ATTEMPTS}
              </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Time
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {elapsedSeconds}s
              </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Difficulty
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {difficulty}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mx-auto grid max-w-sm gap-2">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-2">
                  {row.map((tile, tileIndex) => {
                    const displayLetter = getDisplayLetter(tile, rowIndex, tileIndex);

                    const shouldAnimate =
                      rowIndex === currentAttempt && tile.status && isRevealing;

                    return (
                      <div
                        key={`${rowIndex}-${tileIndex}`}
                        className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-2xl font-black shadow-sm transition-all duration-300 ${
                          tile.status
                            ? getTileColor(tile.status)
                            : displayLetter
                            ? "border-violet-300 bg-white text-slate-900"
                            : rowIndex === currentAttempt
                            ? "border-violet-200 bg-violet-50 text-slate-400"
                            : "border-slate-200 bg-white text-slate-400"
                        } ${shouldAnimate ? "word-bloom-flip" : ""}`}
                        style={{
                          animationDelay: shouldAnimate ? `${tileIndex * 140}ms` : "0ms",
                        }}
                      >
                        {displayLetter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {message && (
              <div
                className={`mx-auto mt-4 max-w-sm rounded-3xl p-4 text-center text-sm font-semibold ${
                  didWin
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border border-indigo-100 bg-indigo-50 text-indigo-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-amber-100 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Hint
            </p>

            <p className="mt-3 text-sm leading-6 text-amber-800">
              {hintText}
            </p>

            <button
              type="button"
              onClick={() => setShowHint(true)}
              disabled={!isHintAvailable || showHint}
              className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-amber-700 shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showHint ? "Hint Revealed" : "Need a Hint?"}
            </button>

            {showHint && (
              <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                {hint}
              </p>
            )}

            <div className="mt-5 border-t border-amber-200/70 pt-4">
              <button
                type="button"
                onClick={submitGuess}
                disabled={isCompleted || isRevealing}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Submit Guess
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default WordBloomGame;