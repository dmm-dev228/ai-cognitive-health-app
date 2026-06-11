import { useState } from "react";
import { createPortal } from "react-dom";
import {
  uploadProfileImage,
  removeProfileImage,
  updateUsername,
  changePassword,
} from "../../services/api";

function SettingsDrawer({
  isOpen,
  onClose,
  isDarkMode,
  setIsDarkMode,
  onLogout,
  onDeleteAccount,
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

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate font-bold">{username}</p>
              <p className="truncate text-xs opacity-70">{email}</p>
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
            <AccountProfileSection
              isDarkMode={isDarkMode}
              onDeleteAccount={onDeleteAccount}
            />
            <div
              className={`rounded-3xl border p-4 ${isDarkMode
                ? "border-red-400/20 bg-red-500/10"
                : "border-red-100 bg-red-50"
                }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                Delete Account
              </p>

              <p className="mt-2 text-xs leading-5 text-red-500/80">
                Permanently delete your CogniHaven account and all connected data.
              </p>

              <button
                onClick={onDeleteAccount}
                className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
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
            <SecuritySection isDarkMode={isDarkMode} />
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

function AccountProfileSection({ isDarkMode, onDeleteAccount }) {
  const username = sessionStorage.getItem("username") || "User";
  const email = sessionStorage.getItem("email") || "Signed in";
  const [newUsername, setNewUsername] = useState(username);


  const [profileImageUrl, setProfileImageUrl] = useState(
    sessionStorage.getItem("profileImageUrl") || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const isSuccessMessage =
    message.toLowerCase().includes("success") ||
    message.toLowerCase().includes("updated") ||
    message.toLowerCase().includes("removed");

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
        window.dispatchEvent(new Event("profileImageUpdated"));
      }

      setMessage("Profile image updated.");
    } catch (err) {
      console.error("Profile image upload failed:", err);
      setMessage("Could not upload image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      setMessage("");

      await removeProfileImage();

      sessionStorage.removeItem("profileImageUrl");
      setProfileImageUrl("");
      window.dispatchEvent(new Event("profileImageUpdated"));

      setMessage("Profile image removed. Using your initial again.");
    } catch (err) {
      console.error("Profile image removal failed:", err);
      setMessage("Could not remove image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      setMessage("");

      const updatedUser = await updateUsername(newUsername);

      sessionStorage.setItem("username", updatedUser.username);
      window.dispatchEvent(new Event("profileImageUpdated"));

      setMessage("Username updated successfully.");
    } catch (err) {
      console.error(err);

      if (err.message) {
        setMessage(err.message);
      } else {
        setMessage("Could not update username.");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile image settings */}
      <div
        className={`rounded-3xl border p-4 ${isDarkMode
          ? "border-white/10 bg-white/10"
          : "border-slate-100 bg-white"
          }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Profile Image
        </p>

        <div className="mt-4 flex items-center gap-4">
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
            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
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

        {profileImageUrl && (
          <button
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="mt-3 w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            Remove Profile Image
          </button>
        )}
      </div>

      {/* Username settings */}
      <div
        className={`rounded-3xl border p-4 ${isDarkMode
          ? "border-white/10 bg-white/10"
          : "border-slate-100 bg-white"
          }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Username
        </p>

        <p className="mt-2 text-xs leading-5 opacity-70">
          This name appears in your account menu and profile areas.
        </p>

        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className={`mt-4 w-full rounded-2xl border px-4 py-3 text-sm outline-none ${isDarkMode
            ? "border-white/10 bg-white/10 text-white"
            : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
          placeholder="Enter username"
        />

        <button
          onClick={handleUsernameUpdate}
          className="mt-3 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Save Username
        </button>
      </div>
      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-xs font-semibold ${isSuccessMessage
            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border border-red-200 bg-red-50 text-red-600"
            }`}
        >
          {message}
        </div>
      )}

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
function SecuritySection({ isDarkMode }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const isSuccessMessage =
    !message.toLowerCase().includes("incorrect") &&
    !message.toLowerCase().includes("failed") &&
    !message.toLowerCase().includes("must") &&
    !message.toLowerCase().includes("match");

  const handlePasswordChange = async () => {
    try {
      setIsUpdating(true);
      setMessage("");

      const responseMessage = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setMessage(responseMessage || "Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update failed:", err);
      setMessage(err.message || "Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`rounded-3xl border p-4 ${
          isDarkMode
            ? "border-white/10 bg-white/10"
            : "border-slate-100 bg-white"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Change Password
        </p>

        <p className="mt-2 text-xs leading-5 opacity-70">
          Enter your current password before choosing a new one.
        </p>

        <div className="mt-4 space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
              isDarkMode
                ? "border-white/10 bg-white/10 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
            placeholder="Current password"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
              isDarkMode
                ? "border-white/10 bg-white/10 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
            placeholder="New password"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
              isDarkMode
                ? "border-white/10 bg-white/10 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
            placeholder="Confirm new password"
          />
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={isUpdating}
          className="mt-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isUpdating ? "Updating..." : "Update Password"}
        </button>
      </div>

      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-xs font-semibold ${
            isSuccessMessage
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default SettingsDrawer;