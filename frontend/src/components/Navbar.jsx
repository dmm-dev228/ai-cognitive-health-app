import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/api";
import CogniHavenLogo from "./CogniHavenLogo";
import UserMenu from "./user/UserMenu";
import SettingsDrawer from "./user/SettingsDrawer";

/*
 * Navbar
 * ------
 * Main app navigation.
 *
 * Desktop:
 * - Full navigation bar
 * - Larger CogniHaven branding
 * - User menu / authentication controls
 *
 * Mobile / Tablet:
 * - Compact branded header
 * - Profile avatar when logged in
 * - Hamburger menu
 * - Slide-out navigation panel
 *
 * Props come from App.jsx because App owns:
 * - dark mode state
 * - logout behavior
 * - delete account behavior
 */
function Navbar({
  isDarkMode,
  setIsDarkMode,
  handleLogout,
  handleDeleteAccount,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();

  /*
   * Close the mobile menu whenever
   * the user navigates to another page.
   */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  /*
   * Prevent the page behind the mobile menu
   * from scrolling while the menu is open.
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Journal", path: "/journal" },
    { label: "Memory", path: "/memory" },
    { label: "Dietary", path: "/dietary" },
    { label: "Games", path: "/games" },
    { label: "Medication", path: "/medication" },
    { label: "Analytics", path: "/analytics" },
    { label: "Community", path: "/community" },
    { label: "My Goals", path: "/goals" },
    { label: "Achievements", path: "/achievements" },
  ];

  const desktopNavLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : isDarkMode
          ? "text-slate-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          : "text-slate-600 hover:-translate-y-0.5 hover:bg-white hover:text-indigo-700 hover:shadow-sm"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
        : isDarkMode
          ? "text-slate-200 hover:bg-white/10 hover:text-white"
          : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b shadow-sm backdrop-blur-xl transition-colors duration-300 ${
          isDarkMode
            ? "border-white/10 bg-slate-950/75 shadow-black/30"
            : "border-white/60 bg-white/75 shadow-slate-200/40"
        }`}
      >
        {/* =========================================================
            MOBILE / TABLET HEADER
            ========================================================= */}
        <div className="xl:hidden">
          <div className="mx-auto flex min-h-[72px] w-full items-center justify-between px-4 sm:px-6">
            {/* Brand */}
            <Link
              to="/"
              className="flex min-w-0 items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CogniHavenLogo className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12" />

              <div className="min-w-0">
                <h1
                  className={`truncate text-xl font-black tracking-tight sm:text-2xl ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Cogni<span className="text-indigo-500">Haven</span>
                </h1>

                <p
                  className={`hidden truncate text-xs sm:block ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  AI-powered cognitive wellness and daily support.
                </p>
              </div>
            </Link>

            {/* Mobile Controls */}
            <div className="flex shrink-0 items-center gap-2">
              {isLoggedIn() && (
                <UserMenu
                  compact
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                />
              )}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-all duration-200 active:scale-95 ${
                  isDarkMode
                    ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-6 w-6"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            DESKTOP / LAPTOP HEADER
            ========================================================= */}
        <div className="mx-auto hidden max-w-7xl px-4 py-4 sm:px-6 xl:block">
          <div className="flex items-center justify-between gap-6">
            {/* CogniHaven Brand */}
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3"
            >
              <div className="transition duration-200 group-hover:scale-105">
                <CogniHavenLogo className="h-24 w-36 object-contain 2xl:h-28 2xl:w-40" />
              </div>

              <div className="min-w-[270px]">
                <h1
                  className={`text-3xl font-black tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Cogni<span className="text-indigo-500">Haven</span>
                </h1>

                <p
                  className={`mt-1 max-w-[280px] text-sm font-medium leading-5 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  AI-powered cognitive wellness
                  <br />
                  and daily support.
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={desktopNavLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Desktop Account Controls */}
              <div className="flex shrink-0 items-center gap-2">
                {!isLoggedIn() && (
                  <>
                    <NavLink
                      to="/login"
                      className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isDarkMode
                          ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                          : "border-indigo-100 bg-white text-indigo-700"
                      }`}
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/signup"
                      className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}

                {isLoggedIn() && (
                  <UserMenu
                    onClick={() => setIsSettingsOpen(true)}
                  />
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU BACKDROP
          ========================================================= */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* =========================================================
          MOBILE SLIDE-OUT MENU
          ========================================================= */}
      <aside
        className={`fixed right-0 top-0 z-[55] flex h-dvh w-[88%] max-w-sm flex-col border-l shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full"
        } ${
          isDarkMode
            ? "border-white/10 bg-slate-950 text-white shadow-black/50"
            : "border-slate-200 bg-white text-slate-900 shadow-slate-900/20"
        }`}
      >
        {/* Mobile Menu Header */}
        <div
          className={`flex items-center justify-between border-b px-5 py-5 ${
            isDarkMode
              ? "border-white/10"
              : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <CogniHavenLogo className="h-11 w-11 object-contain" />

            <div>
              <p
                className={`text-lg font-black tracking-tight ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Cogni<span className="text-indigo-500">Haven</span>
              </p>

              <p
                className={`text-xs ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Your wellness space
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              isDarkMode
                ? "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
            aria-label="Close navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* =========================================================
            MOBILE NAVIGATION
            ========================================================= */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p
            className={`mb-3 px-3 text-xs font-bold uppercase tracking-[0.18em] ${
              isDarkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            Navigation
          </p>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={mobileNavLinkClass}
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>

                    <span
                      className={`text-lg ${
                        isActive
                          ? "text-white/80"
                          : isDarkMode
                            ? "text-slate-600"
                            : "text-slate-300"
                      }`}
                    >
                      ›
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* =========================================================
            MOBILE MENU FOOTER
            ========================================================= */}
        <div
          className={`border-t p-4 ${
            isDarkMode
              ? "border-white/10"
              : "border-slate-100"
          }`}
        >
          {isLoggedIn() ? (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isDarkMode
                  ? "bg-red-500/10 text-red-300 hover:bg-red-500/15"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              Log Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <NavLink
                to="/login"
                className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${
                  isDarkMode
                    ? "border-white/10 bg-white/10 text-white"
                    : "border-slate-200 bg-white text-indigo-700"
                }`}
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================
          SETTINGS DRAWER
          Shared between desktop and mobile.
          ========================================================= */}
      {isLoggedIn() && (
        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
    </>
  );
}

export default Navbar;