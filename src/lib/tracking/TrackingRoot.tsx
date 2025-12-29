import { ReactNode } from "react";
import { TrackingProvider } from "./TrackingContext";
import { useTrackingContext } from "./useTrackingContext";

/**
 * Router-aware tracking boundary
 * MUST be rendered inside RouterProvider
 */
export default function TrackingRoot({
  children,
}: {
  children: ReactNode;
}) {
  const context = useTrackingContext(); // ✅ safe here

  return (
    <TrackingProvider context={context}>
      {children}
    </TrackingProvider>
  );
}
