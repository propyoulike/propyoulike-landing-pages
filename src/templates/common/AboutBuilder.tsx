interface AboutBuilderProps {
  builder: string;
  builderDisplayName: string;
}

export default function AboutBuilder({
  builder,
  builderDisplayName,
}: AboutBuilderProps) {
  if (!builder) return null;

  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-xl font-semibold">
        About {builderDisplayName}
      </h2>

      <p className="mt-4 text-muted-foreground">
        <a
          href={`/${builder}/`}
          className="text-primary font-medium hover:underline"
        >
          View all {builderDisplayName} projects
        </a>{" "}
        with pricing, floor plans, and assisted site visits.
      </p>
    </section>
  );
}
