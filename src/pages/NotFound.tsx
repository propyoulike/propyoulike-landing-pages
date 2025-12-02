import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: Route not found →", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Helmet>
        <title>404 – Page Not Found | PropYouLike</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="text-center animate-fade-in">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>

        <p className="mb-6 text-xl text-muted-foreground">
          Oops! The page you’re looking for doesn't exist.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            to="/"
            className="text-primary underline hover:text-primary/90 text-lg"
          >
            Return to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground underline hover:text-muted"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
