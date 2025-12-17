// src/templates/common/Summary_component/SummaryList.tsx

export default function SummaryList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
          <span className="text-muted-foreground leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
