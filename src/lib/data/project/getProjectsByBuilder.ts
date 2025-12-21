// src/lib/data/project/getProjectsByBuilder.ts

export function getProjectsByBuilder(
  projects: any[],
  builder: string
) {
  const b = builder.toLowerCase();

  return projects.filter(
    (p) => p.builder?.toLowerCase() === b
  );
}
