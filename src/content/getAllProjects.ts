const modules = import.meta.glob(
  "/src/content/projects/**/index.json",
  { eager: true }
);

export function getAllProjects() {
  return Object.values(modules).map((mod: any) => mod.default);
}
