/*
 * UserMenu
 * --------
 * Phase 1 profile menu foundation.
 *
 * Shows a circular user avatar in the navbar so users can quickly
 * recognize who is logged in.
 */
function UserMenu({ onClick }) {
  const username = sessionStorage.getItem("username") || "User";
  const email = sessionStorage.getItem("email") || "Signed in";

  const initial = username.charAt(0).toUpperCase();

  return (
    <button
    onClick={onClick}
      className="group flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
      title={`${username} - ${email}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 text-sm font-black text-white shadow-md">
        {initial}
      </div>

      <div className="hidden text-left lg:block">
        <p className="text-sm font-bold text-slate-900">{username}</p>
        <p className="max-w-[150px] truncate text-xs text-slate-500">
          {email}
        </p>
      </div>
    </button>
  );
}

export default UserMenu;