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

  // First pass handles exact matches.
  result.forEach((tile, index) => {
    if (tile.letter === secretLetters[index]) {
      tile.status = "green";
      usedSecretIndexes.add(index);
    }
  });

  // Second pass handles correct letters in the wrong position.
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

  const secretWord = wordData?.secretWord?.toUpperCase() || "";
  const hint = wordData?.hint || "";

  const guessesUntilHint = hintUnlockGuess[difficulty] ?? 0;
  const isHintAvailable = currentAttempt >= guessesUntilHint;

  const hintText = useMemo(() => {
    if (difficulty === "EASY") {
      return "Hint is available anytime on Easy.";
    }

    if (difficulty === "MEDIUM") {
      return `Hint unlocks after 3 guesses. Guesses used: ${currentAttempt}/3.`;
    }

    return `Hint unlocks after 5 guesses. Guesses used: ${currentAttempt}/5.`;
  }, [difficulty, currentAttempt]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleGuessChange = (event) => {
    const cleanedValue = event.target.value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, WORD_LENGTH);

    setCurrentGuess(cleanedValue);
  };

  const submitGuess = () => {
    if (isCompleted || isRevealing) return;

    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Enter a full 5-letter word.");
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      submitGuess();
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

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-emerald-50 p-6 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
            Word Bloom
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-900">
            Guess the hidden five-letter word.
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            You have six tries. Green means the letter is in the right spot,
            yellow means the letter is in the word, and gray means it is not in
            the word.
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

        <div className="mx-auto grid max-w-sm gap-2">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-2">
              {row.map((tile, tileIndex) => {
                const isActiveRow = rowIndex === currentAttempt && !tile.letter;
                const displayLetter =
                  isActiveRow && currentGuess[tileIndex]
                    ? currentGuess[tileIndex]
                    : tile.letter;

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
                        : "border-slate-200 bg-white text-slate-400"
                    } ${shouldAnimate ? "word-bloom-flip" : ""}`}
                    style={{
                      animationDelay: shouldAnimate
                        ? `${tileIndex * 140}ms`
                        : "0ms",
                    }}
                  >
                    {displayLetter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-sm">
          <input
            type="text"
            value={currentGuess}
            onChange={handleGuessChange}
            onKeyDown={handleKeyDown}
            disabled={isCompleted || isRevealing}
            placeholder="Type 5 letters"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl font-black uppercase tracking-[0.35em] text-slate-800 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={submitGuess}
            disabled={isCompleted || isRevealing}
            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Submit Guess
          </button>

          <div className="mt-4 rounded-3xl border border-amber-100 bg-amber-50 p-4 text-center">
            <p className="text-sm font-semibold text-amber-700">
              {hintText}
            </p>

            <button
              type="button"
              onClick={() => setShowHint(true)}
              disabled={!isHintAvailable}
              className="mt-3 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-amber-700 shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Need a Hint?
            </button>

            {showHint && (
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {hint}
              </p>
            )}
          </div>

          {message && (
            <div
              className={`mt-4 rounded-3xl p-4 text-center text-sm font-semibold ${
                didWin
                  ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border border-indigo-100 bg-indigo-50 text-indigo-700"
              }`}
            >
              {message}
            </div>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={resetLocalGame}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Replay Same Word
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WordBloomGame;