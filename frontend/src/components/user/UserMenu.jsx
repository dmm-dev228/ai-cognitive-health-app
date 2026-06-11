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
 */
function UserMenu({ onClick }) {
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

  return (
    <button
      onClick={onClick}
      className="group flex max-w-full items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
      title={`${userInfo.username} - ${userInfo.email}`}
    >
      {userInfo.profileImageUrl ? (
        <img
          src={userInfo.profileImageUrl}
          alt={`${userInfo.username} profile`}
          className="h-12 w-12 shrink-0 rounded-full object-cover shadow-md"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 text-base font-black text-white shadow-md">
          {initial}
        </div>
      )}

      <div className="hidden min-w-0 max-w-[190px] text-left lg:block">
        <p className="truncate text-sm font-bold text-slate-900">
          {userInfo.username}
        </p>
        <p className="truncate text-xs text-slate-500">{userInfo.email}</p>
      </div>
    </button>
  );
}

export default UserMenu;