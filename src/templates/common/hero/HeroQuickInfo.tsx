// src/templates/common/Hero/HeroQuickInfo.tsx

export default function HeroQuickInfo({
  quickInfo,
}: {
  quickInfo: {
    price?: string;
    typology?: string;
    location?: string;
    size?: string;
  };
}) {
  return (
    <div className="absolute bottom-0 w-full bg-background/85 backdrop-blur-md border-t border-border py-3 md:py-4 z-10">
      <div className="container grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center">
        {quickInfo.price && <Field label="Price" value={quickInfo.price} />}
        {quickInfo.typology && <Field label="Typology" value={quickInfo.typology} />}
        {quickInfo.location && <Field label="Location" value={quickInfo.location} />}
        {quickInfo.size && <Field label="Size" value={quickInfo.size} />}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm md:text-lg font-semibold">{value}</p>
    </div>
  );
}
