// src/lib/log/runtimeLog.ts
type LogLevel = "info" | "warn" | "error";

const ENABLED =
  import.meta.env.DEV ||
  import.meta.env.VITE_DEBUG === "true";

export function runtimeLog(
  scope: string,
  level: LogLevel,
  message: string,
  data?: unknown
) {
  if (!ENABLED) return;

  const prefix = `[${scope}]`;

  switch (level) {
    case "error":
      console.error(prefix, message, data);
      break;
    case "warn":
      console.warn(prefix, message, data);
      break;
    default:
      console.log(prefix, message, data);
  }
}
