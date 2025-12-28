// src/lib/runtime/assertRouterContext.ts
import { useInRouterContext } from "react-router-dom";
import { runtimeLog } from "@/lib/log/runtimeLog";

export function assertRouterContext(component: string) {
  const inRouter = useInRouterContext();

  if (!inRouter) {
    runtimeLog("Runtime", "fatal", "Router context missing", {
      component,
      hint: "Component rendered outside <Router>",
    });
  }

  return inRouter;
}
