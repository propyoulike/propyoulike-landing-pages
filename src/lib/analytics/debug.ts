// src/lib/analytics/debug.ts

import { EventName } from "./events";

export function debugEvent(
  name: EventName,
  properties: Record<string, any>
) {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.groupCollapsed(
    `%c📊 ${name}`,
    "color:#22c55e;font-weight:600"
  );

  if (Object.keys(properties).length > 0) {
    console.table(properties);
  } else {
    console.info("No properties");
  }

  console.groupEnd();
}
