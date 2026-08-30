import CogniHavenLogo from "../CogniHavenLogo";

/*
 * CommunityHero
 * -------------
 * Top hero section for the Community page.
 *
 * This introduces the purpose of the community:
 * calm support, reflection, encouragement, and shared growth.
 */
function CommunityHero({ onCreatePost }) {
  return (
    <div className="relative mb-5 min-w-0 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-violet-500 via-indigo-500 to-emerald-400 p-5 text-white shadow-xl shadow-violet-200 sm:mb-6 sm:rounded-[2rem] sm:p-7 lg:mb-8 lg:rounded-[2.5rem] lg:p-8 lg:shadow-2xl">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-16 top-8 h-44 w-44 rounded-full bg-white/20 blur-3xl animate-float sm:h-56 sm:w-56" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-yellow-200/20 blur-3xl animate-float sm:h-72 sm:w-72" />

      <div className="relative z-10 grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
        {/* Hero content */}
        <div className="min-w-0">
          <p className="inline-flex max-w-full rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold leading-5 backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
            Supportive Wellness Community
          </p>

          <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-[1.08] tracking-tight min-[390px]:text-4xl sm:mt-5 sm:text-5xl lg:mt-6">
            A calm place to share, encourage, and grow together.
          </h2>

          <p className="mt-4 max-w-2xl break-words text-sm leading-6 text-white/85 sm:leading-7">
            Share routines, reflections, helpful wellness habits, and
            encouragement in a supportive non-medical community space.
          </p>
        </div>

        {/* Logo and create post action */}
        <div className="flex min-w-0 flex-col items-center lg:items-end">
          <CogniHavenLogo className="mb-4 h-24 w-24 object-contain drop-shadow-2xl animate-float sm:h-28 sm:w-28 lg:h-36 lg:w-36" />

          <button
            type="button"
            onClick={onCreatePost}
            className="min-h-11 w-full rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            + Create Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityHero;