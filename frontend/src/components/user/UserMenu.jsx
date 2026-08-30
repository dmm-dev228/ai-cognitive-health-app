import { useEffect, useState } from "react";

/*
 * UserMenu
 * --------
 * Navbar avatar button.
 *
 * Shows:
 * - uploaded profile image if one exists
 * - first username letter as fallback
 * - refreshed username/email after account updates
 *
 * compact:
 * - avatar only
 * - used in the mobile header
 *
 * default:
 * - avatar + username + email
 * - used in desktop navigation
 */
function UserMenu({ onClick, compact = false }) {
  const [userInfo, setUserInfo] = useState({
    username: sessionStorage.getItem("username") || "User",
    email: sessionStorage.getItem("email") || "Signed in",
    profileImageUrl: sessionStorage.getItem("profileImageUrl") || "",
  });

  const initial = userInfo.username.charAt(0).toUpperCase();

  useEffect(() => {
    const refreshUserInfo = () => {
      setUserInfo({
        username: sessionStorage.getItem("username") || "User",
        email: sessionStorage.getItem("email") || "Signed in",
        profileImageUrl: sessionStorage.getItem("profileImageUrl") || "",
      });
    };

    window.addEventListener("profileImageUpdated", refreshUserInfo);
    window.addEventListener("userProfileUpdated", refreshUserInfo);

    return () => {
      window.removeEventListener("profileImageUpdated", refreshUserInfo);
      window.removeEventListener("userProfileUpdated", refreshUserInfo);
    };
  }, []);

  /*
   * Compact mobile avatar
   */
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        title={`${userInfo.username} - ${userInfo.email}`}
        aria-label="Open account settings"
      >
        {userInfo.profileImageUrl ? (
          <img
            src={userInfo.profileImageUrl}
            alt={`${userInfo.username} profile`}
            className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-white"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 text-sm font-black text-white shadow-md ring-2 ring-white">
            {initial}
          </div>
        )}
      </button>
    );
  }

  /*
   * Full desktop profile button
   */
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md xl:w-[260px]"
      title={`${userInfo.username} - ${userInfo.email}`}
    >
      {userInfo.profileImageUrl ? (
        <img
          src={userInfo.profileImageUrl}
          alt={`${userInfo.username} profile`}
          className="h-11 w-11 shrink-0 rounded-full object-cover shadow-md"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 text-base font-black text-white shadow-md">
          {initial}
        </div>
      )}

      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-bold text-slate-900">
          {userInfo.username}
        </p>

        <p className="truncate text-xs text-slate-500">
          {userInfo.email}
        </p>
      </div>
    </button>
  );
}

export default UserMenu;