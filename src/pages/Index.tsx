import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { getFeaturedProjects } from "@/lib/data/project/getFeaturedProjects";
import ProjectCard from "@/components/project/ProjectCard";
import Footer from "@/components/footer/Footer";
import YouTubePlayer from "@/components/video/YouTubePlayer";

import brand from "@/content/global/propyoulike.json";

export default function IndexPage() {
  const { openCTA } = useLeadCTAContext();
  const featuredProjects = getFeaturedProjects(3);

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">

      {/* =================================================
         NAVBAR
      ================================================== */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={brand.logo} alt={brand.name} className="h-8 w-auto" />
            <span className="font-semibold tracking-tight">{brand.name}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#why" className="hover:text-foreground">Why us</a>
            {featuredProjects.length > 0 && (
              <a href="#projects" className="hover:text-foreground">Projects</a>
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
         HERO
      ================================================== */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Find RERA-registered new home projects.
              <br className="hidden md:block" />
              Compare clearly. Visit with confidence.
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Curated new home projects with honest guidance,
              assisted site visits, and no unsolicited communication.
            </p>

            <p className="mt-4 text-sm text-muted-foreground max-w-xl">
              Explore verified projects like{" "}
              <a
                href="/urbanrise-paradise-on-earth/"
                className="text-primary font-medium hover:underline"
              >
                Urbanrise Paradise on Earth
              </a>{" "}
              and other RERA-approved developments in Bengaluru.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={openCTA}
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                Get site visit assistance
              </button>

              <span className="text-sm text-muted-foreground self-center max-w-md">
                No brokerage • RERA compliant • Enquiry shared only with authorised developer teams
              </span>
            </div>
          </div>

          <YouTubePlayer
            videoId={brand.videoId}
            title="PropYouLike – How we help homebuyers"
          />
        </div>
      </section>

      {/* =================================================
         TRUST STRIP
      ================================================== */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span>✅ RERA Registered Channel Partner</span>
          <span>✅ No Brokerage for Buyers</span>
          <span>✅ Assisted Site Visits</span>
          <span>✅ No Spam, No Pressure</span>
        </div>
      </section>

      {/* =================================================
         WHY PROPYOULIKE
      ================================================== */}
      <section id="why" className="container mx-auto px-4 py-14 max-w-5xl text-center">
        <h2 className="text-2xl font-semibold">Why PropYouLike</h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-lg">Who we are</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A RERA-registered real estate advisory platform based in Bengaluru.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">What we do</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Curate verified projects, provide pricing clarity,
              and coordinate site visits.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">How we do it</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Verify → Understand → Visit → Assist → Decide
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
         FEATURED PROJECTS
      ================================================== */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="container mx-auto px-4 py-16 max-w-6xl">
          <h2 className="text-2xl font-semibold text-center">Featured projects</h2>

          <p className="mt-4 text-center text-muted-foreground">
            A selection of verified new home projects you can explore in detail.
          </p>

<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
  {featuredProjects.map((project) => {
    const slug = project.publicSlug || project.slug;
    if (!slug) return null;

    return (
      <a
        key={slug}
        href={`/${slug}/`}
        className="block group"
        aria-label={`View ${project.projectName}`}
      >
        <ProjectCard project={project} variant="homepage" />
      </a>
    );
  })}
</div>
        </section>
      )}

      {/* =================================================
         FINAL CTA
      ================================================== */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-semibold">
          Need help comparing or visiting these projects?
        </h3>
        <p className="mt-3 text-muted-foreground">
          Get unbiased guidance and assisted site visits — at no cost to buyers.
        </p>

        <button
          onClick={openCTA}
          className="mt-6 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          Get site visit assistance
        </button>
      </section>

      <Footer />
    </main>
  );
}
