import { useNotificationStore } from "@/store/notificationStore";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export function NotificationContainer() {
  const notifications = useNotificationStore((state) => state.notifications);
  const remove = useNotificationStore((state) => state.remove);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-99999 flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-3 rounded-xl border bg-background/95 px-4 py-3 shadow-lg min-w-[220px]"
        >
          <span>
            {n.type === "success" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
            {n.type === "error" && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            {n.type === "info" && (
              <Info className="h-4 w-4 text-blue-500" />
            )}
          </span>
          <p className="flex-1 text-sm text-foreground">{n.message}</p>
          <button
            type="button"
            onClick={() => remove(n.id)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

