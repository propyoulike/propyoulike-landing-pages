export default function FAQCategories({
  categories = [],
  onSelectCategory,
}: {
  categories: { name: string; count: number }[];
  onSelectCategory: (category: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-6">
      {categories.map((cat, idx) => (
        <button
          key={`${cat.name}-${idx}`}
          onClick={() => onSelectCategory(cat.name)}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 text-sm"
        >
          {cat.name} ({cat.count})
        </button>
      ))}
    </div>
  );
}
