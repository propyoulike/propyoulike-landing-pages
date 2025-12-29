import { useLocation } from "react-router-dom";

export function useTrackingContext() {
  const location = useLocation();

  return {
    page_path: location.pathname,
    page_title: document.title,
  };
}
