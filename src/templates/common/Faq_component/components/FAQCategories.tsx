// src/templates/common/FAQ/components/FAQCategories.tsx

export default function FAQCategories({
  categories = [],
  activeCategory,
  onSelectCategory,
}: {
  categories: { name: string; count: number }[];
  activeCategory?: string | null;
  onSelectCategory: (category: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-6 justify-center">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.name;

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition
              ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }
            `}
            aria-pressed={isActive}
          >
            {cat.name}
            <span className="ml-1 opacity-70">({cat.count})</span>
          </button>
        );
      })}
    </div>
  );
}
