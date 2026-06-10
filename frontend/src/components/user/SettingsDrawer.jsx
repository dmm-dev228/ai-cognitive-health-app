import { useState } from "react";
import { createPortal } from "react-dom";
import { uploadProfileImage } from "../../services/api";
/*
 * SettingsDrawer
 * --------------
 * Slide-out user settings panel.
 * Uses expandable rows so settings stay clean until the user opens them.
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
  const profileImageUrl = sessionStorage.getItem("profileImageUrl");

  const [openSection, setOpenSection] = useState("");

  const initial = username.charAt(0).toUpperCase();

  const toggleSection = (sectionName) => {
    setOpenSection((prev) => (prev === sectionName ? "" : sectionName));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        aria-label="Close settings"
      />

      <aside
        className={`absolute right-0 top-0 h-screen w-full max-w-md overflow-y-auto p-6 shadow-2xl ${isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"
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
        </div>

        <div className="mt-6 space-y-4">
          <ExpandableSection
            isDarkMode={isDarkMode}
            icon="👤"
            title="Account"
            text="Profile details and personal information."
            isOpen={openSection === "account"}
            onClick={() => toggleSection("account")}
          >
            <AccountProfileSection isDarkMode={isDarkMode} />
          </ExpandableSection>

          <ExpandableSection
            isDarkMode={isDarkMode}
            icon="🎨"
            title="Appearance"
            text="Dark mode and visual preferences."
            isOpen={openSection === "appearance"}
            onClick={() => toggleSection("appearance")}
          >
            <AppearanceToggle
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </ExpandableSection>

          <ExpandableSection
            isDarkMode={isDarkMode}
            icon="🔒"
            title="Security"
            text="Update email and account security options."
            isOpen={openSection === "security"}
            onClick={() => toggleSection("security")}
          >
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              Email update settings will go here.
            </div>
          </ExpandableSection>

          <ExpandableSection
            isDarkMode={isDarkMode}
            icon="⏱"
            title="Session Timeout"
            text="Choose how long before inactivity logs you out."
            isOpen={openSection === "session"}
            onClick={() => toggleSection("session")}
          >
            <SessionTimeoutOptions isDarkMode={isDarkMode} />
          </ExpandableSection>

          <ExpandableSection
            isDarkMode={isDarkMode}
            icon="🔔"
            title="Notifications"
            text="Manage reminder and notification preferences."
            isOpen={openSection === "notifications"}
            onClick={() => toggleSection("notifications")}
          >
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              Notification preferences will go here.
            </div>
          </ExpandableSection>
        </div>

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

function ExpandableSection({
  icon,
  title,
  text,
  isDarkMode,
  isOpen,
  onClick,
  children,
}) {
  return (
    <div
      className={`rounded-3xl border transition ${isDarkMode
        ? "border-white/10 bg-white/10"
        : "border-slate-100 bg-slate-50"
        }`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm ${isDarkMode ? "bg-white/10" : "bg-white"
            }`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {title}
          </p>
          <p
            className={`mt-1 text-sm leading-6 ${isDarkMode ? "text-slate-300" : "text-slate-500"
              }`}
          >
            {text}
          </p>
        </div>

        <span
          className={`text-xl transition-transform ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        >
          ⌄
        </span>
      </button>

      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function AppearanceToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold">Theme</p>
          <p className="mt-1 text-xs opacity-70">
            Current: {isDarkMode ? "Dark Mode" : "Light Mode"}
          </p>
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
    </div>
  );
}

function SessionTimeoutOptions({ isDarkMode }) {
  const [selectedTimeout, setSelectedTimeout] = useState(
    sessionStorage.getItem("sessionTimeoutMinutes") || "15"
  );

  const timeoutOptions = [
    { label: "1 Minute", value: "1" },
    { label: "5 Minutes", value: "5" },
    { label: "15 Minutes", value: "15" },
    { label: "30 Minutes", value: "30" },
    { label: "1 Hour", value: "60" },
    { label: "Never", value: "never" },
  ];

  const handleChange = (value) => {
    setSelectedTimeout(value);
    sessionStorage.setItem("sessionTimeoutMinutes", value);
  };

  return (
    <div className="space-y-2 rounded-2xl bg-white/10 p-4">
      {timeoutOptions.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-white"
            }`}
        >
          <span>{option.label}</span>

          <input
            type="radio"
            name="session-timeout"
            checked={selectedTimeout === option.value}
            onChange={() => handleChange(option.value)}
          />
        </label>
      ))}
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
          <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
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

function AccountProfileSection({ isDarkMode }) {
  const username = sessionStorage.getItem("username") || "User";
  const email = sessionStorage.getItem("email") || "Signed in";

  const [profileImageUrl, setProfileImageUrl] = useState(
    sessionStorage.getItem("profileImageUrl") || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      const updatedUser = await uploadProfileImage(file);

      if (updatedUser.profileImageUrl) {
        sessionStorage.setItem("profileImageUrl", updatedUser.profileImageUrl);
        setProfileImageUrl(updatedUser.profileImageUrl);

        // Refreshes the navbar avatar immediately.
        window.dispatchEvent(new Event("profileImageUpdated"));
      }

      setMessage("Profile image updated.");
    } catch (err) {
      console.error("Profile image upload failed:", err);
      setMessage("Could not upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/10 p-4 text-sm">
      <div className="flex items-center gap-4">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={`${username} profile`}
            className="h-16 w-16 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 text-2xl font-black text-white">
            {username.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <p className="font-bold">{username}</p>
          <p className="truncate text-xs opacity-70">{email}</p>
        </div>
      </div>

      <label
        className={`mt-4 block cursor-pointer rounded-2xl px-4 py-3 text-center text-sm font-bold transition ${isDarkMode
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-white text-indigo-700 hover:bg-indigo-50"
          }`}
      >
        {isUploading ? "Uploading..." : "📷 Choose Profile Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {message && (
        <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-xs font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}

export default SettingsDrawer;