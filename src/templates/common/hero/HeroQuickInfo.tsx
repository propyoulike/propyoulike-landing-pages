// src/templates/common/Hero/HeroQuickInfo.tsx

interface QuickInfo {
  price?: string;
  typology?: string;
  location?: string;
  size?: string;
}

export default function HeroQuickInfo({ quickInfo }: { quickInfo: QuickInfo }) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-10 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="container py-3 md:py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center">
          {quickInfo.price && (
            <Field label="Price" value={quickInfo.price} />
          )}
          {quickInfo.typology && (
            <Field label="Typology" value={quickInfo.typology} />
          )}
          {quickInfo.location && (
            <Field label="Location" value={quickInfo.location} />
          )}
          {quickInfo.size && (
            <Field label="Size" value={quickInfo.size} />
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm md:text-base font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}
