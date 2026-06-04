/*
 * CommunityGuidelinesModal
 * ------------------------
 * First-time community onboarding modal.
 *
 * This sets the emotional tone of the community before users participate.
 * It should feel warm, not strict or clinical.
 */
function CommunityGuidelinesModal({ isOpen, onAccept }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
          <p className="text-3xl">💜</p>

          <h2 className="mt-4 text-2xl font-black text-slate-900">
            Welcome to the CogniHaven Community
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            This space is designed for encouragement, reflection, healthy
            routines, and supportive connection. Your voice matters here.
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
            <p className="font-bold text-violet-800">
              💜 Support over judgment
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Respond with kindness, patience, and encouragement.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="font-bold text-emerald-800">
              🌱 Progress over perfection
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Celebrate small steps, daily routines, and personal growth.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <p className="font-bold text-amber-800">
              ✨ Encouragement over criticism
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This is not a place for judgment, arguments, or medical advice.
            </p>
          </div>
        </div>

        <button
          onClick={onAccept}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          I understand — enter community
        </button>
      </div>
    </div>
  );
}

export default CommunityGuidelinesModal;