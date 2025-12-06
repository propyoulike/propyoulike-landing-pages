import Footer from "@/components/footer/Footer";

interface ApartmentDefaultProps {
  project: any;
}

const ApartmentDefault = ({ project }: ApartmentDefaultProps) => {
  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">{project.projectName}</h1>
        <p className="text-muted-foreground">
          This is a default apartment template. Please configure a builder-specific template.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ApartmentDefault;
