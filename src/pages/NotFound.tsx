// src/pages/NotFound.tsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ---------------------------------------
     Dev-only logging
  ---------------------------------------- */
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("❌ 404 – Route not found:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-muted px-4"
      role="main"
      aria-labelledby="not-found-title"
    >
      <Helmet>
        <title>404 – Page Not Found | PropYouLike</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="text-center animate-fade-in max-w-md">
        <h1
          id="not-found-title"
          className="mb-4 text-6xl font-bold text-primary"
        >
          404
        </h1>

        <p className="mb-6 text-xl text-muted-foreground">
          Oops! The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex flex-col items-center gap-4">
          {/* Primary action */}
          <Link
            to="/"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold
                       hover:bg-primary/90 transition focus:outline-none focus:ring-2
                       focus:ring-primary focus:ring-offset-2"
          >
            Go to Home
          </Link>

          {/* Secondary action */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground underline
                       hover:text-foreground transition"
          >
            Go back to previous page
          </button>
        </div>
      </section>
    </main>
  );
}
