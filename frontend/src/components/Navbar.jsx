import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { isLoggedIn } from "../services/api";
import CogniHavenLogo from "./CogniHavenLogo";
import UserMenu from "./user/UserMenu";
import SettingsDrawer from "./user/SettingsDrawer";

/*
 * Navbar
 * ------
 * Main app navigation.
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
  handleDeleteAccount
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
      : isDarkMode
        ? "text-slate-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
        : "text-slate-600 hover:-translate-y-0.5 hover:bg-white hover:text-indigo-700 hover:shadow-sm"
    }`;


  return (
    <header
      className={`sticky top-0 z-40 border-b shadow-sm backdrop-blur-xl transition-colors duration-300 ${isDarkMode
        ? "border-white/10 bg-slate-950/75 shadow-black/30"
        : "border-white/60 bg-white/75 shadow-slate-200/40"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="transition group-hover:scale-105">
              <CogniHavenLogo className="h-30 w-60 object-contain" />
            </div>

            <div>
              <h1
                className={`text-2xl font-black tracking-tight sm:text-3xl ${isDarkMode ? "text-white" : "text-slate-900"
                  }`}
              >
                Cogni<span className="text-indigo-500">Haven</span>
              </h1>

              <p
                className={`text-xs font-medium sm:text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
              >
                AI-powered cognitive wellness and daily support.
              </p>
            </div>
          </Link>

          <nav className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/journal" className={navLinkClass}>
                Journal
              </NavLink>

              <NavLink to="/memory" className={navLinkClass}>
                Memory
              </NavLink>

              <NavLink to="/dietary" className={navLinkClass}>
                Dietary
              </NavLink>

              <NavLink to="/games" className={navLinkClass}>
                Games
              </NavLink>

              <NavLink to="/medication" className={navLinkClass}>
                Medication
              </NavLink>

              <NavLink to="/analytics" className={navLinkClass}>
                Analytics
              </NavLink>

              <NavLink to="/community" className={navLinkClass}>
                Community
              </NavLink>

              <NavLink to="/goals" className={navLinkClass}>
                MyGoals
              </NavLink>

              <NavLink to="/achievements" className={navLinkClass}>
                Achievements
              </NavLink>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              {!isLoggedIn() && (
                <>
                  <NavLink
                    to="/login"
                    className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDarkMode
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
                <>
                  <UserMenu onClick={() => setIsSettingsOpen(true)} />

                  <SettingsDrawer
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    onLogout={handleLogout}
                    onDeleteAccount={handleDeleteAccount}
                  />


                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;