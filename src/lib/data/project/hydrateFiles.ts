// src/lib/data/project/hydrateFiles.ts

type GetJSON = (path: string) => any;

/**
 * hydrateFiles
 * --------------------------------------------------
 * Flat-file ONLY system.
 *
 * All project data is expected to be present
 * in a single JSON file.
 *
 * This function intentionally does nothing and
 * exists only to preserve the loader pipeline shape.
 */
export function hydrateFiles(
  project: any,
  _builder: string,
  _projectSlug: string,
  _getJSON: GetJSON
) {
  return project;
}
