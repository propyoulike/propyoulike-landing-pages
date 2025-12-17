// src/components/ui/StarRating.tsx

import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number; // supports 0–5, including decimals
}

export default function StarRating({ rating = 0 }: StarRatingProps) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);

        return (
          <Star
            key={star}
            aria-hidden="true"
            className={[
              "w-4 h-4 md:w-5 md:h-5 transition-colors",
              filled
                ? "text-primary fill-primary"
                : "text-muted-foreground/30",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
