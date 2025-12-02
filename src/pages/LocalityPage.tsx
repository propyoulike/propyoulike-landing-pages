import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer/Footer";

const LocalityPage = () => {
  const { locality } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{locality ? `Properties in ${locality}` : "Locality Properties"} - PropYouLike</title>
        <meta
          name="description"
          content={`Discover premium real estate projects in ${locality || "this locality"}, Bangalore.`}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 capitalize">
          Properties in {locality}
        </h1>
        <p className="text-lg text-muted-foreground">
          Coming soon: Complete listing of properties in {locality}, Bangalore.
        </p>
      </div>

      <Footer locality={locality} />
    </div>
  );
};

export default LocalityPage;
