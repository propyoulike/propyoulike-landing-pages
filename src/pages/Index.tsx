import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { getFeaturedProjects } from "@/lib/data/project/getFeaturedProjects";
import ProjectCard from "@/components/project/ProjectCard";
import Footer from "@/components/footer/Footer";

export default function IndexPage() {
  const { openCTA } = useLeadCTAContext();
  const featuredProjects = getFeaturedProjects(3);

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">

      {/* =================================================
         Navbar
      ================================================== */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight">
            PropYouLike
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#who" className="hover:text-foreground">Who we are</a>
            <a href="#what" className="hover:text-foreground">What we do</a>
            <a href="#how" className="hover:text-foreground">How we do it</a>
            {featuredProjects.length > 0 && (
              <a href="#projects" className="hover:text-foreground">
                Projects
              </a>
            )}
          </nav>

          <button
            onClick={openCTA}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            Get site visit assistance
          </button>
        </div>
      </header>

      {/* =================================================
         Hero
      ================================================== */}
      <section className="container mx-auto px-4 py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
          Find verified new homes.  
          Compare clearly. Visit with confidence.
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Curated new home projects with honest guidance,
          assisted site visits, and zero spam.
        </p>

        <div className="mt-10">
          <button
            onClick={openCTA}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Get site visit assistance
          </button>
        </div>
      </section>

      {/* =================================================
         Who / What / How (unchanged, trimmed for clarity)
      ================================================== */}
      <section id="who" className="container mx-auto px-4 py-24 max-w-4xl text-center">
        <h2 className="text-2xl font-semibold">Who we are</h2>
        <p className="mt-4 text-muted-foreground">
          We help buyers choose the right new home with clarity,
          honest guidance, and human support.
        </p>
      </section>

      <section id="what" className="container mx-auto px-4 py-24 max-w-5xl text-center">
        <h2 className="text-2xl font-semibold">What we do</h2>
        <p className="mt-4 text-muted-foreground">
          Curate projects, assist site visits, and support confident decisions.
        </p>
      </section>

      <section id="how" className="container mx-auto px-4 py-24 max-w-5xl text-center">
        <h2 className="text-2xl font-semibold">How we do it</h2>
        <p className="mt-4 text-muted-foreground">
          Verify → Understand → Visit → Assist → Decide
        </p>
      </section>

      {/* =================================================
         Featured Projects (RIGHT WAY)
      ================================================== */}
      {featuredProjects.length > 0 && (
        <section
          id="projects"
          className="container mx-auto px-4 py-28 max-w-6xl"
        >
          <h2 className="text-2xl font-semibold text-center">
            Featured projects
          </h2>

          <p className="mt-4 text-center text-muted-foreground">
            A small selection of verified new home projects you can explore in detail.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <ProjectCard
                key={project.slug}
                project={project}
		variant="homepage"
              />
            ))}
          </div>
        </section>
      )}

      {/* =================================================
         Footer
      ================================================== */}
	<Footer />

    </main>
  );
}
