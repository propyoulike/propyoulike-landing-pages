export function createProjectContext(project) {
  return {
    openCTA: () => {
      console.log("Open CTA for", project.projectName);
    },
    autoMenu: true
  };
}
