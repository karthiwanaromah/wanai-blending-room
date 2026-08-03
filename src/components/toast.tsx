import {
  useState,
  useCallback,
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Toast context + provider
// ---------------------------------------------------------------------------

const ToastContext = createContext<((options: Omit<Toast, "id">) => number) | null>(null);

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    barClass: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-500",
    barClass: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    barClass: "bg-amber-500",
  },
  info: {
    icon: Info,
    iconClass: "text-sky-500",
    barClass: "bg-sky-500",
  },
};

type Toast = {
  id: number;
  title?: string;
  message?: string;
  variant?: keyof typeof VARIANTS;
  duration?: number;
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const { title, message, variant = "info", duration = 4000 } = toast;
  const {
    icon: Icon,
    iconClass,
    barClass,
  } = VARIANTS[variant] ?? VARIANTS.info;
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startDismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [onDismiss, toast.id]);

  // pause-on-hover auto-dismiss
  const startTimer = useCallback(() => {
    if (duration === Infinity) return;
    timerRef.current = setTimeout(startDismiss, duration);
  }, [duration, startDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // start timer on mount
  useState(() => {
    startTimer();
    return clearTimer;
  });

  return (
    <div
      role="status"
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className={`relative flex w-80 items-start gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 transition-all duration-200 ease-out
        ${leaving ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconClass}`}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        {title && (
          <p className="text-sm font-semibold text-slate-900">{title}</p>
        )}
        {message && (
          <p className={`text-sm text-slate-500 ${title ? "mt-0.5" : ""}`}>
            {message}
          </p>
        )}
      </div>

      <button
        onClick={startDismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>

      {duration !== Infinity && (
        <span
          className={`absolute bottom-0 left-0 h-0.5 ${barClass} animate-[toast-shrink_var(--duration)_linear_forwards]`}
          style={
            { ["--duration" as any]: `${duration}ms` } as React.CSSProperties
          }
        />
      )}
    </div>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: Omit<Toast, "id">) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, ...options }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

// function Demo() {
//   const toast = useToast();

//   const buttons = [
//     { label: "Success", variant: "success", title: "Changes saved", message: "Your profile has been updated." },
//     { label: "Error", variant: "error", title: "Upload failed", message: "Check your connection and try again." },
//     { label: "Warning", variant: "warning", title: "Storage almost full", message: "You're at 92% of your quota." },
//     { label: "Info", variant: "info", title: "New version available", message: "Refresh to get the latest features." },
//   ];

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
//       <div className="flex flex-wrap justify-center gap-3">
//         {buttons.map((b) => (
//           <button
//             key={b.label}
//             onClick={() =>
//               toast({ variant: b.variant, title: b.title, message: b.message })
//             }
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
//           >
//             {b.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
