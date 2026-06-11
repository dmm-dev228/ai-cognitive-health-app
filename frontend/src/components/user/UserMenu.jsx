import { useEffect, useState } from "react";

/*
 * UserMenu
 * --------
 * Navbar avatar button.
 *
 * Shows:
 * - uploaded profile image if one exists
 * - first username letter as fallback
 */
function UserMenu({ onClick }) {
  const [profileImageUrl, setProfileImageUrl] = useState(
    sessionStorage.getItem("profileImageUrl") || ""
  );

  const username = sessionStorage.getItem("username") || "User";
  const email = sessionStorage.getItem("email") || "Signed in";

  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    const refreshProfileImage = () => {
      setProfileImageUrl(sessionStorage.getItem("profileImageUrl") || "");
    };

    window.addEventListener("profileImageUpdated", refreshProfileImage);

    return () => {
      window.removeEventListener("profileImageUpdated", refreshProfileImage);
    };
  }, []);

  return (
    <button
      onClick={onClick}
      className="group flex max-w-full items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
      title={`${username} - ${email}`}
    >
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt={`${username} profile`}
          className="h-12 w-12 shrink-0 rounded-full object-cover shadow-md"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 text-base font-black text-white shadow-md">
          {initial}
        </div>
      )}

      <div className="hidden min-w-0 max-w-[190px] text-left lg:block">
        <p className="truncate text-sm font-bold text-slate-900">{username}</p>
        <p className="truncate text-xs text-slate-500">{email}</p>
      </div>
    </button>
  );
}

export default UserMenu;