import { Star } from "lucide-react";

export default function StarRating({ rating = 0 }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 md:w-5 md:h-5 ${
            star <= rating
              ? "text-accent fill-accent"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}
