// src/lib/dev/guard.ts

export function guardArray(
  value: unknown,
  name: string,
  component: string
): asserts value is any[] {
  if (import.meta.env.DEV && !Array.isArray(value)) {
    throw new Error(
      `[${component}] Expected "${name}" to be an array, received: ${typeof value}`
    );
  }
}

export function guardObject(
  value: unknown,
  name: string,
  component: string
): asserts value is Record<string, any> {
  if (
    import.meta.env.DEV &&
    (typeof value !== "object" || value === null)
  ) {
    throw new Error(
      `[${component}] Expected "${name}" to be an object`
    );
  }
}
