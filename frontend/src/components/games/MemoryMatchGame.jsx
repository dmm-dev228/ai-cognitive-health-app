import { useEffect, useMemo, useRef, useState } from "react";
import MemoryCard from "./MemoryCard";

const SYMBOLS = [
  "🌿",
  "🌸",
  "☀️",
  "🌙",
  "⭐",
  "🍃",
  "🌊",
  "🪷",
  "🕊️",
  "🍎",
  "🎵",
  "📘",
];

const difficultyConfig = {
  EASY: {
    pairs: 4,
    columns: "grid-cols-2 sm:grid-cols-4",
  },
  MEDIUM: {
    pairs: 6,
    columns: "grid-cols-3 sm:grid-cols-4",
  },
  HARD: {
    pairs: 8,
    columns: "grid-cols-4",
  },
};

function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

function createDeck(difficulty) {
  const pairCount = difficultyConfig[difficulty]?.pairs || 4;
  const selectedSymbols = SYMBOLS.slice(0, pairCount);

  const pairedCards = selectedSymbols.flatMap((symbol, index) => [
    {
      id: `${symbol}-${index}-a`,
      pairId: symbol,
      symbol,
    },
    {
      id: `${symbol}-${index}-b`,
      pairId: symbol,
      symbol,
    },
  ]);

  return shuffleCards(pairedCards);
}

function MemoryMatchGame({ difficulty = "EASY", onComplete }) {
  const [cards, setCards] = useState(() => createDeck(difficulty));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [isBoardLocked, setIsBoardLocked] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [isPreviewing, setIsPreviewing] = useState(true);
  const [previewCountdown, setPreviewCountdown] = useState(5);

  const timerRef = useRef(null);
  const gameStartedRef = useRef(false);

  const totalPairs = difficultyConfig[difficulty]?.pairs || 4;
  const columns =
    difficultyConfig[difficulty]?.columns || "grid-cols-2 sm:grid-cols-4";

  const accuracy = useMemo(() => {
    if (moveCount === 0) return 100;
    return Math.round((totalPairs / moveCount) * 100);
  }, [moveCount, totalPairs]);

  const resetGame = () => {
    clearInterval(timerRef.current);

    setCards(createDeck(difficulty));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoveCount(0);
    setIsBoardLocked(true);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setIsPreviewing(true);
    setPreviewCountdown(5);

    gameStartedRef.current = false;
  };

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (!isPreviewing) return;

    let timeLeft = 5;
    setPreviewCountdown(timeLeft);

    const previewInterval = setInterval(() => {
      timeLeft -= 1;
      setPreviewCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(previewInterval);

        /*
          Preview is finished, so cards flip face down
          and the actual game timer begins.
        */
        setIsPreviewing(false);
        setIsBoardLocked(false);
        gameStartedRef.current = true;
      }
    }, 1000);

    return () => clearInterval(previewInterval);
  }, [cards, isPreviewing]);

  useEffect(() => {
    if (!gameStartedRef.current || isCompleted || isPreviewing) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isCompleted, isPreviewing]);

  const handleCardClick = (selectedCard) => {
    if (isPreviewing) return;
    if (isBoardLocked) return;
    if (matchedPairs.includes(selectedCard.pairId)) return;
    if (flippedCards.some((card) => card.id === selectedCard.id)) return;
    if (flippedCards.length === 2) return;

    const updatedFlippedCards = [...flippedCards, selectedCard];
    setFlippedCards(updatedFlippedCards);

    if (updatedFlippedCards.length === 2) {
      evaluateMatch(updatedFlippedCards);
    }
  };

  const evaluateMatch = ([firstCard, secondCard]) => {
    setIsBoardLocked(true);
    setMoveCount((prev) => prev + 1);

    const isMatch = firstCard.pairId === secondCard.pairId;

    if (isMatch) {
      const updatedMatchedPairs = [...matchedPairs, firstCard.pairId];

      setMatchedPairs(updatedMatchedPairs);
      setFlippedCards([]);
      setIsBoardLocked(false);

      if (updatedMatchedPairs.length === totalPairs) {
        finishGame(updatedMatchedPairs.length);
      }

      return;
    }

    setTimeout(() => {
      setFlippedCards([]);
      setIsBoardLocked(false);
    }, 850);
  };

  const finishGame = (correctPairs) => {
    clearInterval(timerRef.current);
    setIsCompleted(true);

    const finalMoves = moveCount + 1;
    const finalAccuracy = Math.round((totalPairs / finalMoves) * 100);

    /*
      Result shape matches the existing GameResult model.
      GamePage can use this to save CARD_MATCH results and generate AI reflection.
    */
    const memoryMatchResult = {
      gameType: "MEMORY_MATCH",
      difficulty,
      score: finalAccuracy,
      totalQuestions: totalPairs,
      correctAnswers: correctPairs,
      timeTakenSeconds: Math.max(1, elapsedSeconds),
      moveCount: finalMoves,
      accuracy: finalAccuracy,
    };

    if (onComplete) {
      onComplete(memoryMatchResult);
    }
  };

  const isCardVisible = (card) => {
    return (
      isPreviewing ||
      matchedPairs.includes(card.pairId) ||
      flippedCards.some((flippedCard) => flippedCard.id === card.id)
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-sky-50 p-6 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
            Memory Match
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-900">
            Match the calming pairs.
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Study the cards first. After the preview ends, flip two cards at a
            time and find each matching pair.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Moves
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {moveCount}
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
                Pairs
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {matchedPairs.length}/{totalPairs}
              </p>
            </div>
          </div>
        </div>

        {isPreviewing && (
          <div className="mb-5 rounded-3xl border border-amber-100 bg-amber-50 p-4 text-center">
            <p className="text-sm font-bold text-amber-700">
              Memorize the cards. They flip over in {previewCountdown} seconds.
            </p>
          </div>
        )}

        <div className={`grid ${columns} gap-4`}>
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              isFlipped={isCardVisible(card)}
              isMatched={matchedPairs.includes(card.pairId)}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {isCompleted && (
          <div className="mt-8 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Game Complete
            </p>

            <h3 className="mt-3 text-3xl font-black text-slate-900">
              Great work keeping your mind engaged.
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              You completed {totalPairs} pairs in {moveCount} moves and{" "}
              {elapsedSeconds} seconds. Nice job practicing focus, memory, and
              attention.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-bold text-slate-400">Final Moves</p>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {moveCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-bold text-slate-400">Time</p>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {elapsedSeconds}s
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-bold text-slate-400">Accuracy</p>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {accuracy}%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetGame}
              className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryMatchGame;