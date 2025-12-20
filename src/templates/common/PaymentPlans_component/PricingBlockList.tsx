// src/templates/common/PaymentPlans/PricingBlockList.tsx

interface PricingBlockListProps {
  blocks?: {
    title?: string;
    items?: string[];
  }[];
}

export default function PricingBlockList({
  blocks = [],
}: PricingBlockListProps) {
  if (!blocks.length) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <div key={i}>
          {block.title && (
            <h4 className="font-semibold mb-2">
              {block.title}
            </h4>
          )}

          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {(block.items ?? []).map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
