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
        <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-500 via-indigo-500 to-emerald-400 p-8 text-white shadow-2xl shadow-violet-200">
            <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-white/20 blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-200/20 blur-3xl animate-float" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-5 flex items-center gap-4">
                        <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                            Supportive Wellness Community
                        </p>
                    </div>

                    <h2 className="max-w-4xl text-5xl font-black leading-tight tracking-tight">
                        A calm place to share, encourage, and grow together.
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                        Share routines, reflections, helpful wellness habits, and
                        encouragement in a supportive non-medical community space.
                    </p>
                </div>

                <button
                    onClick={onCreatePost}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                    + Create Post
                </button>
            </div>
        </div>
    );
}

export default CommunityHero;