import { isValidElementType } from "react-is";

/**
 * Normalize a registry entry into a renderable React component.
 *
 * Handles:
 * - function components
 * - memo(...)
 * - forwardRef(...)
 * - lazy(...)
 * - default exports
 */
export function normalizeComponent(
  entry: unknown,
  key: string
): React.ElementType | null {
  const Component =
    typeof entry === "object" && entry !== null && "default" in entry
      ? (entry as any).default
      : entry;

  if (!isValidElementType(Component)) {
    console.error("❌ Invalid component registry entry", {
      key,
      entry,
      resolvedType: typeof Component,
    });
    return null;
  }

  return Component;
}
