// src/lib/debug/withSectionBoundary.tsx
import React from "react";
import { runtimeLog } from "@/lib/log/runtimeLog";

export function withSectionBoundary<P>(
  name: string,
  Component: React.ComponentType<P>
) {
  return function WrappedSection(props: P) {
    runtimeLog("Section", "info", `${name} props`, props);

    try {
      return <Component {...props} />;
    } catch (error) {
      runtimeLog("Section", "error", `${name} crashed`, error);
      return null;
    }
  };
}
