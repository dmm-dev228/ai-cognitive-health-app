function MemoryCard({ card, isFlipped, isMatched, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(card)}
      disabled={isMatched}
      aria-label={isFlipped || isMatched ? `Card ${card.symbol}` : "Hidden memory card"}
      className="group h-24 w-full perspective-1000 sm:h-28"
    >
      <div
        className={`relative h-full w-full rounded-3xl transition-transform duration-500 preserve-3d ${
          isFlipped || isMatched ? "rotate-y-180" : ""
        }`}
      >
        {/* Hidden card side */}
        <div className="absolute inset-0 flex backface-hidden items-center justify-center rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-100 via-indigo-50 to-sky-50 text-3xl font-black text-violet-400 shadow-md transition group-hover:-translate-y-0.5">
          ?
        </div>

        {/* Revealed card side */}
        <div className="absolute inset-0 flex rotate-y-180 backface-hidden items-center justify-center rounded-3xl border border-emerald-100 bg-white text-4xl shadow-lg">
          {card.symbol}
        </div>
      </div>
    </button>
  );
}

export default MemoryCard;