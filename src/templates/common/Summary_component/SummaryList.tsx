// src/templates/common/Summary_component/SummaryList.tsx


export default function SummaryList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}
