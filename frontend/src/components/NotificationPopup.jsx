/*
 * NotificationPopup
 * -----------------
 * Displays temporary in-app notifications.
 *
 * Used for:
 * - journal reminders
 * - medication reminders
 * - goal reminders
 */
function NotificationPopup({
  visibleNotifications,
  setVisibleNotifications
}) {
  if (!visibleNotifications || visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm space-y-3">
      {visibleNotifications.map((notification, index) => (
        <div
          key={index}
          className="animate-fade-in rounded-2xl border border-amber-200 bg-amber-50/95 p-4 shadow-xl shadow-amber-100 backdrop-blur"
        >
          <p className="text-sm font-semibold text-amber-900">
            {notification.type}
          </p>

          <p className="mt-1 text-sm text-amber-800">
            {notification.message}
          </p>

          <div className="mt-3 flex items-center gap-3">
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
              >
                Go
              </a>
            )}

            <button
              onClick={() =>
                setVisibleNotifications((prev) =>
                  prev.filter((_, i) => i !== index)
                )
              }
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationPopup;