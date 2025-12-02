import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer/Footer";

const BuilderPage = () => {
  const { builder } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{builder ? `${builder} Projects` : "Builder Projects"} - PropYouLike</title>
        <meta
          name="description"
          content={`Explore premium real estate projects by ${builder || "this builder"} in Bangalore.`}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 capitalize">
          {builder} Projects
        </h1>
        <p className="text-lg text-muted-foreground">
          Coming soon: Complete listing of {builder} projects in Bangalore.
        </p>
      </div>

      <Footer builder={builder} />
    </div>
  );
};

export default BuilderPage;
