import { createPortal } from "react-dom";

/*
 * SettingsDrawer
 * --------------
 * Slide-out user settings panel.
 * Uses a portal so the drawer covers the full screen instead of being trapped
 * inside the navbar layout.
 */
function SettingsDrawer({
  isOpen,
  onClose,
  isDarkMode,
  setIsDarkMode,
  onLogout,
}) {
  const username = sessionStorage.getItem("username") || "User";
  const email = sessionStorage.getItem("email") || "Signed in";

  // For now this stays null. Later Phase 6 will load a real profile image.
  const profileImageUrl = sessionStorage.getItem("profileImageUrl");

  const initial = username.charAt(0).toUpperCase();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop closes the drawer when the user clicks outside it. */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        aria-label="Close settings"
      />

      {/* Settings drawer panel */}
      <aside
        className={`absolute right-0 top-0 h-screen w-full max-w-md overflow-y-auto p-6 shadow-2xl transition ${isDarkMode
            ? "bg-slate-950 text-white"
            : "bg-white text-slate-900"
          }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
              Settings
            </p>

            <h2 className="mt-2 text-3xl font-black">Account Center</h2>
          </div>

          <button
            onClick={onClose}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${isDarkMode
                ? "bg-white/10 text-slate-200 hover:bg-white/15"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            ✕
          </button>
        </div>

        {/* User profile header */}
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-emerald-500 p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${username} profile`}
                className="h-16 w-16 rounded-full border border-white/30 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-black backdrop-blur">
                {initial}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-xl font-black">{username}</p>
              <p className="truncate text-sm text-white/75">{email}</p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-white/75">
            Profile image upload will be added later. Until then, CogniHaven
            uses your first initial as the default avatar.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <SettingsRow
            isDarkMode={isDarkMode}
            icon="👤"
            title="Account"
            text="Profile details and personal information."
          />

          <AppearanceToggle
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          <SettingsRow
            isDarkMode={isDarkMode}
            icon="🔒"
            title="Security"
            text="Update email and account security options."
          />

          <SettingsRow
            isDarkMode={isDarkMode}
            icon="⏱"
            title="Session Timeout"
            text="Choose how long before inactivity logs you out."
          />

          <SettingsRow
            isDarkMode={isDarkMode}
            icon="🔔"
            title="Notifications"
            text="Manage reminder and notification preferences."
          />
        </div>

        {/* Drawer footer */}
        <div
          className={`mt-8 border-t pt-5 ${isDarkMode ? "border-white/10" : "border-slate-200"
            }`}
        >
          <button
            onClick={onLogout}
            className="w-full rounded-2xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}

/*
 * AppearanceToggle
 * ----------------
 * Lets users switch between light and dark mode from the settings drawer.
 */
function AppearanceToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div
      className={`rounded-3xl border p-5 transition ${isDarkMode
          ? "border-white/10 bg-white/10"
          : "border-slate-100 bg-slate-50"
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm ${isDarkMode ? "bg-white/10" : "bg-white"
              }`}
          >
            🎨
          </div>

          <div>
            <p
              className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"
                }`}
            >
              Appearance
            </p>

            <p
              className={`mt-1 text-sm leading-6 ${isDarkMode ? "text-slate-300" : "text-slate-500"
                }`}
            >
              Switch between light and dark mode.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className={`relative h-8 w-16 rounded-full p-1 transition ${isDarkMode ? "bg-indigo-500" : "bg-slate-300"
            }`}
          aria-label="Toggle dark mode"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-md transition-transform ${isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </span>
        </button>
      </div>

      <div
        className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${isDarkMode
            ? "bg-white/10 text-slate-200"
            : "bg-white text-slate-600"
          }`}
      >
        Current theme: {isDarkMode ? "Dark Mode" : "Light Mode"}
      </div>
    </div>
  );
}

function SettingsRow({ icon, title, text, isDarkMode }) {
  return (
    <div
      className={`rounded-3xl border p-5 transition hover:-translate-y-0.5 ${isDarkMode
          ? "border-white/10 bg-white/10 hover:bg-white/15"
          : "border-slate-100 bg-slate-50 hover:bg-white"
        }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm ${isDarkMode ? "bg-white/10" : "bg-white"
            }`}
        >
          {icon}
        </div>

        <div>
          <p
            className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"
              }`}
          >
            {title}
          </p>

          <p
            className={`mt-1 text-sm leading-6 ${isDarkMode ? "text-slate-300" : "text-slate-500"
              }`}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsDrawer;