import logo from "../assets/cognihaven-logo.png";

/*
 * CogniHavenLogo
 * ---------------
 * Reusable logo component used throughout the app.
 *
 * Benefits:
 * - One place to update branding
 * - Consistent sizing
 * - Easy reuse across pages
 */
function CogniHavenLogo({ className = "" }) {
  return (
    <img
      src={logo}
      alt="CogniHaven Logo"
      className={`object-contain ${className}`}
    />
  );
}

export default CogniHavenLogo;